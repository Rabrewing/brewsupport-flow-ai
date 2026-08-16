# BrewSupport Flow AI

**AI-assisted technical support automation built as a public portfolio project.**

BrewSupport Flow AI demonstrates an end-to-end support workflow designed for high-volume SaaS customer operations:

**Ticket → Classify → Retrieve KB Context → Draft Response → Confidence Score → Escalate if Needed → Summarize Voice of Customer**

The project is intentionally built with **synthetic customer data and mock billing/support scenarios only**. It does not contain production BrewVerse source code, customer data, credentials, or proprietary implementation details from BrewLotto, BrewAssist, Brew Agentic, BrewSearch, or Project Zahav.

## Why this project exists

Modern support teams should not use AI simply to generate faster replies. A trustworthy support workflow needs retrieval, confidence thresholds, escalation boundaries, auditability, and feedback loops into product and engineering.

BrewSupport Flow AI demonstrates that operating model in a small, understandable codebase.

## Workflow

1. **Classify** the incoming ticket by category, severity, intent, and likely support tier.
2. **Retrieve** relevant knowledge-base context.
3. **Draft** a grounded customer response using the retrieved context.
4. **Score confidence** based on retrieval quality, ambiguity, risk, and ticket category.
5. **Escalate** when confidence is low or the ticket involves billing disputes, security, account access, data loss, or other high-risk conditions.
6. **Summarize Voice of Customer** signals into recurring themes for product and engineering.

## Current architecture

- TypeScript
- Deterministic ticket classifier
- Lightweight knowledge-base retrieval
- Confidence and risk scoring
- Human-in-the-loop escalation policy
- Voice-of-Customer theme extraction
- Synthetic demo tickets
- Unit tests

Planned application layer:

- Next.js + React support dashboard
- OpenAI-powered grounded drafting behind a provider abstraction
- Structured AI outputs
- Retrieval/embedding adapter
- Ticket queue and resolution analytics
- Mock Stripe support scenarios

## Public portfolio safety

This repository is intentionally public and follows strict boundaries:

- No production credentials or API keys
- No real customer/support data
- No proprietary BrewVerse source copied into this repository
- No real Stripe IDs, payment information, or webhook secrets
- No internal infrastructure addresses
- Synthetic examples only

See `AGENTS.md` for the repository engineering constitution.

## Quick start

```bash
npm install
npm test
npm run demo
```

## Example

```text
Customer: I upgraded to Pro but my account still shows Starter.

Classification: billing / entitlement
Support tier: Tier 2
Risk: medium
KB retrieval: subscription entitlement refresh + checkout lifecycle
Confidence: 0.86
Action: draft response + account-state verification
Escalation: no, unless account state contradicts billing state
VOC theme: subscription state synchronization
```

## Author

**Randy Brewington** — AI Vibe Coding Engineer | Full-Stack Developer | AI Automation Builder

Production SaaS: **BrewLotto** — https://www.brewlotto.app

GitHub: https://github.com/Rabrewing

---

**License:** No open-source license is granted at this time. All rights reserved unless explicitly stated otherwise.