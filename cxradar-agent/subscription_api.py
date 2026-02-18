#!/usr/bin/env python3
"""
CX Radar subscription API.

Endpoints:
- POST /api/subscribe    {"email":"user@example.com"}
- POST /api/unsubscribe  {"email":"user@example.com"} or {"token":"..."}
- GET  /api/unsubscribe?token=...
"""

from __future__ import annotations

import json
import os
import re
import sqlite3
import threading
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "subscribers.db"

EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,63}$")
LOCK = threading.Lock()

IP_LIMIT_PER_HOUR = int(os.getenv("CXRADAR_IP_LIMIT_PER_HOUR", "30"))
EMAIL_LIMIT_PER_HOUR = int(os.getenv("CXRADAR_EMAIL_LIMIT_PER_HOUR", "6"))


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def normalized_email(email: str) -> str:
    return email.strip().lower()


def is_valid_email(email: str) -> bool:
    if not email:
        return False
    return EMAIL_RE.match(email.strip()) is not None


def init_db() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS subscribers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                normalized_email TEXT NOT NULL UNIQUE,
                status TEXT NOT NULL CHECK(status IN ('active','unsubscribed')),
                unsubscribe_token TEXT NOT NULL UNIQUE,
                source_ip TEXT,
                user_agent TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                unsubscribed_at TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS rate_limits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key_type TEXT NOT NULL,
                key_value TEXT NOT NULL,
                bucket_start INTEGER NOT NULL,
                count INTEGER NOT NULL DEFAULT 0,
                UNIQUE(key_type, key_value, bucket_start)
            )
            """
        )
        conn.commit()


def generate_token(email: str) -> str:
    import secrets

    slug = normalized_email(email).replace("@", "_at_").replace(".", "_")
    return f"{slug}_{secrets.token_urlsafe(24)}"


def hour_bucket() -> int:
    now_ts = int(datetime.now(timezone.utc).timestamp())
    return now_ts - (now_ts % 3600)


def bump_limit(conn: sqlite3.Connection, key_type: str, key_value: str) -> int:
    bucket = hour_bucket()
    conn.execute(
        """
        INSERT INTO rate_limits(key_type, key_value, bucket_start, count)
        VALUES (?, ?, ?, 1)
        ON CONFLICT(key_type, key_value, bucket_start)
        DO UPDATE SET count = count + 1
        """,
        (key_type, key_value, bucket),
    )
    row = conn.execute(
        "SELECT count FROM rate_limits WHERE key_type = ? AND key_value = ? AND bucket_start = ?",
        (key_type, key_value, bucket),
    ).fetchone()
    return int(row[0]) if row else 0


def subscribe(email: str, source_ip: str, user_agent: str) -> tuple[int, dict]:
    if not is_valid_email(email):
        return 400, {"ok": False, "error": "Invalid email format"}

    n_email = normalized_email(email)
    with LOCK:
        with sqlite3.connect(DB_PATH) as conn:
            ip_hits = bump_limit(conn, "ip_subscribe", source_ip or "unknown")
            email_hits = bump_limit(conn, "email_subscribe", n_email)

            if ip_hits > IP_LIMIT_PER_HOUR or email_hits > EMAIL_LIMIT_PER_HOUR:
                conn.commit()
                return 429, {"ok": False, "error": "Too many attempts. Please try later."}

            row = conn.execute(
                "SELECT id, status, unsubscribe_token FROM subscribers WHERE normalized_email = ?",
                (n_email,),
            ).fetchone()

            now = utc_now_iso()
            if row:
                sub_id, status, token = row
                if status == "active":
                    conn.commit()
                    return 200, {"ok": True, "message": "This email is already subscribed."}
                conn.execute(
                    """
                    UPDATE subscribers
                    SET status = 'active',
                        updated_at = ?,
                        unsubscribed_at = NULL,
                        source_ip = ?,
                        user_agent = ?
                    WHERE id = ?
                    """,
                    (now, source_ip, user_agent, sub_id),
                )
                conn.commit()
                return 200, {"ok": True, "message": "Subscription reactivated.", "token": token}

            token = generate_token(n_email)
            conn.execute(
                """
                INSERT INTO subscribers (
                    email, normalized_email, status, unsubscribe_token,
                    source_ip, user_agent, created_at, updated_at
                )
                VALUES (?, ?, 'active', ?, ?, ?, ?, ?)
                """,
                (email.strip(), n_email, token, source_ip, user_agent, now, now),
            )
            conn.commit()
            return 201, {"ok": True, "message": "Subscription confirmed.", "token": token}


def unsubscribe_by_email(email: str, source_ip: str) -> tuple[int, dict]:
    if not is_valid_email(email):
        return 400, {"ok": False, "error": "Invalid email format"}

    n_email = normalized_email(email)
    with LOCK:
        with sqlite3.connect(DB_PATH) as conn:
            ip_hits = bump_limit(conn, "ip_unsubscribe", source_ip or "unknown")
            email_hits = bump_limit(conn, "email_unsubscribe", n_email)
            if ip_hits > IP_LIMIT_PER_HOUR or email_hits > EMAIL_LIMIT_PER_HOUR:
                conn.commit()
                return 429, {"ok": False, "error": "Too many attempts. Please try later."}

            now = utc_now_iso()
            conn.execute(
                """
                UPDATE subscribers
                SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?
                WHERE normalized_email = ?
                """,
                (now, now, n_email),
            )
            conn.commit()

    # Do not leak if email exists.
    return 200, {"ok": True, "message": "If subscribed, this email has been unsubscribed."}


def unsubscribe_by_token(token: str, source_ip: str) -> tuple[int, dict]:
    if not token or len(token) < 20:
        return 400, {"ok": False, "error": "Invalid unsubscribe token"}

    with LOCK:
        with sqlite3.connect(DB_PATH) as conn:
            ip_hits = bump_limit(conn, "ip_unsubscribe_token", source_ip or "unknown")
            if ip_hits > IP_LIMIT_PER_HOUR:
                conn.commit()
                return 429, {"ok": False, "error": "Too many attempts. Please try later."}
            now = utc_now_iso()
            changed = conn.execute(
                """
                UPDATE subscribers
                SET status = 'unsubscribed', updated_at = ?, unsubscribed_at = ?
                WHERE unsubscribe_token = ?
                """,
                (now, now, token),
            ).rowcount
            conn.commit()

    if changed == 0:
        return 404, {"ok": False, "error": "Subscription not found"}
    return 200, {"ok": True, "message": "Unsubscribed successfully."}


class Handler(BaseHTTPRequestHandler):
    server_version = "cxradar-subscription-api/0.1"

    def _json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", os.getenv("CXRADAR_CORS_ORIGIN", "*"))
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def _client_ip(self) -> str:
        forwarded = self.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return self.client_address[0] if self.client_address else "unknown"

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8", errors="replace")
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {}

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", os.getenv("CXRADAR_CORS_ORIGIN", "*"))
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self._json(200, {"ok": True, "service": "cxradar-subscription-api"})
            return
        if parsed.path == "/api/unsubscribe":
            token = parse_qs(parsed.query).get("token", [""])[0]
            status, payload = unsubscribe_by_token(token, self._client_ip())
            self._json(status, payload)
            return
        self._json(404, {"ok": False, "error": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        body = self._read_json()
        ip = self._client_ip()
        ua = self.headers.get("User-Agent", "")

        if parsed.path == "/api/subscribe":
            status, payload = subscribe(body.get("email", ""), ip, ua)
            self._json(status, payload)
            return

        if parsed.path == "/api/unsubscribe":
            token = body.get("token", "")
            if token:
                status, payload = unsubscribe_by_token(token, ip)
            else:
                status, payload = unsubscribe_by_email(body.get("email", ""), ip)
            self._json(status, payload)
            return

        self._json(404, {"ok": False, "error": "Not found"})


def main() -> int:
    init_db()
    host = os.getenv("CXRADAR_API_HOST", "127.0.0.1")
    port = int(os.getenv("CXRADAR_API_PORT", "8787"))
    httpd = ThreadingHTTPServer((host, port), Handler)
    print(f"[INFO] CX Radar subscription API listening on http://{host}:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
