#!/usr/bin/env python3
"""
CX Radar MVP agent.

Features:
- Pulls RSS/Atom sources from sources.json
- Classifies and scores items for PM relevance
- Generates markdown + HTML digest
- Optionally sends digest by email via SMTP
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import smtplib
import ssl
import sqlite3
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from email.utils import parsedate_to_datetime
from html import escape
from pathlib import Path
from typing import Dict, List
from urllib.error import URLError
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parent
SOURCES_FILE = ROOT / "sources.json"
OUT_DIR = ROOT / "out"
DB_PATH = ROOT / "data" / "subscribers.db"


@dataclass
class Item:
    source: str
    title: str
    link: str
    summary: str
    published: datetime
    tags: List[str]
    topic: str
    score_total: int
    score_parts: Dict[str, int]
    alert_level: str


KEYWORDS = {
    "pricing": ["pricing", "price", "bundle", "packaging", "seat", "plan"],
    "ai": ["ai", "agent", "assistant", "copilot", "automation", "generative"],
    "compliance": ["regulation", "compliance", "fcc", "gdpr", "hipaa", "security"],
    "platform": ["launch", "release", "integration", "api", "workflow", "contact center", "ucaas", "ccaas"],
    "customer_pain": ["outage", "downtime", "latency", "incident", "churn", "complaint"],
}

COMPETITOR_HINTS = {
    "Talkdesk": ["talkdesk"],
    "Five9": ["five9"],
    "Genesys": ["genesys"],
    "RingCentral": ["ringcentral"],
    "NICE": ["nice cxone", "nice"],
    "Zoom": ["zoom contact center", "zoom"],
    "Amazon Connect": ["amazon connect"],
    "Twilio": ["twilio flex", "twilio"],
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run CX Radar MVP agent")
    parser.add_argument("--days", type=int, default=7, help="Lookback window in days")
    parser.add_argument("--top", type=int, default=20, help="Max items in digest")
    parser.add_argument("--send-email", action="store_true", help="Send digest through SMTP")
    parser.add_argument("--sources", type=Path, default=SOURCES_FILE, help="Path to sources JSON")
    return parser.parse_args()


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
            value = value[1:-1]
        if key and key not in os.environ:
            os.environ[key] = value


def getenv_any(*keys: str, default: str = "") -> str:
    for key in keys:
        value = os.getenv(key)
        if value:
            return value
    return default


def as_bool(value: str, default: bool) -> bool:
    if not value:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def read_sources(path: Path) -> List[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    sources = data.get("sources", [])
    if not sources:
        raise ValueError(f"No sources found in {path}")
    return sources


def fetch_url(url: str, timeout: int = 20) -> str:
    req = Request(
        url,
        headers={
            "User-Agent": "cxradar-agent/0.1 (+https://legnalabs.com)",
            "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml",
        },
    )
    with urlopen(req, timeout=timeout) as res:  # nosec B310
        return res.read().decode("utf-8", errors="replace")


def _find_text(node: ET.Element, paths: List[str]) -> str:
    for path in paths:
        found = node.find(path)
        if found is not None and found.text:
            return found.text.strip()
    return ""


def parse_datetime(raw: str) -> datetime:
    if not raw:
        return datetime.now(timezone.utc)
    raw = raw.strip()
    try:
        dt = parsedate_to_datetime(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        pass
    try:
        dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def parse_feed(xml_text: str, source_name: str, source_tags: List[str]) -> List[dict]:
    root = ET.fromstring(xml_text)
    items: List[dict] = []

    # RSS
    for node in root.findall(".//item"):
        title = _find_text(node, ["title"])
        link = _find_text(node, ["link"])
        summary = _find_text(node, ["description", "summary"])
        published = _find_text(node, ["pubDate", "published", "dc:date"])
        items.append(
            {
                "source": source_name,
                "title": title or "(untitled)",
                "link": link,
                "summary": strip_html(summary),
                "published": parse_datetime(published),
                "tags": source_tags,
            }
        )

    # Atom
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    for node in root.findall(".//atom:entry", ns):
        title = _find_text(node, ["atom:title"])
        link_el = node.find("atom:link", ns)
        link = ""
        if link_el is not None:
            link = link_el.attrib.get("href", "")
        summary = _find_text(node, ["atom:summary", "atom:content"])
        published = _find_text(node, ["atom:updated", "atom:published"])
        items.append(
            {
                "source": source_name,
                "title": title or "(untitled)",
                "link": link,
                "summary": strip_html(summary),
                "published": parse_datetime(published),
                "tags": source_tags,
            }
        )

    return items


def strip_html(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def classify_topic(text: str) -> str:
    t = text.lower()
    if any(k in t for k in KEYWORDS["pricing"]):
        return "Pricing/Packaging"
    if any(k in t for k in KEYWORDS["ai"]):
        return "AI/Automation"
    if any(k in t for k in KEYWORDS["compliance"]):
        return "Regulatory/Compliance"
    if any(k in t for k in KEYWORDS["customer_pain"]):
        return "Operational Risk"
    return "Product/Platform"


def score_item(title: str, summary: str) -> Dict[str, int]:
    text = f"{title} {summary}".lower()

    strategic = 2
    customer = 2
    revenue = 2
    urgency = 1

    if any(k in text for k in KEYWORDS["ai"]):
        strategic += 2
        customer += 1
    if any(k in text for k in KEYWORDS["pricing"]):
        strategic += 1
        revenue += 2
    if any(k in text for k in KEYWORDS["compliance"]):
        urgency += 2
        strategic += 1
    if any(k in text for k in KEYWORDS["customer_pain"]):
        urgency += 2
        customer += 2
    if any(k in text for k in ["launch", "ga", "general availability", "announce", "new"]):
        strategic += 1

    parts = {
        "strategic_relevance": min(strategic, 5),
        "customer_impact": min(customer, 5),
        "revenue_impact": min(revenue, 5),
        "urgency": min(urgency, 5),
    }
    return parts


def alert_level(total: int) -> str:
    if total >= 15:
        return "High"
    if total >= 10:
        return "Medium"
    return "Low"


def digest_id(link: str, title: str) -> str:
    return hashlib.sha1(f"{link}|{title}".encode("utf-8")).hexdigest()


def build_items(sources: List[dict], lookback_days: int) -> List[Item]:
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=lookback_days)
    seen = set()
    collected: List[Item] = []

    for source in sources:
        if source.get("type") != "rss":
            continue
        name = source["name"]
        url = source["url"]
        tags = source.get("tags", [])

        try:
            xml_text = fetch_url(url)
            parsed = parse_feed(xml_text, name, tags)
        except (URLError, TimeoutError, ET.ParseError, ValueError) as exc:
            print(f"[WARN] Failed source {name}: {exc}", file=sys.stderr)
            continue

        for row in parsed:
            if row["published"] < cutoff:
                continue
            uid = digest_id(row["link"], row["title"])
            if uid in seen:
                continue
            seen.add(uid)

            parts = score_item(row["title"], row["summary"])
            total = sum(parts.values())
            text = f"{row['title']} {row['summary']}"
            collected.append(
                Item(
                    source=row["source"],
                    title=row["title"],
                    link=row["link"],
                    summary=row["summary"],
                    published=row["published"],
                    tags=row["tags"],
                    topic=classify_topic(text),
                    score_total=total,
                    score_parts=parts,
                    alert_level=alert_level(total),
                )
            )

    collected.sort(key=lambda i: (i.score_total, i.published), reverse=True)
    return collected


def detect_competitor(item: Item) -> str:
    text = f"{item.source} {item.title} {item.summary}".lower()
    for name, hints in COMPETITOR_HINTS.items():
        if any(h in text for h in hints):
            return name
    return ""


def why_it_matters(item: Item) -> str:
    if item.topic == "AI/Automation":
        return "Can shift buyer expectations for automation, self-service, and agent-assist capabilities."
    if item.topic == "Pricing/Packaging":
        return "May affect win rates, deal strategy, and packaging competitiveness in active opportunities."
    if item.topic == "Regulatory/Compliance":
        return "Could introduce roadmap obligations and go-to-market constraints."
    if item.topic == "Operational Risk":
        return "Signals reliability and trust risks that can directly influence churn and renewal conversations."
    return "May influence near-term roadmap prioritization and market positioning."


def suggested_action(item: Item) -> str:
    if item.topic == "AI/Automation":
        return "Run a quick parity check and prioritize the highest-impact AI capability gap."
    if item.topic == "Pricing/Packaging":
        return "Review pricing/packaging narrative with sales and define response options for top deals."
    if item.topic == "Regulatory/Compliance":
        return "Assess compliance impact and create an owner-assigned mitigation task."
    if item.topic == "Operational Risk":
        return "Prepare customer-facing guidance and monitor related support/churn signals."
    return "Capture this signal in roadmap review and validate impact with PMM/sales."


def limit_text(text: str, max_len: int = 210) -> str:
    cleaned = re.sub(r"\s+", " ", (text or "")).strip()
    if len(cleaned) <= max_len:
        return cleaned
    return cleaned[: max_len - 1].rstrip() + "..."


def split_sections(items: List[Item]) -> Dict[str, List[Item]]:
    sections = {"competitors": [], "market": [], "regulatory": [], "risk": []}
    for item in items:
        has_competitor_tag = "competitor" in item.tags
        if has_competitor_tag or detect_competitor(item):
            sections["competitors"].append(item)
        elif item.topic == "Regulatory/Compliance":
            sections["regulatory"].append(item)
        elif item.topic == "Operational Risk":
            sections["risk"].append(item)
        else:
            sections["market"].append(item)
    return sections


def _section_markdown(title: str, items: List[Item], include_competitor: bool = False) -> List[str]:
    lines = [f"## {title}", ""]
    if not items:
        return lines + ["- No major updates this cycle.", ""]
    for idx, item in enumerate(items, start=1):
        competitor = detect_competitor(item) if include_competitor else ""
        comp_line = f" · Competitor: {competitor}" if competitor else ""
        lines.extend(
            [
                f"{idx}. **{item.title}**",
                f"   - Source: {item.source}{comp_line}",
                f"   - Topic: {item.topic}",
                f"   - Priority: {item.alert_level} ({item.score_total}/20)",
                f"   - Why it matters: {why_it_matters(item)}",
                f"   - Suggested PM action: {suggested_action(item)}",
                f"   - Link: {item.link or '(missing)'}",
                "",
            ]
        )
    return lines


def render_markdown(items: List[Item], lookback_days: int, generated_at: datetime) -> str:
    sections = split_sections(items)
    high = [i for i in items if i.alert_level == "High"]
    medium = [i for i in items if i.alert_level == "Medium"]
    low = [i for i in items if i.alert_level == "Low"]

    top_signal = items[0].title if items else "No high-impact signal detected this cycle"
    top_comp = sections["competitors"][0].title if sections["competitors"] else "No major competitor move detected"

    lines = [
        "# CX Radar Weekly Brief",
        "",
        f"- Generated (UTC): {generated_at.strftime('%Y-%m-%d %H:%M')}",
        f"- Lookback window: last {lookback_days} days",
        f"- Total tracked items: {len(items)}",
        f"- High: {len(high)} | Medium: {len(medium)} | Low: {len(low)}",
        "",
        "## Executive Summary",
        "",
        f"- Top signal: {top_signal}",
        f"- Competitor headline: {top_comp}",
        "- Focus this week: align roadmap response for top AI/pricing shifts and monitor regulatory risk.",
        "",
    ]
    lines.extend(_section_markdown("What's New From Competitors", sections["competitors"], include_competitor=True))
    lines.extend(_section_markdown("Main Industry News", sections["market"]))
    lines.extend(_section_markdown("Regulatory & Compliance Watch", sections["regulatory"]))
    lines.extend(_section_markdown("Operational Risk Signals", sections["risk"]))
    lines.extend(
        [
            "## Notes",
            "",
            "- Facts are source-linked; prioritization/action guidance is inferred.",
            "- This is an AI-assisted brief and should be human-reviewed before decisions.",
            "- To unsubscribe: open cxradar.legnalabs.com, find the unsubscribe box, add your email and press unsubscribe; or email support@legnalabs.com.",
            "",
        ]
    )
    return "\n".join(lines)


def render_html(items: List[Item], lookback_days: int, generated_at: datetime) -> str:
    sections = split_sections(items)
    high = len([i for i in items if i.alert_level == "High"])
    medium = len([i for i in items if i.alert_level == "Medium"])
    low = len([i for i in items if i.alert_level == "Low"])

    def level_color(level: str) -> str:
        if level == "High":
            return "#b42318"
        if level == "Medium":
            return "#b54708"
        return "#027a48"

    def cards(section_items: List[Item], include_competitor: bool = False) -> str:
        if not section_items:
            return '<div class="empty">No major updates this cycle.</div>'
        blocks = []
        for item in section_items:
            competitor = detect_competitor(item) if include_competitor else ""
            competitor_html = f'<div class="meta">Competitor: {escape(competitor)}</div>' if competitor else ""
            if item.link:
                link_html = f'<a href="{escape(item.link)}" target="_blank" rel="noopener noreferrer">Open source</a>'
            else:
                link_html = ""
            blocks.append(
                f"""
                <article class="card">
                  <div class="row">
                    <span class="topic">{escape(item.topic)}</span>
                    <span class="priority" style="color:{level_color(item.alert_level)}">{escape(item.alert_level)} · {item.score_total}/20</span>
                  </div>
                  <h4>{escape(item.title)}</h4>
                  <div class="meta">Source: {escape(item.source)}</div>
                  {competitor_html}
                  <p><strong>Why it matters:</strong> {escape(why_it_matters(item))}</p>
                  <p><strong>Suggested PM action:</strong> {escape(suggested_action(item))}</p>
                  <p class="summary">{escape(limit_text(item.summary))}</p>
                  <div class="link">{link_html}</div>
                </article>
                """
            )
        return "\n".join(blocks)

    return f"""
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background:#f6f8fb; color:#111827; margin:0; }}
    .wrap {{ max-width: 860px; margin: 0 auto; padding: 24px 14px 40px; }}
    .hero {{ background: linear-gradient(135deg, #1f3555, #2f4d77); color:#fff; border-radius: 14px; padding: 20px; }}
    .hero h1 {{ margin: 0 0 8px; font-size: 24px; }}
    .hero p {{ margin: 6px 0; opacity: 0.95; }}
    .stats {{ display:flex; gap:8px; flex-wrap:wrap; margin-top: 12px; }}
    .pill {{ background: rgba(255,255,255,0.16); border:1px solid rgba(255,255,255,0.2); border-radius:999px; padding:6px 10px; font-size:12px; }}
    .section {{ margin-top: 18px; }}
    .section h2 {{ margin: 0 0 10px; font-size: 18px; color:#1f2937; }}
    .grid {{ display:grid; gap:10px; }}
    .card {{ background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:12px; }}
    .card h4 {{ margin: 6px 0 6px; font-size:16px; }}
    .card p {{ margin: 6px 0; font-size:14px; line-height:1.45; }}
    .meta {{ font-size:12px; color:#4b5563; }}
    .row {{ display:flex; justify-content:space-between; gap:8px; }}
    .topic {{ font-size:12px; background:#eef2ff; color:#3730a3; border-radius:999px; padding:4px 8px; }}
    .priority {{ font-size:12px; font-weight:600; }}
    .summary {{ color:#4b5563; }}
    .link a {{ color:#1d4ed8; text-decoration:none; font-size:13px; }}
    .empty {{ background:#fff; border:1px dashed #d1d5db; border-radius:12px; padding:12px; color:#6b7280; font-size:14px; }}
    .footer {{ margin-top: 18px; font-size:12px; color:#6b7280; }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <h1>CX Radar Weekly Brief</h1>
      <p>UCaaS + CCaaS market intelligence for product teams</p>
      <p>Generated (UTC): {escape(generated_at.strftime('%Y-%m-%d %H:%M'))} · Lookback: last {lookback_days} days</p>
      <div class="stats">
        <span class="pill">Total: {len(items)}</span>
        <span class="pill">High: {high}</span>
        <span class="pill">Medium: {medium}</span>
        <span class="pill">Low: {low}</span>
      </div>
    </div>

    <div class="section">
      <h2>What's New From Competitors</h2>
      <div class="grid">{cards(sections["competitors"], include_competitor=True)}</div>
    </div>

    <div class="section">
      <h2>Main Industry News</h2>
      <div class="grid">{cards(sections["market"])}</div>
    </div>

    <div class="section">
      <h2>Regulatory & Compliance Watch</h2>
      <div class="grid">{cards(sections["regulatory"])}</div>
    </div>

    <div class="section">
      <h2>Operational Risk Signals</h2>
      <div class="grid">{cards(sections["risk"])}</div>
    </div>

    <div class="footer">
      Facts are source-linked. Priority and actions are AI-assisted and should be human-reviewed.
      <br>
      To unsubscribe: open cxradar.legnalabs.com, find the unsubscribe box, add your email and press unsubscribe; or email support@legnalabs.com.
    </div>
  </div>
</body>
</html>
"""


def write_digest(markdown_text: str, html_text: str, generated_at: datetime) -> Path:
    stamp = generated_at.strftime("%Y%m%d-%H%M%S")
    run_dir = OUT_DIR / stamp
    run_dir.mkdir(parents=True, exist_ok=True)
    md_file = run_dir / "digest.md"
    html_file = run_dir / "digest.html"
    md_file.write_text(markdown_text, encoding="utf-8")
    html_file.write_text(html_text, encoding="utf-8")
    return run_dir


def list_active_subscribers() -> List[dict]:
    if not DB_PATH.exists():
        return []
    with sqlite3.connect(DB_PATH) as conn:
        rows = conn.execute(
            """
            SELECT email, unsubscribe_token
            FROM subscribers
            WHERE status = 'active'
            ORDER BY created_at ASC
            """
        ).fetchall()
    return [{"email": r[0], "token": r[1]} for r in rows]


def with_unsubscribe_footer(markdown_text: str, html_text: str, token: str) -> tuple[str, str]:
    base = os.getenv("CXRADAR_UNSUBSCRIBE_URL_BASE", "").strip()
    if not base:
        return markdown_text, html_text
    sep = "&" if "?" in base else "?"
    link = f"{base}{sep}token={token}"
    md = f"{markdown_text}\nUnsubscribe instantly: {link}\n"
    unsubscribe_html = (
        '<div style="margin-top:10px;font-size:12px;color:#6b7280;">'
        f'Manage subscription: <a href="{escape(link)}" '
        'style="color:#1d4ed8;text-decoration:none;">'
        "Unsubscribe from CX Radar emails</a>.</div>"
    )
    marker = "</div>\n</body>"
    if marker in html_text:
        html = html_text.replace(marker, f"{unsubscribe_html}\n{marker}", 1)
    else:
        html = f"{html_text}{unsubscribe_html}"
    return md, html


def send_email_to_subscribers(subject: str, markdown_text: str, html_text: str) -> int:
    host = getenv_any("SMTP_HOST", "CXRADAR_SMTP_HOST")
    port = int(getenv_any("SMTP_PORT", "CXRADAR_SMTP_PORT", default="587"))
    user = getenv_any("SMTP_USER", "CXRADAR_SMTP_USER")
    password = getenv_any("SMTP_PASS", "CXRADAR_SMTP_PASS")
    sender = getenv_any("SMTP_FROM", "CXRADAR_EMAIL_FROM")
    secure = as_bool(getenv_any("SMTP_SECURE"), default=False)
    use_starttls = as_bool(getenv_any("CXRADAR_SMTP_TLS", default="true"), default=True)
    fallback = getenv_any("SUPPORT_EMAIL", "CXRADAR_EMAIL_TO")

    required = [host, user, password, sender]
    if not all(required):
        raise RuntimeError("Missing SMTP env vars. Check README for required SMTP_* settings.")

    subscribers = list_active_subscribers()
    if not subscribers and fallback:
        subscribers = [{"email": fallback, "token": ""}]
    if not subscribers:
        print("[WARN] No active subscribers and no fallback email configured.")
        return 0

    context = ssl.create_default_context()

    def _send(server: smtplib.SMTP) -> int:
        count = 0
        for sub in subscribers:
            body_md, body_html = markdown_text, html_text
            if sub.get("token"):
                body_md, body_html = with_unsubscribe_footer(markdown_text, html_text, sub["token"])
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = sender
            msg["To"] = sub["email"]
            msg.set_content(body_md)
            msg.add_alternative(body_html, subtype="html")
            server.send_message(msg)
            count += 1
        return count

    if secure:
        with smtplib.SMTP_SSL(host, port, timeout=30) as server:
            server.login(user, password)
            return _send(server)
    with smtplib.SMTP(host, port, timeout=30) as server:
        if use_starttls:
            server.starttls(context=context)
        server.login(user, password)
        return _send(server)


def main() -> int:
    args = parse_args()
    load_env_file(ROOT / ".env")
    generated_at = datetime.now(timezone.utc)

    sources = read_sources(args.sources)
    items = build_items(sources, lookback_days=args.days)
    items = items[: args.top]

    markdown_text = render_markdown(items, args.days, generated_at)
    html_text = render_html(items, args.days, generated_at)
    run_dir = write_digest(markdown_text, html_text, generated_at)

    subject = f"CX Radar Digest | {generated_at.strftime('%Y-%m-%d')}"
    if args.send_email:
        sent = send_email_to_subscribers(subject, markdown_text, html_text)
        print(f"[INFO] Email sent: {subject} | recipients={sent}")

    print(f"[INFO] Digest written to: {run_dir}")
    print(f"[INFO] Items included: {len(items)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
