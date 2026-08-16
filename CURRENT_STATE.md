# BrewSupport Flow AI — Current State

## Status
**BSF-4 / Stripe Support Simulator: IMPLEMENTED / CERTIFICATION IN PROGRESS**

Branch: `bsf-4-stripe-support-simulator`  
PR: #4

BSF-1, BSF-2, and BSF-3 remain merged and certified on `main`.

## Implemented through BSF-4
- Public-portfolio engineering constitution and IP boundaries
- TypeScript support workflow foundation
- Deterministic ticket classification
- Deterministic lexical knowledge retrieval baseline
- Confidence scoring and deterministic escalation policy
- Deterministic grounded-response baseline
- Voice-of-Customer theme extraction
- Next.js 16.3.1 + React 19.2.8 support operations dashboard
- Human approve / escalate controls with policy-enforced blocking
- Provider-neutral AI drafting contract
- Server-side OpenAI Responses API adapter
- Strict structured-output and KB-grounding validation
- Rejection of provider policy-field injection
- Bounded drafting timeout and deterministic fallback
- Provider-neutral embedding contract
- Server-side OpenAI embeddings adapter
- Hybrid lexical + semantic retrieval with provenance and lexical fallback
- Synthetic Stripe-style billing scenario contracts and fixtures
- Deterministic billing authority classes
- Explicit allowed/recommended vs prohibited billing actions
- Synthetic upgrade/entitlement mismatch, payment failure, cancellation, reactivation, invoice, refund, and dispute scenarios
- Billing evidence passed into governed drafting as context without granting model authority
- Dashboard visualization for subscription/payment/entitlement/invoice state and billing authority
- Billing-specific authority tests plus existing support, AI, and retrieval tests
- GitHub Actions CI gate covering production dependency audit, tests, strict TypeScript, and production build
- Durable community / GitHub Marketplace direction in `docs/ROADMAP.md`

## BSF-4 billing authority model

### Automated explanation
Support automation may explain verified synthetic state and recommend an approved next step for cases such as failed payment, period-end cancellation, reactivation, and invoice guidance.

### Human approval required
Refund requests and subscription/application entitlement mismatches may be summarized and routed, but consequential mutation requires authorized human review.

### Specialist escalation
Chargebacks and disputes require specialist review regardless of model confidence or retrieval quality.

## Prohibited automated billing actions
BrewSupport does not autonomously:
- issue refunds
- reverse charges
- change payment methods
- resolve disputes
- alter subscriptions
- alter financial records
- force entitlements

## Authority architecture
AI generation, semantic retrieval, and billing-state explanation are advisory/evidence capabilities.

Deterministic application logic retains authority over:
- support tier
- severity
- risk signals
- billing authority class
- human-review requirement
- escalation state and reasons
- approval state
- prohibited consequential actions

## Public / data safety
- No live Stripe account required or connected
- No production BrewVerse code
- No real customer data
- No real Stripe IDs or payment information
- No Stripe secret keys or webhook secrets
- No production BrewLotto billing implementation copied into this repository
- Synthetic IDs such as `sub_demo_*`, `pi_demo_*`, and `in_demo_*` only
- Demo invoice URLs use the non-routable `example.invalid` domain
- OpenAI credentials remain server-side only
- Public route accepts synthetic ticket IDs rather than arbitrary prompt text
- No open-source license granted at this time

## BSF-4 certification targets
The exact final PR head must pass:
1. Dependency installation
2. High-severity production dependency audit
3. Complete unit suite including billing authority tests
4. Strict TypeScript type checking
5. Next.js production build
6. Dynamic `/api/governed-draft` route in the production build

The BSF-4 suite is designed to prove:
- entitlement mismatch cannot force access without review
- failed payments can be explained without payment-method mutation
- period-end cancellation state can be explained safely
- reactivation and invoice guidance do not require financial mutation
- refund requests force human approval and cannot issue refunds
- disputes/chargebacks force specialist escalation and cannot be auto-resolved
- billing evidence reaches governed AI drafting without changing deterministic authority
- all BSF-1/2/3 safety and retrieval boundaries remain intact

## Next milestone after certification
**BSF-5 — Support Operations Intelligence**

Planned scope:
1. Throughput and escalation analytics
2. Recurring issue-pattern analysis
3. Confidence distribution
4. Billing/support category trends
5. Voice-of-Customer aggregation and actionable summaries

## Longer-term direction
Job-readiness remains the immediate priority. After the core portfolio milestones, the planned community path is contributor readiness, then extraction of a dedicated GitHub Action for possible Marketplace publication, with a GitHub App considered only if real adoption justifies it. See `docs/ROADMAP.md`.
