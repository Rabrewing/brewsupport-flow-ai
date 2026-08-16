# BrewSupport Flow AI — Current State

## Status
**BSF-3 / Semantic RAG: MERGED / CERTIFIED**

Merged to `main` via PR #3 on 2026-08-16.

BSF-1, BSF-2, and BSF-3 are merged and certified on `main`.

## Implemented through BSF-3
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
- Default semantic model configuration: `text-embedding-3-small`
- Hybrid lexical + semantic retrieval
- Retrieval provenance: lexical, semantic, and combined scores
- Semantic retrieval integrated into the governed drafting route
- Safe lexical fallback on embedding outage, timeout, malformed vectors, invalid dimensions, or other semantic failures
- Dashboard visualization for RAG mode, provider/model, retrieval strategy, and score breakdown
- Retrieval-focused tests plus existing BSF-1 / BSF-2 safety tests
- GitHub Actions CI gate covering production dependency audit, tests, strict TypeScript, and production build
- Durable community / GitHub Marketplace direction in `docs/ROADMAP.md`

## Retrieval architecture
The deterministic lexical retriever is never removed. When an embedding provider is configured, semantic similarity is combined with lexical evidence using a hybrid ranker. The final retrieval score can influence the retrieval component of confidence, but semantic retrieval does not control policy.

Default hybrid weights:
- lexical: 35%
- semantic: 65%

Every hybrid result can expose:
- combined score
- lexical score
- semantic score
- retrieval strategy (`lexical`, `semantic`, or `hybrid`)

## Authority architecture
AI generation and semantic retrieval are advisory/evidence components, not policy authorities.

Deterministic application logic retains exclusive authority over:
- support tier
- severity
- risk signals
- escalation state
- escalation reasons
- approval state

Tier 3, high-risk, and low-confidence cases remain human-governed regardless of semantic relevance or model output.

## Public / data safety
- No production BrewVerse code
- No real customer data
- No real Stripe data or credentials
- No proprietary Brew Agentic / BrewAssist runtime copied into this project
- OpenAI credentials remain server-side only
- Public route accepts synthetic ticket IDs rather than arbitrary prompt text
- No open-source license granted at this time

## BSF-3 certification evidence
Final PR-head validation passed on 2026-08-16:
1. Dependency installation — PASS / 0 vulnerabilities reported
2. High-severity production dependency audit — PASS / 0 vulnerabilities
3. Unit tests — PASS / 16 passed, 0 failed
4. Strict TypeScript type checking — PASS
5. Next.js 16.3.1 production build — PASS
6. Dynamic `/api/governed-draft` route included in production build — PASS

The certified suite proves:
- semantic evidence can strengthen a relevant KB match
- no embedding provider preserves the existing lexical path
- embedding-provider failure degrades safely to lexical retrieval
- malformed vectors degrade safely to lexical retrieval
- OpenAI embedding responses are ordered by provider index
- response-count mismatch is rejected
- security escalation remains deterministic under successful semantic retrieval
- existing BSF-2 model authority boundaries remain intact

## Current milestone
**BSF-4 — Stripe Support Simulator**

Planned scope:
1. Synthetic refund-request scenarios
2. Failed-payment and invoice scenarios
3. Cancellation / reactivation scenarios
4. Upgrade / entitlement mismatch scenarios
5. Dispute / chargeback scenarios that force human review
6. No real Stripe credentials, IDs, or customer/payment data

## Longer-term direction
Job-readiness remains the immediate priority. After the core portfolio milestones, the planned community path is contributor readiness, then extraction of a dedicated GitHub Action for possible Marketplace publication, with a GitHub App considered only if real adoption justifies it. See `docs/ROADMAP.md`.
