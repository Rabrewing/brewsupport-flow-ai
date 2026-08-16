# BrewSupport Flow AI Engineering Constitution

## Mission
Build a public, portfolio-grade AI support automation reference implementation that demonstrates trustworthy high-volume SaaS support workflows without exposing proprietary BrewVerse intellectual property.

## Non-negotiable public-repository boundaries
1. Use synthetic customer, billing, account, and ticket data only.
2. Never commit secrets, real API keys, tokens, credentials, cookies, webhook secrets, private URLs, customer identifiers, production logs, or real payment data.
3. Never copy implementation code from BrewLotto, BrewAssist, Brew Agentic, BrewSearch, Project Zahav, or other private BrewVerse repositories.
4. Architectural concepts may be demonstrated independently, but implementation must be original to this repository.
5. No open-source license is granted unless Randy Brewington explicitly approves a license change.
6. `.env*` files are ignored. Only `.env.example` with placeholders may be committed.
7. AI-generated code is not accepted as correct until reviewed and validated by tests or deterministic checks.

## Product workflow
Ticket → Classify → Retrieve KB Context → Draft Response → Confidence Score → Escalate if Needed → Resolve → Summarize VOC

## Engineering rules
- TypeScript-first.
- Prefer small typed modules with explicit contracts.
- Separate probabilistic AI behavior from deterministic policy decisions.
- High-risk support decisions must be governed by deterministic escalation rules.
- Billing disputes, security concerns, suspected fraud, data loss, legal threats, and account ownership ambiguity must never be auto-resolved solely by an LLM.
- Retrieval context must be traceable to a knowledge-base record.
- Every automated draft should expose confidence and escalation rationale.
- Tests must cover classification, escalation, and confidence-policy behavior.

## Documentation contract
Keep these current as the repository evolves:
- `README.md` — hiring-manager/product overview
- `CURRENT_STATE.md` — what is actually implemented now
- `CHANGELOG.md` — meaningful repository changes
- `AGENTS.md` — engineering and public-release guardrails

## Public-release check before every major commit
- No secrets or real customer data
- No proprietary BrewVerse code
- No accidental `.env` files
- Synthetic fixtures clearly identified
- Tests pass
- README claims match implementation
- CURRENT_STATE reflects reality
