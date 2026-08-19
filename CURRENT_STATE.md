# BrewSupport Flow AI — Current State

## Status
**BSF-5 / Support Operations Intelligence: IMPLEMENTED / CERTIFICATION IN PROGRESS**

Branch: `bsf-5-support-operations-intelligence`  
PR: #5

BSF-1, BSF-2, BSF-3, and BSF-4 remain merged and certified on `main`.

## Implemented through BSF-5
- Public-portfolio engineering constitution and IP boundaries
- TypeScript support workflow foundation
- Deterministic ticket classification
- Deterministic lexical knowledge retrieval baseline
- Confidence scoring and deterministic escalation policy
- Deterministic grounded-response baseline
- Voice-of-Customer theme extraction
- Next.js 16.3.1 + React 19.2.8 support workspace
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
- Billing evidence passed into governed drafting without granting model authority
- Synthetic historical support dataset separate from the active demo queue
- Typed operational-observation and support-case-record contracts
- Deterministic operations-intelligence aggregation engine
- Throughput, resolution, response-latency, escalation, and reopened-case analytics
- Category volume/share, escalation-rate, and average-confidence trends
- Confidence-band distribution
- Cross-cutting billing-involvement and billing-authority distribution
- Recurring issue-pattern analysis over deterministic VOC themes
- Evidence-backed Voice-of-Customer action queue with act/review/watch priority
- Dedicated `/intelligence` dashboard plus global navigation between support and operations views
- GitHub Actions CI gate covering production dependency audit, tests, strict TypeScript, and production build
- Durable community / GitHub Marketplace direction in `docs/ROADMAP.md`

## BSF-5 intelligence architecture

The analytics layer is observational.

It consumes:
1. synthetic historical support tickets
2. existing deterministic `SupportDecision` objects
3. separate synthetic lifecycle observations for received/response/resolution/outcome state

It produces:
- total volume and resolution metrics
- average daily intake/resolved throughput
- median first-response and resolution latency
- policy escalation rate
- category and confidence trends
- billing authority mix
- recurring issue patterns
- deterministic VOC action recommendations

The intelligence layer does **not** change support policy or individual ticket decisions.

## Important dimensional distinction
Primary support category and billing involvement are measured separately.

A chargeback can therefore be represented as both:
- a high-risk/security-oriented escalation path
- a billing-involved case governed by specialist billing authority

BSF-5 preserves both facts rather than forcing them into one label.

## Timestamp safety
Latency analytics exclude missing, invalid, or reversed timestamp pairs rather than converting them into misleading values.

## Authority architecture
AI generation, semantic retrieval, billing-state explanation, and operations analytics are advisory/evidence capabilities.

Deterministic application logic retains authority over:
- support tier
- severity
- risk signals
- billing authority class
- human-review requirement
- escalation state and reasons
- approval state
- prohibited consequential actions

Operations intelligence may count, aggregate, compare, identify recurring patterns, and recommend areas to investigate. It may not mutate customer/account/billing state or override an individual support decision.

## Public / data safety
- No live Stripe account required or connected
- No production BrewVerse code
- No real customer/support data
- No real Stripe IDs or payment information
- No Stripe secret keys or webhook secrets
- No production BrewLotto billing implementation copied into this repository
- Synthetic billing IDs only
- Synthetic historical support IDs use `HIST-*`
- Demo invoice URLs use the non-routable `example.invalid` domain
- OpenAI credentials remain server-side only
- Public provider-backed route accepts predefined synthetic ticket IDs rather than arbitrary prompt text
- No open-source license granted at this time

## BSF-5 implementation-head validation
Implementation-head CI passed on 2026-08-19:
1. Dependency installation — PASS / 0 vulnerabilities reported
2. High-severity production dependency audit — PASS / 0 vulnerabilities
3. Unit tests — PASS / 32 passed, 0 failed
4. Strict TypeScript type checking — PASS
5. Next.js 16.3.1 production build — PASS
6. Dynamic `/api/governed-draft` route included in production build — PASS
7. Static `/intelligence` operations dashboard included in production build — PASS

The BSF-5 suite proves:
- every synthetic historical ticket has a matching operational observation
- throughput and latency calculations are deterministic
- category trends remain distinct from cross-cutting billing involvement
- billing authority distribution preserves BSF-4 authority classes
- every historical case belongs to exactly one confidence band
- recurring VOC themes become evidence-backed operational recommendations
- invalid/reversed timestamps cannot corrupt latency metrics
- identical support evidence produces identical operations intelligence
- all 24 pre-BSF-5 support, AI, RAG, and billing tests remain green

## Current certification target
The exact final PR head must pass the same complete GitHub Actions gate after documentation closeout.

After that validation, PR #5 can be marked ready, merged to `main`, and certified again on the post-merge main head.

## Longer-term direction
Job-readiness remains the immediate priority. After the core portfolio milestones, the planned community path is contributor readiness, then extraction of a dedicated GitHub Action for possible Marketplace publication, with a GitHub App considered only if real adoption justifies it. See `docs/ROADMAP.md`.
