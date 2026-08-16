# BrewSupport Flow AI — Current State

## Status
**BSF-2 / Governed AI Provider Layer: CERTIFIED / READY TO MERGE**

Branch: `bsf-2-governed-ai-provider`  
PR: #2

BSF-1 remains merged and certified on `main` via PR #1.

## Implemented through BSF-2
- Public-portfolio engineering constitution and IP boundaries
- TypeScript support workflow foundation
- Typed ticket, classification, retrieval, and decision contracts
- Deterministic ticket classification
- Lightweight knowledge-base retrieval
- Confidence scoring
- Deterministic escalation policy
- Deterministic grounded-response baseline
- Voice-of-Customer theme extraction
- Synthetic support tickets and KB fixtures
- Next.js 16.3.1 + React 19.2.8 support operations dashboard
- Ticket queue and ticket detail workspace
- Classification / severity / support-tier visualization
- Retrieved knowledge evidence and match scores
- Confidence visualization and 65% auto-resolution threshold
- Human approve / escalate controls
- Policy-enforced approval blocking for escalated cases
- Provider-neutral AI drafting contract
- Server-side OpenAI Responses API adapter
- Strict JSON-schema structured output
- Validation that provider citations reference only already-retrieved KB articles
- Rejection of unexpected provider fields, including attempted policy decisions
- Bounded provider timeout
- Deterministic fallback on provider failure, malformed output, invalid grounding, or authority-boundary violations
- `/api/governed-draft` route restricted to predefined synthetic ticket IDs
- Dashboard UI for on-demand governed AI drafting and visible fallback state
- Safe `.env.example` with placeholders only
- BSF-2 architecture documentation
- GitHub Actions CI gate covering production dependency audit, tests, strict TypeScript, and production build

## Authority architecture
The AI provider is a drafting component, not the support-policy authority.

The provider may return only:
- customer-facing reply
- retrieved knowledge article IDs used for grounding
- drafting rationale

Deterministic application logic retains exclusive authority over:
- support tier
- severity
- confidence
- escalation state
- escalation reasons
- approval state

Tier 3, high-risk, or low-confidence cases remain human-governed even when a valid AI draft exists. Provider output that attempts to inject a policy field such as `escalate: false` is rejected and falls back to the deterministic support path.

## Public / data safety
- No production BrewVerse code
- No real customer data
- No real Stripe data or credentials
- No proprietary Brew Agentic / BrewAssist runtime copied into this project
- OpenAI credentials remain server-side only
- Public route accepts synthetic ticket IDs rather than arbitrary prompt text
- OpenAI Responses API requests set `store: false`
- No open-source license granted

## BSF-2 certification evidence
Final PR-head validation passed on 2026-08-16:
1. Dependency installation — PASS / 0 vulnerabilities reported
2. High-severity production dependency audit — PASS / 0 vulnerabilities
3. Unit tests — PASS / 9 passed, 0 failed
4. Strict TypeScript type checking — PASS
5. Next.js production build — PASS
6. Dynamic `/api/governed-draft` route included in production build — PASS

The certified test suite proves:
- valid grounded AI drafts can be accepted for low-risk cases
- AI drafting cannot override a deterministic mandatory escalation
- attempted provider policy-field injection is rejected
- hallucinated / unretrieved KB citations are rejected
- provider failures degrade safely to the deterministic support path
- existing BSF-1 classification and escalation behavior remains intact

## Merge state
PR #2 is certification-ready. The final documentation-only head must retain the same green CI gate before merge.

## Next milestone after merge
**BSF-3 — Semantic RAG**

Planned scope:
1. Embedding provider abstraction
2. Semantic retrieval over the synthetic knowledge base
3. Hybrid lexical + semantic retrieval strategy
4. Retrieval evidence and semantic similarity scores
5. Deterministic confidence integration
6. Tests for retrieval grounding and fallback behavior
