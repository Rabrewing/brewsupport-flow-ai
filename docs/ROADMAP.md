# BrewSupport Flow AI — Roadmap

## Priority order

### 1. Job-readiness first
BrewSupport Flow AI exists first as a strong, inspectable public engineering portfolio for Randy Brewington's technical customer support / AI automation job search, with Hercules as the immediate target role.

The repository should demonstrate real engineering judgment without exposing proprietary BrewVerse implementation code or pretending synthetic support fixtures are production customer traffic.

### 2. Complete the portfolio-quality support architecture
Current milestone sequence:

- **BSF-1 — Interactive Support Operations Dashboard** — merged / certified
- **BSF-2 — Governed AI Provider Layer** — merged / certified
- **BSF-3 — Semantic RAG** — merged / certified
- **BSF-4 — Stripe Support Simulator** — active / certification in progress
- **BSF-5 — Support Operations Intelligence** — planned

BSF-4 extends the portfolio with realistic synthetic billing-support cases while preserving the rule that explanation and recommendation are different from authority to mutate money or account state.

### 3. Community contribution direction
After the core portfolio milestones are stable, make the repository contributor-friendly without weakening its public-IP boundaries or safety model.

Planned community work:
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- SECURITY.md
- issue and pull-request templates
- architecture contribution rules
- `good first issue` and `help wanted` opportunities
- contributor acknowledgements
- deliberate licensing decision before inviting broad reuse

### 4. GitHub Marketplace extraction
Do not turn the full reference application into a Marketplace artifact directly. Instead, extract reusable automation into a dedicated repository such as:

`Rabrewing/brewsupport-flow-action`

Potential GitHub Action workflow:

`GitHub Issue → classify → retrieve repository support context → grounded AI draft → confidence/risk gate → label / draft response / escalate`

The Action should preserve the same authority principle as the reference application: model output can assist with classification, retrieval, and drafting, but deterministic policy or human review retains authority over security, billing, account access, refunds, disputes, and other consequential support actions.

### 5. Possible future GitHub App
If the Action gains meaningful adoption, evaluate a hosted BrewSupport GitHub App for organization-level issue triage, knowledge retrieval, support intelligence, and Voice-of-Customer aggregation.

This is a future product/community direction, not a prerequisite for the current job search.

## Product principle

> Build the proof first. Protect the BrewVerse. Help the community when the foundation is ready.
