# BSF-5 — Support Operations Intelligence

## Purpose

BSF-5 turns individual BrewSupport decisions into a deterministic operations-intelligence layer.

The milestone answers a different question from BSF-1 through BSF-4:

> Once support decisions are being made safely, what can the team learn from the aggregate behavior of the queue?

The intelligence layer is intentionally observational. It analyzes support evidence and synthetic operational history; it does not gain authority to reclassify tickets, change escalation policy, mutate billing state, approve AI output, or take customer/account actions.

## Architecture

```text
Synthetic historical tickets
        |
        v
Existing support workflow
(classification / retrieval / confidence / escalation / billing authority)
        |
        +--------------------+
        |                    |
        v                    v
SupportDecision      Synthetic operational observation
                     (received / first response / resolution / outcome)
        |                    |
        +----------+---------+
                   v
        SupportCaseRecord[]
                   |
                   v
   buildSupportOperationsIntelligence()
                   |
     +-------------+------------------------------+
     |             |              |               |
     v             v              v               v
 Throughput    Category       Confidence       Billing
 & latency      trends        distribution     authority
     |             |              |               |
     +-------------+------+-------+---------------+
                          v
                VOC / recurring patterns
                          |
                          v
              deterministic action queue
```

## Data contracts

### `SupportCaseObservation`

Operational facts are separate from ticket content and support policy:

- `ticketId`
- `receivedAt`
- `firstResponseAt`
- `resolvedAt`
- `outcome`
- optional `reopened`

This separation keeps the support engine focused on support decisions while allowing the analytics layer to consume lifecycle evidence independently.

### `SupportCaseRecord`

A record joins three evidence surfaces:

1. the synthetic support ticket
2. the existing deterministic `SupportDecision`
3. the synthetic operational observation

The intelligence engine consumes records; it does not recompute or override support policy.

## Operations summary

BSF-5 calculates:

- total historical cases
- resolved, open, and policy-escalated case counts
- resolution rate
- policy escalation rate
- average support confidence
- median first-response latency
- median resolution latency
- average daily intake
- average daily resolved throughput
- reopened case count

### Timestamp safety

Latency calculations accept only valid forward-moving timestamp pairs.

Missing, invalid, or reversed timestamps are excluded rather than coerced into misleading zero or negative durations.

## Category trends

For every observed primary support category, BSF-5 exposes:

- count
- share of historical volume
- escalation rate
- average confidence

Primary category and billing involvement remain separate dimensions.

A dispute can therefore be correctly represented as:

- high-risk/security-oriented primary escalation behavior
- **and** a billing-involved case with specialist billing authority

The analytics layer does not flatten these distinct operational facts into one label.

## Billing-authority intelligence

Billing involvement is aggregated independently of primary support category.

The dashboard reports the distribution across the BSF-4 authority contract:

- `automated-explanation`
- `human-approval-required`
- `specialist-escalation`

This allows an operator to see how much billing volume is safe to explain automatically versus how much requires consequential human or specialist review.

## Confidence distribution

Cases are grouped into three evidence bands:

- **high** — 80% to 100%
- **medium** — 65% to 79%
- **low** — below the 65% auto-resolution confidence threshold

Confidence remains advisory evidence.

A high-confidence case can still require escalation because deterministic tier, security, billing, or other policy rules remain authoritative.

## Recurring issue patterns

BSF-5 aggregates the existing deterministic Voice-of-Customer themes across support history.

A theme becomes a recurring pattern when it appears in at least two historical cases.

Each pattern exposes:

- count
- share of historical cases
- escalation rate
- average confidence
- deterministic operational recommendation

Recommendations are intentionally generic and evidence-driven:

- high escalation → investigate root cause and specialist/product/knowledge workflow
- low confidence → improve verified knowledge and retrieval coverage
- repeated higher-confidence resolution → convert the resolution path into clearer self-service guidance

No LLM is required to produce the operations recommendation.

## Voice-of-Customer action queue

The intelligence engine turns theme evidence into a small prioritized action queue:

- `act`
- `review`
- `watch`

Priority is derived from frequency, share of support history, and escalation rate.

Each action includes the evidence behind the priority and a recommended next operational step.

This makes Voice-of-Customer output inspectable instead of presenting an unexplained AI-generated summary.

## Synthetic historical dataset

BSF-5 uses a separate historical portfolio dataset rather than pretending the live demo queue is production history.

The dataset contains 14 synthetic cases across:

- subscription / entitlement mismatch
- failed payment
- cancellation timing
- reactivation
- invoice guidance
- refund request
- dispute / chargeback
- account access
- how-to
- bug / performance
- feedback / UX clarity
- security

Operational observations span a synthetic three-day window.

No production support transcripts, customer identities, payment details, or live Stripe objects are present.

## UI

BSF-5 adds a dedicated `/intelligence` route rather than crowding the existing case workspace.

The root layout now provides two portfolio views:

- **Support workspace** — individual ticket analysis and governed AI workflow
- **Operations intelligence** — aggregate historical support evidence

The intelligence view displays:

- headline operations metrics
- throughput and latency
- category mix and escalation
- confidence distribution
- billing authority mix
- recurring issue patterns
- actionable Voice-of-Customer queue
- explicit architecture boundary

## Authority invariant

BSF-5 must never change the authority model established by earlier milestones.

Operational intelligence may:

- count
- aggregate
- compare
- identify recurring patterns
- prioritize investigation
- recommend workflow/knowledge/product review

Operational intelligence may not:

- change support tier
- change severity
- change confidence
- suppress escalation
- issue or approve refunds
- resolve disputes
- alter subscriptions or entitlements
- approve AI drafts
- mutate customer/account/billing state

## Evaluation / regression targets

BSF-5 tests prove:

1. every synthetic historical ticket has exactly one operational observation
2. throughput and latency metrics are deterministic
3. category trends remain separate from cross-cutting billing involvement
4. billing authority counts preserve BSF-4 distinctions
5. confidence bands account for every case exactly once
6. recurring VOC patterns produce evidence-backed recommendations
7. invalid timestamps cannot corrupt latency metrics
8. identical evidence produces identical operations intelligence
9. all BSF-1 through BSF-4 tests remain green

## Interview-level summary

> I built the intelligence layer separately from the support-policy layer. It consumes deterministic ticket decisions plus lifecycle observations, then calculates throughput, escalation, confidence, category and billing trends, recurring issues, and an evidence-backed VOC action queue. The analytics can tell the team where to investigate or improve self-service, but it cannot change the authority or outcome of an individual support case.
