# CX Radar Agent (MVP)

Email-first AI-assisted market radar for UCaaS/CCaaS Product Managers.

## What this MVP does
- Pulls updates from configured RSS/Atom sources
- Scores each signal (strategic relevance, customer impact, revenue impact, urgency)
- Creates digest files in `out/<timestamp>/`
- Sends digest emails to active subscribers stored in SQLite
- Exposes a subscription API with validation, deduplication, and basic brute-force controls

## Files
- `agent.py`: runner script
- `subscription_api.py`: subscribe/unsubscribe API service
- `sources.json`: watchlist configuration
- `data/subscribers.db`: subscription storage (created at runtime)
- `out/`: generated digests

## Run locally
```bash
cd /Users/rpiloto/Desktop/LegnaLabs/cxradar-agent
python3 agent.py --days 7 --top 20
```

With email delivery:
```bash
export SMTP_HOST="smtp.yourprovider.com"
export SMTP_PORT="587"
export SMTP_SECURE="false"
export SMTP_USER="your-user"
export SMTP_PASS="your-pass"
export SMTP_FROM="CX Radar <no-reply@yourdomain.com>"
export SUPPORT_EMAIL="you@company.com"

python3 agent.py --days 7 --top 20 --send-email
```

You can also place these variables in `cxradar-agent/.env`; the runner loads it automatically.

## Run subscription API
```bash
cd /Users/rpiloto/Desktop/LegnaLabs/cxradar-agent
python3 subscription_api.py
```

Defaults:
- API host: `127.0.0.1`
- API port: `8787`

Optional env:
- `CXRADAR_API_HOST`
- `CXRADAR_API_PORT`
- `CXRADAR_CORS_ORIGIN`
- `CXRADAR_IP_LIMIT_PER_HOUR` (default `30`)
- `CXRADAR_EMAIL_LIMIT_PER_HOUR` (default `6`)

## API endpoints
- `POST /api/subscribe` with JSON `{ "email": "name@domain.com" }`
- `POST /api/unsubscribe` with JSON `{ "email": "name@domain.com" }`
- `GET /api/unsubscribe?token=...` for one-click email unsubscribe links

Frontend note:
- `cxradar/index.html` posts to `/api/*` by default.
- If API is on a different domain, set `window.CXRADAR_API_BASE` before the page script runs.

## Agent delivery behavior
- If there are active subscribers in DB, digest is sent to each subscriber individually.
- If there are no active subscribers, it falls back to `SUPPORT_EMAIL` (if configured).
- Set `CXRADAR_UNSUBSCRIBE_URL_BASE` to include unsubscribe link in each digest (e.g. `https://api.cxradar.legnalabs.com/api/unsubscribe`).

## Recommended starting source strategy
- Industry media:
  - CX Today
  - UC Today
- Competitor tracking:
  - Talkdesk
  - Five9
  - Genesys
  - RingCentral
  - NICE CXone
  - Zoom Contact Center
  - Amazon Connect
  - Twilio Flex
- Market keywords:
  - UCaaS
  - CCaaS

Start with this broad set for 2 weeks, then remove noisy feeds.

## Notes
- Scoring is heuristic and should be reviewed by a human before decisions.
- Some feeds can fail occasionally; the runner logs warnings and continues.
