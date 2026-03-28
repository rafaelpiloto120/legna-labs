# CX Radar Ops Runbook

Use this as the quick reference for running and maintaining CX Radar in production.

## 1) Connect to VPS
```bash
ssh root@46.225.138.19
```

## 2) Main paths
- Repo root: `/opt/legnalabs/legna-labs`
- Agent folder: `/opt/legnalabs/legna-labs/cxradar-agent`
- Subscribers DB: `/opt/legnalabs/legna-labs/cxradar-agent/data/subscribers.db`

## 3) Check API health
From your Mac:
```bash
curl -s https://api.legnalabs.com/health
```
Expected:
```json
{"ok": true, "service": "cxradar-subscription-api"}
```

From VPS (local):
```bash
curl -s http://127.0.0.1:8787/health
```

## 4) Check API service status
```bash
systemctl status cxradar-api --no-pager
```

Restart API service:
```bash
systemctl restart cxradar-api
```

Follow API logs:
```bash
journalctl -u cxradar-api -f
```

## 5) Run digest manually (send now)
```bash
cd /opt/legnalabs/legna-labs/cxradar-agent
python3 agent.py --days 7 --top 20 --send-email
```

## 6) Weekly schedule (Cron)
Check current cron:
```bash
crontab -l
```

Expected entry:
```cron
CRON_TZ=UTC
0 10 * * 1 cd /opt/legnalabs/legna-labs/cxradar-agent && /usr/bin/flock -n /tmp/cxradar.lock /usr/bin/python3 agent.py --days 7 --top 20 --send-email >> /var/log/cxradar.log 2>&1
```

Edit cron:
```bash
crontab -e
```

## 7) View send logs
```bash
tail -n 100 /var/log/cxradar.log
```

## 8) Subscriber metrics
Count active subscribers:
```bash
python3 - <<'PY'
import sqlite3
db="/opt/legnalabs/legna-labs/cxradar-agent/data/subscribers.db"
con=sqlite3.connect(db)
n=con.execute("select count(*) from subscribers where status='active'").fetchone()[0]
print("Active subscribers:", n)
PY
```

List active subscriber emails:
```bash
python3 - <<'PY'
import sqlite3
db="/opt/legnalabs/legna-labs/cxradar-agent/data/subscribers.db"
con=sqlite3.connect(db)
for (email,) in con.execute("select email from subscribers where status='active' order by created_at"):
    print(email)
PY
```

Totals by status:
```bash
python3 - <<'PY'
import sqlite3
db="/opt/legnalabs/legna-labs/cxradar-agent/data/subscribers.db"
con=sqlite3.connect(db)
for status,count in con.execute("select status,count(*) from subscribers group by status"):
    print(status, count)
PY
```

## 9) Update code on VPS
```bash
cd /opt/legnalabs/legna-labs
git pull origin main
```

If `sources.json` or another file conflicts after stash pop:
```bash
git restore --source=HEAD --staged --worktree cxradar-agent/sources.json
git status
```

Then run:
```bash
cd /opt/legnalabs/legna-labs/cxradar-agent
python3 agent.py --days 7 --top 20 --send-email
```

## 10) Frontend/API config
Frontend page uses:
```html
<meta name="cxradar-api-base" content="https://api.legnalabs.com">
```
File:
- `/Users/rpiloto/Desktop/LegnaLabs/cxradar/index.html`

## 11) Critical env vars (VPS)
File: `/opt/legnalabs/legna-labs/cxradar-agent/.env`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `SUPPORT_EMAIL`
- `CXRADAR_CORS_ORIGIN=https://legnalabs.com`
- `CXRADAR_UNSUBSCRIBE_URL_BASE=https://api.legnalabs.com/api/unsubscribe`

## 12) Quick backup (subscribers DB)
```bash
cp /opt/legnalabs/legna-labs/cxradar-agent/data/subscribers.db /opt/legnalabs/legna-labs/cxradar-agent/data/subscribers.db.bak.$(date +%F-%H%M%S)
```
