# Changelog

## 0.6.0 — 2026-08-19

### Added
- Typed support-operations intelligence contracts
- Synthetic historical support dataset separate from the active demo queue
- Synthetic lifecycle observations for received, first-response, resolution, outcome, and reopened state
- Deterministic throughput, resolution-rate, escalation-rate, and reopened-case analytics
- Median first-response and resolution latency with invalid/reversed timestamp exclusion
- Average daily intake and resolved throughput
- Category volume/share, escalation-rate, and average-confidence trends
- Confidence-band distribution
- Cross-cutting billing-involvement and billing-authority analytics
- Recurring issue-pattern aggregation over deterministic Voice-of-Customer themes
- Deterministic `act` / `review` / `watch` Voice-of-Customer action queue with inspectable evidence
- Dedicated `/intelligence` operations dashboard
- Global navigation between the support workspace and operations-intelligence view
- `docs/BSF-5_ARCHITECTURE.md`
- `docs/BSF-5_CERTIFICATION.md`
- 8 operations-intelligence regression tests

### Architecture / Governance
- Operations intelligence consumes existing support decisions rather than reimplementing or overriding support policy
- Operational observations remain separate from ticket content and support decision contracts
- Primary support category remains separate from cross-cutting billing involvement
- Confidence analytics remain evidence only and cannot suppress deterministic escalation
- Analytics may count, aggregate, compare, identify patterns, and recommend investigation; analytics cannot mutate customer/account/billing state or change an individual case decision
- Synthetic historical IDs use `HIST-*`; no production support history is present

### Validation
- BSF-5 merged via PR #5 and certification closeout merged via PR #6
- Final PR #5 head `0b3d0d5cb15184b62539ce06fdb87654b03de498` passed the complete CI gate
- Dependency installation reported 0 vulnerabilities
- High-severity production dependency audit passed with 0 vulnerabilities
- 32 unit tests passed, 0 failed
- Strict TypeScript check passed
- Next.js 16.3.1 production build passed
- Production build includes dynamic `/api/governed-draft` and static `/intelligence` routes
- Certification-closeout head `6efce0d5931517a352ef80e177df50c92773a6e8` passed the same configured CI gate before merge

## 0.5.0 — 2026-08-16

### Added
- Synthetic Stripe-style billing scenario contracts and fixtures
- Upgrade / entitlement mismatch scenario
- Failed-payment / past-due scenario
- Period-end cancellation scenario
- Reactivation scenario
- Invoice / receipt scenario
- Refund-request scenario
- Dispute / chargeback scenario
- Deterministic billing authority classes: automated explanation, human approval required, specialist escalation
- Explicit recommended billing-support actions and prohibited financial/account mutations
- Billing evidence passed into governed AI drafting as context only
- Dashboard billing-state, authority, evidence, allowed-action, and prohibited-action visualization
- Billing-specific UI styling
- `docs/BSF-4_ARCHITECTURE.md`
- Billing authority test suite

### Governance / Safety
- No live Stripe account is required or connected
- No real Stripe/customer/payment IDs or credentials
- No production BrewLotto billing code copied into the public repository
- AI may explain synthetic billing evidence but cannot issue refunds, reverse charges, change payment methods, resolve disputes, alter subscriptions, alter financial records, or force entitlements
- Refund requests force authorized human review
- Disputes and chargebacks force specialist escalation
- Subscription/application entitlement mismatch requires review before forced access changes
- Existing BSF-2 and BSF-3 model/retrieval authority boundaries remain intact

### Validation
- BSF-4 merged and certified via PR #4
- Final PR-head dependency installation reported 0 vulnerabilities
- High-severity production dependency audit passed with 0 vulnerabilities
- 24 unit tests passed, 0 failed
- Strict TypeScript check passed
- Next.js 16.3.1 production build passed
- Production build includes the dynamic `/api/governed-draft` route

## 0.4.0 — 2026-08-16

### Added
- Provider-neutral embedding contract
- Server-side OpenAI embeddings adapter
- Configurable embedding model and bounded embedding timeout
- Hybrid lexical + semantic knowledge retrieval
- Cosine-similarity semantic scoring
- Retrieval provenance with lexical, semantic, and combined scores
- Retrieval strategy labels (`lexical`, `semantic`, `hybrid`)
- Semantic retrieval integrated into the governed drafting route
- Dashboard evidence for RAG mode, provider/model, retrieval strategy, and score breakdown
- `docs/BSF-3_ARCHITECTURE.md`
- `docs/ROADMAP.md` recording job-first, community, GitHub Action, Marketplace, and possible GitHub App direction
- Semantic retrieval and embedding-adapter tests

