# Changelog

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
