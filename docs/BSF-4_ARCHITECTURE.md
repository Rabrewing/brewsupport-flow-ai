# BSF-4 — Stripe Support Simulator Architecture

## Purpose
BSF-4 demonstrates how AI-assisted support can reason over billing state without gaining authority to mutate money, payment credentials, disputes, subscriptions, or unsafe entitlements.

The implementation is intentionally **synthetic only**. It does not connect to a live Stripe account and does not copy BrewLotto's production billing implementation.

## Support flow

`Synthetic ticket → deterministic classification → synthetic billing-state lookup → deterministic billing authority → lexical/semantic KB retrieval → confidence/risk → governed AI draft → human approval or escalation`

## Synthetic scenarios

1. Upgrade paid but application entitlement is stale
2. Failed payment / past-due subscription
3. Cancellation scheduled at period end
4. Reactivated subscription
5. Invoice / receipt request
6. Refund request
7. Chargeback / dispute

All IDs use obvious demo values such as `sub_demo_*`, `pi_demo_*`, and `in_demo_*`.

## Authority classes

### `automated-explanation`
The system may explain verified state and recommend an approved next step. Examples include failed-payment guidance, cancellation timing, reactivation confirmation, and invoice guidance.

### `human-approval-required`
The system may summarize evidence and draft a response, but an authorized human must review the consequential action. Examples include refund requests and subscription/application entitlement mismatch.

### `specialist-escalation`
The system must route the case to a specialist. Chargebacks and disputes are the primary BSF-4 example.

## Actions the automation may recommend

- explain billing state
- recommend the approved payment-update flow
- provide invoice guidance
- explain cancellation timing
- explain reactivation state
- request entitlement-sync investigation
- request refund review
- request dispute review

## Actions the automation may not perform

- issue a refund
- reverse a charge
- change a payment method
- resolve a dispute
- alter a subscription
- alter financial records
- force an entitlement

These prohibitions are represented explicitly in the billing policy output and are visible in the dashboard.

## AI boundary

The BSF-2 drafting provider receives the synthetic billing assessment as **grounding context**, not as executable authority.

The model may use that evidence to explain the situation, but it cannot change:

- billing authority class
- human-review requirement
- escalation state
- support tier
- severity
- prohibited actions
- financial state

The structured-output contract still limits the model to customer-facing reply text, retrieved KB citations, and drafting rationale.

## Retrieval boundary

BSF-3 semantic RAG can improve which knowledge article is selected for a billing case. Semantic relevance cannot relax the deterministic billing policy.

A highly relevant refund or dispute article therefore does not make the financial action safe for autonomous execution.

## Failure behavior

- no AI provider → deterministic grounded response
- no embedding provider → lexical KB retrieval
- invalid embeddings → lexical fallback
- invalid AI structured output → deterministic draft fallback
- refund request → human approval regardless of model confidence
- dispute / chargeback → specialist escalation regardless of model confidence
- subscription/entitlement mismatch → human review before forcing access

## Public portfolio safety

- no real customer information
- no live Stripe account
- no Stripe secret keys
- no production webhook secrets
- no card or bank information
- no real payment IDs
- no production BrewLotto billing code
- non-routable demo invoice URLs only

## Interview principle

> Explain billing state automatically; mutate consequential financial state deliberately.

That principle is the BSF-4 extension of BrewSupport's broader rule: AI may recommend, but deterministic policy and authorized humans retain consequential authority.
