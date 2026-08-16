# Changelog

## 0.3.0 — 2026-08-16

### Added
- Provider-neutral AI drafting contract
- Server-side OpenAI Responses API adapter using environment-provided credentials
- Strict JSON-schema structured output for customer reply, KB citations, and drafting rationale
- Grounding validator that rejects citations to knowledge not retrieved for the ticket
- Bounded AI-provider timeout
- Safe deterministic fallback for provider outage, malformed output, or invalid grounding
- `/api/governed-draft` route restricted to predefined synthetic ticket IDs
- Dashboard workflow for generating, inspecting, and regenerating governed AI drafts
- Provider/model/source metadata and visible safe-fallback state
- `.env.example` with placeholder-only AI provider configuration
- `docs/BSF-2_ARCHITECTURE.md`
- Four governed-draft tests

### Governance
- AI provider cannot set or alter tier, severity, confidence, escalation, escalation reasons, or approval state
- Deterministic support policy remains final authority after model generation
- High-risk and Tier 3 cases remain human-governed even when the model returns a valid draft
- Public API is not an unrestricted model proxy
- OpenAI Responses requests set `store: false`

### Validation
- Dependency installation reported 0 vulnerabilities
- High-severity production dependency audit passed with 0 vulnerabilities
- 8 unit tests passed, 0 failed
- Strict TypeScript check passed
- Next.js 16.3.1 production build passed
- Production build includes the dynamic `/api/governed-draft` route

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
- BSF-1 certified ready for merge

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
