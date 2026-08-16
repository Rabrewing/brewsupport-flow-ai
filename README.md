# BrewSupport Flow AI

**AI-assisted technical support automation built as a public portfolio project.**

BrewSupport Flow AI demonstrates an end-to-end support workflow designed for high-volume SaaS customer operations:

**Ticket → Classify → Retrieve KB Context → Hybrid RAG → Billing Evidence → Governed Draft → Confidence / Policy → Escalate if Needed → Summarize Voice of Customer**

The project is intentionally built with **synthetic customer and billing data only**. It does not contain production BrewVerse source code, customer data, credentials, or proprietary implementation details from BrewLotto, BrewAssist, Brew Agentic, BrewSearch, or Project Zahav.

## Why this project exists

Modern support teams should not use AI simply to generate faster replies. A trustworthy support workflow needs retrieval, confidence thresholds, escalation boundaries, billing authority boundaries, auditability, provider failure handling, and feedback loops into product and engineering.

BrewSupport Flow AI demonstrates that operating model in a small, inspectable codebase with an interactive support-operations dashboard.

## Workflow

1. **Classify** the incoming ticket by category, severity, and likely support tier.
2. **Retrieve** deterministic lexical knowledge-base matches that remain available without an AI provider.
3. **Enrich retrieval** with semantic embeddings when configured, then hybrid-rank lexical and semantic evidence.
4. **Attach synthetic billing evidence** for billing scenarios without connecting to a live Stripe account.
5. **Apply deterministic authority rules** that separate safe explanation from consequential financial/account mutation.
6. **Score** confidence and determine deterministic escalation requirements.
7. **Draft** a grounded customer response from either the deterministic baseline or a governed AI provider.
8. **Validate** provider output against a strict schema and the exact KB evidence retrieved for the case.
9. **Escalate** when confidence is low or the ticket involves refunds, disputes, security, unsafe entitlement changes, data loss, or other high-risk conditions.
10. **Summarize Voice of Customer** signals into recurring themes for product and engineering.
11. **Require human approval** when deterministic policy says a case is unsafe to auto-resolve.

## Current architecture

- Next.js 16.3.1 + React 19.2.8
- TypeScript
- Deterministic ticket classifier
- Deterministic lexical KB retrieval baseline
- Provider-neutral embedding interface
- Server-side OpenAI embeddings adapter
- Hybrid lexical + semantic knowledge retrieval
- Retrieval provenance with lexical / semantic / combined scores
- Lexical fallback when semantic retrieval is unavailable or invalid
- Confidence and risk scoring
- Human-in-the-loop escalation policy
- Deterministic grounded response baseline
- Provider-neutral AI drafting contract
- Server-side OpenAI Responses API adapter
- Strict JSON-schema structured output
- KB citation / grounding validation
- Bounded embedding and drafting provider timeouts
- Safe deterministic fallback on provider or validation failure
- Synthetic Stripe-style subscription/payment/invoice/refund/dispute fixtures
- Deterministic billing authority classes
- Explicit recommended and prohibited billing actions
- Voice-of-Customer theme extraction
- Responsive support dashboard
- Policy-focused, retrieval-focused, and billing-authority tests
- GitHub Actions validation for production dependency audit, tests, strict type checking, and production build

## Governed AI drafting

BSF-2 deliberately separates **probabilistic drafting** from **deterministic authority**.

The model may return only:

- a customer-facing reply
- IDs of retrieved knowledge articles used for grounding
- a short drafting rationale

The model cannot set or change support tier, severity, confidence, escalation state, escalation reasons, approval state, or billing authority. If provider output is invalid or unsupported, the workflow falls back to deterministic behavior.

See `docs/BSF-2_ARCHITECTURE.md`.

## Semantic RAG

BSF-3 adds semantic retrieval without removing the deterministic retrieval path.

When embeddings are configured, BrewSupport combines semantic similarity with lexical relevance and exposes combined, lexical, and semantic evidence. If embeddings fail, the case falls back to lexical retrieval rather than failing.

