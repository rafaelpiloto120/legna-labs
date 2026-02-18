# UCaaS/CCaaS PM Radar Agent Spec

## Purpose
A product-manager assistant that continuously tracks UCaaS/CCaaS market movement and translates signals into actionable roadmap recommendations.

## Primary outcomes
- Detect relevant market changes early.
- Reduce weekly research effort.
- Improve roadmap and launch decision quality.

## Users
- Product Manager (primary)
- Product Marketing and Strategy (secondary)

## Scope of monitoring
- Competitor product announcements
- Pricing and packaging changes
- AI agent and automation features
- Regulatory, compliance, and carrier policy updates
- Customer pain patterns (support tickets, call notes, churn reasons)

## Inputs
- Public sources: competitor release notes, product pages, blogs, analyst updates, regulator pages.
- Internal sources: CRM notes, support tickets, sales call summaries, churn tags, NPS comments.

## Core workflows
1. Daily signal scan
- Pull latest source updates.
- Extract candidate events.
- De-duplicate and classify by topic and competitor.

2. Relevance scoring
- Score each event on:
  - Strategic relevance (0-5)
  - Customer impact (0-5)
  - Revenue/retention impact (0-5)
  - Urgency (0-5)
- Total score determines alert level:
  - 15+: High
  - 10-14: Medium
  - <10: Low

3. Weekly PM digest
- Group events by theme.
- Provide trend summary and evidence links.
- Recommend top 3 PM actions for the next week.

4. Alerting
- Immediate alert only for High events.
- Medium and Low events flow into weekly digest.

## Output format
Each event entry should include:
- What changed
- Why it matters
- Who is affected
- Confidence level (Low/Medium/High)
- Evidence links
- Recommended PM action

## Suggested cadence
- Daily scan: 08:00 local time
- Weekly digest: Monday 09:00 local time

## Quality gates
- Every claim must include a source link.
- Separate facts from inference.
- Mark uncertain/partial items explicitly.
- Keep digest under 10 minutes reading time.

## MVP success metrics (first 30 days)
- Time saved in research per week.
- % of digest items considered useful by PM.
- Number of roadmap/backlog decisions influenced by radar insights.

## Go-live plan
1. Start with 8 to 12 high-signal sources.
2. Run in shadow mode for 2 weeks.
3. Tune scoring thresholds and remove noisy sources.
4. Enable alerts for High events.

## LegnaLabs web positioning
- Use a dedicated subdomain: `cxradar.legnalabs.com`.
- Keep the main website as portfolio/brand hub.
- Present PM Radar as a focused product page with clear value proposition, sample output, and CTA for early access.