### Governance / Safety
- Deterministic lexical retrieval remains available without an embedding provider
- Semantic provider outage or malformed vectors degrade safely to lexical retrieval
- Semantic evidence cannot set or override tier, severity, risk signals, escalation, escalation reasons, or approval state
- Security / Tier 3 cases remain human-governed regardless of semantic relevance
- Public provider-backed route remains restricted to predefined synthetic ticket IDs
- OpenAI credentials remain server-side only

### Validation
- BSF-3 merged and certified via PR #3
- Final certification reported 0 production dependency vulnerabilities
- 16 unit tests passed, 0 failed
- Strict TypeScript passed
- Next.js 16.3.1 production build passed

## 0.3.0 — 2026-08-16

### Added
- Provider-neutral AI drafting contract
- Server-side OpenAI Responses API adapter using environment-provided credentials
- Strict JSON-schema structured output for customer reply, KB citations, and drafting rationale
- Grounding validator that rejects citations to knowledge not retrieved for the ticket
- Bounded AI-provider timeout
- Safe deterministic fallback for provider outage, malformed output, invalid grounding, or authority-boundary violations
- `/api/governed-draft` route restricted to predefined synthetic ticket IDs
- Dashboard workflow for generating, inspecting, and regenerating governed AI drafts
- Provider/model/source metadata and visible safe-fallback state
- `.env.example` with placeholder-only AI provider configuration
- `docs/BSF-2_ARCHITECTURE.md`
- Governed-draft tests including an explicit attempted policy-field injection

### Governance
- AI provider cannot set or alter tier, severity, confidence, escalation, escalation reasons, or approval state
- Unexpected provider fields are rejected rather than ignored
- Deterministic support policy remains final authority after model generation
- High-risk and Tier 3 cases remain human-governed even when the model returns a valid draft
- Public API is not an unrestricted model proxy
- OpenAI Responses requests set `store: false`

### Validation
- Final BSF-2 PR-head dependency installation reported 0 vulnerabilities
- High-severity production dependency audit passed with 0 vulnerabilities
- 9 unit tests passed, 0 failed
- Explicit policy-injection test passed: attempted provider `escalate: false` was rejected
- Strict TypeScript check passed
- Next.js 16.3.1 production build passed
- Production build includes the dynamic `/api/governed-draft` route
- BSF-2 merged and certified via PR #2

## 0.2.0 — 2026-08-16

### Added
- Next.js 16.3.1 + React 19.2.8 application layer
- Responsive technical support operations dashboard
- Ticket queue and case detail workspace
- Classification, severity, and support-tier visualization
- Knowledge retrieval evidence with match scores
- Confidence score visualization and resolution threshold
- Human approve / escalate controls
- Deterministic policy block preventing approval of mandatory escalations
- Voice-of-Customer theme summary
- Synthetic support metrics for portfolio demonstration
- GitHub Actions validation gate covering production dependency audit, tests, strict type checking, and production build

### Architecture
- Existing deterministic support engine remains the authority beneath the UI
- UI consumes support decisions rather than reimplementing risk logic
- High-risk / Tier 3 / low-confidence cases cannot be approved through the dashboard

### Security / Validation
- CI identified high-severity transitive PostCSS and Sharp advisories through Next.js 16.2.12
- Next.js upgraded to patched 16.3.1
- Production dependency audit subsequently passed
- Policy-focused tests passed
- Strict TypeScript check passed
- Next.js production build passed
- BSF-1 merged and certified via PR #1

## 0.1.0 — 2026-08-16

### Added
- Public portfolio repository guardrails and engineering constitution
- TypeScript project foundation
- Typed support workflow contracts
- Deterministic ticket classifier
- Knowledge-base retrieval
- Confidence scoring and escalation rules
- Grounded draft-response generation
- Voice-of-Customer theme extraction
- Synthetic support fixtures
- Runnable demo
- Initial policy-focused unit tests
- Current-state documentation

### Security / IP
- Repository intentionally contains synthetic data only
- No open-source license granted
- No production BrewVerse implementation code copied into the project