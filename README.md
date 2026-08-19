# BrewSupport Flow AI

**AI-assisted technical support automation built as a public portfolio project.**

BrewSupport Flow AI demonstrates an end-to-end support workflow designed for high-volume SaaS customer operations:

**Ticket → Classify → Retrieve KB Context → Hybrid RAG → Billing Evidence → Governed Draft → Confidence / Policy → Escalate if Needed → Summarize Voice of Customer → Aggregate Operations Intelligence**

The project is intentionally built with **synthetic customer, billing, and support-history data only**. It does not contain production BrewVerse source code, customer data, credentials, or proprietary implementation details from BrewLotto, BrewAssist, Brew Agentic, BrewSearch, or Project Zahav.

## Why this project exists

Modern support teams should not use AI simply to generate faster replies. A trustworthy support workflow needs retrieval, confidence thresholds, escalation boundaries, billing authority boundaries, auditability, provider failure handling, and feedback loops into product and engineering.

BrewSupport Flow AI demonstrates that operating model in a small, inspectable codebase with an interactive support workspace and a dedicated operations-intelligence view.

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
10. **Summarize Voice of Customer** signals into themes for product and engineering.
11. **Require human approval** when deterministic policy says a case is unsafe to auto-resolve.
12. **Aggregate operations intelligence** from support decisions and separate synthetic lifecycle observations without changing support authority.

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
- Synthetic historical support observations separate from active demo tickets
- Deterministic throughput, latency, escalation, category, confidence, and billing-authority analytics
- Recurring issue-pattern analysis and evidence-backed Voice-of-Customer action queue
- Responsive support workspace plus dedicated `/intelligence` operations view
- Policy, retrieval, billing-authority, and operations-intelligence regression tests
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

## Support Operations Intelligence

BSF-5 adds an observational analytics layer over deterministic support decisions and a separate synthetic historical lifecycle dataset.

The operations engine calculates:

- historical case volume
- resolved/open counts and resolution rate
- policy escalation count and rate
- median first-response and resolution latency
- average daily intake and resolved throughput
- reopened case count
- category share, escalation rate, and average confidence
- confidence-band distribution
- billing involvement and billing-authority distribution
- recurring Voice-of-Customer patterns
- prioritized, evidence-backed operational action recommendations

Primary support category and billing involvement remain separate dimensions. For example, a dispute may enter a high-risk/security escalation lane while still being measured as a billing-involved case with specialist authority.

The operations layer can identify where the team should investigate, improve knowledge, or create clearer self-service. It cannot change the classification, confidence, billing authority, escalation, approval state, or outcome of an individual support case.

See `docs/BSF-5_ARCHITECTURE.md` and `docs/BSF-5_CERTIFICATION.md`.

## Dashboard

The portfolio now has two linked views.

### Support workspace — `/`

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
- Current-case Voice-of-Customer themes

### Operations intelligence — `/intelligence`

- Throughput and resolution metrics
- Median first-response and resolution latency
- Category mix and escalation rates
- Confidence distribution
- Billing authority mix
- Recurring issue patterns
- Prioritized Voice-of-Customer action queue
- Explicit analytics-versus-authority architecture boundary

**AI may recommend; deterministic policy retains authority. Analytics may observe; analytics does not mutate.**

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

### BSF-4 — Stripe Support Simulator — Complete
- Synthetic billing/account state
- Refund, payment failure, cancellation, reactivation, entitlement, invoice, and dispute scenarios
- Deterministic financial-action boundaries
- Human approval and specialist escalation
- 24-test certified suite across support, AI, RAG, and billing authority
- No real customer or Stripe data

### BSF-5 — Support Operations Intelligence — Complete
- Deterministic throughput, latency, and escalation analytics
- Recurring issue-pattern analysis
- Confidence distribution
- Billing/support category trends
- Evidence-backed Voice-of-Customer action queue
- Dedicated `/intelligence` dashboard
- 32-test certified suite across support, AI, RAG, billing authority, and operations intelligence

The planned BSF-1 through BSF-5 core portfolio architecture is complete. The default priority returns to job-readiness and interview fluency before additional feature expansion. The longer-term community and GitHub Marketplace direction is documented in `docs/ROADMAP.md`.

## Public portfolio safety

This repository is intentionally public and follows strict boundaries:

- No production credentials or API keys
- No real customer/support data
- No proprietary BrewVerse source copied into this repository
- No live Stripe connection or Stripe secret keys
- No real Stripe IDs, payment information, or webhook secrets
- Synthetic identifiers use obvious demo prefixes
- Synthetic historical tickets use `HIST-*` identifiers
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

Open `/` for the support workspace and `/intelligence` for BSF-5 operations intelligence.

The support workflow works without an AI key by using deterministic lexical retrieval, synthetic billing evidence, and deterministic drafting fallback. To exercise provider-backed semantic retrieval and drafting locally, copy `.env.example` to a local ignored environment file and provide a server-side `OPENAI_API_KEY`.

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

## Example operations question

```text
Question: What should the support team investigate next?

Evidence:
- recurring theme frequency
- share of support history
- escalation rate
- average confidence
- billing authority distribution when relevant

Output:
- deterministic priority: act / review / watch
- inspectable evidence string
- recommended knowledge, product, or workflow investigation

Authority:
- analytics cannot change an individual ticket decision
```

## Author

**Randy Brewington** — AI Vibe Coding Engineer | Full-Stack Developer | AI Automation Builder

Production SaaS: **BrewLotto** — https://www.brewlotto.app

GitHub: https://github.com/Rabrewing

---

**License:** No open-source license is granted at this time. All rights reserved unless explicitly stated otherwise.