# BrewSupport Flow AI — Roadmap

## Priority order

### 1. Job-readiness first
BrewSupport Flow AI exists first as a strong, inspectable public engineering portfolio for Randy Brewington's technical customer support / AI automation and AI solutions-engineering job search.

The repository should demonstrate real engineering judgment without exposing proprietary BrewVerse implementation code or pretending synthetic support fixtures are production customer traffic.

### 2. Core portfolio architecture — complete
Core milestone sequence:

- **BSF-1 — Interactive Support Operations Dashboard** — merged / certified
- **BSF-2 — Governed AI Provider Layer** — merged / certified
- **BSF-3 — Semantic RAG** — merged / certified
- **BSF-4 — Stripe Support Simulator** — merged / certified
- **BSF-5 — Support Operations Intelligence** — merged / certified

BSF-4 established realistic synthetic billing-support cases while preserving the rule that explanation and recommendation are different from authority to mutate money or account state.

BSF-5 completes the planned core portfolio architecture by turning individual deterministic support decisions into operational intelligence: throughput and latency, escalation rates, category and billing trends, confidence distribution, recurring issue patterns, and an evidence-backed Voice-of-Customer action queue.

The analytics layer remains observational. It may identify patterns and recommend areas to investigate, but it cannot change the authority or outcome of an individual support case.

### 3. Return focus to job-readiness and interview fluency
With BSF-1 through BSF-5 complete, the default priority is not immediate feature expansion. The next step is to use the completed architecture as interview proof and make sure the implementation can be explained clearly at multiple levels:

- product problem and user value
- support-operations workflow
- AI / RAG architecture
- deterministic authority and human governance
- synthetic Stripe-support design
- evaluation and regression strategy
- operations-intelligence metrics and failure handling

New product features should be added only when they materially strengthen the portfolio, address a real architectural gap, or support the later community direction.

### 4. Community contribution direction
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

The repository currently has no open-source license grant. Contributor-readiness work should not silently change that legal boundary.

### 5. GitHub Marketplace extraction
Do not turn the full reference application into a Marketplace artifact directly. Instead, extract reusable automation into a dedicated repository such as:

`Rabrewing/brewsupport-flow-action`

Potential GitHub Action workflow:

`GitHub Issue → classify → retrieve repository support context → grounded AI draft → confidence/risk gate → label / draft response / escalate`

The Action should preserve the same authority principle as the reference application: model output can assist with classification, retrieval, and drafting, but deterministic policy or human review retains authority over security, billing, account access, refunds, disputes, and other consequential support actions.

### 6. Possible future GitHub App
If the Action gains meaningful adoption, evaluate a hosted BrewSupport GitHub App for organization-level issue triage, knowledge retrieval, support intelligence, and Voice-of-Customer aggregation.

This is a future product/community direction, not a prerequisite for the current job search.

## Product principle

> Build the proof first. Protect the BrewVerse. Help the community when the foundation is ready.
