# BrewSupport Flow AI

**AI-assisted technical support automation built as a public portfolio project.**

BrewSupport Flow AI demonstrates an end-to-end support workflow designed for high-volume SaaS customer operations:

**Ticket → Classify → Retrieve KB Context → Draft Response → Confidence Score → Escalate if Needed → Summarize Voice of Customer**

The project is intentionally built with **synthetic customer data and mock billing/support scenarios only**. It does not contain production BrewVerse source code, customer data, credentials, or proprietary implementation details from BrewLotto, BrewAssist, Brew Agentic, BrewSearch, or Project Zahav.

## Why this project exists

Modern support teams should not use AI simply to generate faster replies. A trustworthy support workflow needs retrieval, confidence thresholds, escalation boundaries, auditability, provider failure handling, and feedback loops into product and engineering.

BrewSupport Flow AI demonstrates that operating model in a small, understandable codebase with an interactive support-operations dashboard.

## Workflow

1. **Classify** the incoming ticket by category, severity, and likely support tier.
2. **Retrieve** relevant knowledge-base context.
3. **Score** confidence and determine deterministic escalation requirements.
4. **Draft** a grounded customer response from either the deterministic baseline or a governed AI provider.
5. **Validate** provider output against a strict schema and the exact KB evidence retrieved for the case.
6. **Escalate** when confidence is low or the ticket involves disputes, security, account risk, data loss, technical failures, or other high-risk conditions.
7. **Summarize Voice of Customer** signals into recurring themes for product and engineering.
8. **Require human approval** when deterministic policy says a case is unsafe to auto-resolve.

## Current architecture

- Next.js 16.3.1 + React 19.2.8
- TypeScript
- Deterministic ticket classifier
- Lightweight knowledge-base retrieval
- Confidence and risk scoring
- Human-in-the-loop escalation policy
- Deterministic grounded response baseline
- Provider-neutral AI drafting contract
- Server-side OpenAI Responses API adapter
- Strict JSON-schema structured output
- KB citation / grounding validation
- Bounded AI-provider timeout
- Safe deterministic fallback on provider or validation failure
- Voice-of-Customer theme extraction
- Responsive support dashboard
- Synthetic demo tickets and knowledge articles
- Policy-focused unit tests
- GitHub Actions validation for production dependency audit, tests, strict type checking, and production build

## Governed AI drafting

BSF-2 deliberately separates **probabilistic drafting** from **deterministic authority**.

The model may return only:

- a customer-facing reply
- IDs of retrieved knowledge articles used for grounding
- a short drafting rationale

The model cannot set or change support tier, severity, confidence, escalation state, escalation reasons, or approval state. Those decisions stay in deterministic application code.

If the provider times out, fails, returns malformed output, or cites knowledge that was not retrieved, the workflow falls back to the deterministic grounded response while preserving the original policy decision.

The public API route accepts only this repository's predefined synthetic ticket IDs. It is intentionally **not** an unrestricted OpenAI proxy.

See `docs/BSF-2_ARCHITECTURE.md` for the detailed authority and safety model.

## Dashboard

The dashboard demonstrates:

- Ticket queue and case-detail workspace
- Tier 1 / Tier 2 / Tier 3 classification
- Severity and risk signals
- Retrieved KB evidence with match scores
- Confidence visualization
- Deterministic grounded baseline
- On-demand governed AI drafting
- Provider / model / grounding metadata
- Visible safe-fallback state
- Approve / escalate workflow
- Deterministic blocking of unsafe approvals
- Voice-of-Customer intelligence
- Synthetic support-operations metrics

**AI may recommend; deterministic policy retains authority.**

## Roadmap

### BSF-1 — Interactive Support Operations Dashboard — Complete
- Support queue and case workspace
- Classification, evidence, confidence, escalation, and VOC visualization
- Human approval controls with deterministic policy blocking

### BSF-2 — Governed AI Provider Layer — Complete
- Provider-neutral drafting interface
- Server-side OpenAI Responses API adapter
- Strict structured output
- Retrieved-KB grounding validation
- Deterministic policy remains final authority
- Safe fallback when AI is unavailable or invalid
- Tests proving model output cannot override escalation

### BSF-3 — Semantic RAG
- Embeddings
- Semantic KB retrieval
- Retrieval confidence and grounding evidence

### BSF-4 — Stripe Support Simulator
- Synthetic refund, payment failure, cancellation, upgrade, entitlement, invoice, and dispute scenarios
- No real customer or Stripe data

### BSF-5 — Support Operations Intelligence
- Throughput and escalation analytics
- Recurring issue patterns
- Confidence distribution
- Voice-of-Customer summaries

## Public portfolio safety

This repository is intentionally public and follows strict boundaries:

- No production credentials or API keys
- No real customer/support data
- No proprietary BrewVerse source copied into this repository
- No real Stripe IDs, payment information, or webhook secrets
- No internal infrastructure addresses
- Synthetic examples only
- Provider credentials stay server-side in environment configuration
- OpenAI Responses requests set `store: false`

See `AGENTS.md` for the repository engineering constitution.

## Quick start

```bash
npm install
npm audit --omit=dev --audit-level=high
npm test
npm run typecheck
npm run build
npm run dev
```

The dashboard works without an AI key by using the deterministic fallback. To exercise provider-backed drafting locally, copy `.env.example` to a local ignored environment file and provide a server-side `OPENAI_API_KEY`.

Then open the local Next.js application in your browser.

## Example support decision

```text
Customer: I upgraded to Pro but my account still shows Starter.

Classification: billing
Support tier: Tier 2
Risk: medium
KB retrieval: subscription entitlement guidance
Confidence: calculated from evidence + risk
AI authority: drafting only
Policy authority: deterministic application logic
Action: grounded draft + human-visible evidence
Escalation: policy-driven
VOC theme: subscription lifecycle
```

## Author

**Randy Brewington** — AI Vibe Coding Engineer | Full-Stack Developer | AI Automation Builder

Production SaaS: **BrewLotto** — https://www.brewlotto.app

GitHub: https://github.com/Rabrewing

---

**License:** No open-source license is granted at this time. All rights reserved unless explicitly stated otherwise.