Semantic relevance may improve evidence selection, but it cannot directly change tier, severity, risk signals, escalation state, billing authority, or approval authority.

See `docs/BSF-3_ARCHITECTURE.md`.

## Stripe Support Simulator

BSF-4 demonstrates billing support architecture **without a live Stripe account**.

Synthetic cases include:

- paid upgrade with stale application entitlement
- failed payment / past-due subscription
- cancellation scheduled at period end
- reactivated subscription
- invoice / receipt request
- refund request
- dispute / chargeback

Every billing case receives a deterministic authority class:

- **automated explanation** — verified state may be explained and approved next steps recommended
- **human approval required** — consequential mutation requires an authorized human
- **specialist escalation** — disputes/chargebacks are routed for specialist review

The automation is explicitly prohibited from issuing refunds, reversing charges, changing payment methods, resolving disputes, altering subscriptions, changing financial records, or forcing entitlements.

The AI provider may use the synthetic billing assessment as grounding context, but it does not gain financial authority.

See `docs/BSF-4_ARCHITECTURE.md`.

## Dashboard

The dashboard demonstrates:

- Ticket queue and case-detail workspace
- Tier 1 / Tier 2 / Tier 3 classification
- Severity and risk signals
- Deterministic lexical KB baseline
- On-demand hybrid RAG evidence
- Lexical / semantic / combined relevance scores
- Synthetic subscription, payment, entitlement, and invoice state
- Visible billing authority and prohibited actions
- Confidence visualization
- Deterministic grounded baseline
- On-demand governed AI drafting
- Visible semantic and drafting fallback states
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

### BSF-3 — Semantic RAG — Complete
- Provider-neutral embedding interface
- Server-side embeddings adapter
- Hybrid lexical + semantic KB retrieval
- Retrieval provenance and semantic similarity evidence
- Safe lexical fallback
- Tests for semantic ranking, malformed vectors, provider failure, and authority preservation

### BSF-4 — Stripe Support Simulator — Active
- Synthetic billing/account state
- Refund, payment failure, cancellation, reactivation, entitlement, invoice, and dispute scenarios
- Deterministic financial-action boundaries
- Human approval and specialist escalation
- No real customer or Stripe data

### BSF-5 — Support Operations Intelligence
- Throughput and escalation analytics
- Recurring issue patterns
- Confidence distribution
- Billing/support category trends
- Voice-of-Customer summaries

The longer-term community and GitHub Marketplace direction is documented in `docs/ROADMAP.md`. The immediate priority remains job-readiness and a credible public engineering portfolio.

## Public portfolio safety

This repository is intentionally public and follows strict boundaries:

- No production credentials or API keys
- No real customer/support data
- No proprietary BrewVerse source copied into this repository
- No live Stripe connection or Stripe secret keys
- No real Stripe IDs, payment information, or webhook secrets
- Synthetic identifiers use obvious demo prefixes
- Demo invoice URLs use `example.invalid`
- No internal infrastructure addresses
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

The dashboard works without an AI key by using deterministic lexical retrieval, synthetic billing evidence, and deterministic drafting fallback. To exercise provider-backed semantic retrieval and drafting locally, copy `.env.example` to a local ignored environment file and provide a server-side `OPENAI_API_KEY`.

## Example support decision

```text
Customer: I was charged for Pro and want a refund today.

Classification: billing
Support tier: Tier 2
Synthetic payment: succeeded
Refund state: requested
Billing authority: human approval required
KB retrieval: refund review guidance
AI authority: explanation / drafting only
Prohibited automation: issue refund, reverse charge, alter financial records
Action: grounded response + route for authorized review
VOC theme: refund request
```

## Author

**Randy Brewington** — AI Vibe Coding Engineer | Full-Stack Developer | AI Automation Builder

Production SaaS: **BrewLotto** — https://www.brewlotto.app

GitHub: https://github.com/Rabrewing

---

**License:** No open-source license is granted at this time. All rights reserved unless explicitly stated otherwise.
