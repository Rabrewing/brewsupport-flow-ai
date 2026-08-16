# BSF-2 — Governed AI Provider Architecture

## Objective
Add real provider-backed AI drafting without allowing probabilistic model output to control consequential support decisions.

## Execution path

```text
Synthetic Ticket ID
      ↓
Deterministic Classification
      ↓
Knowledge Retrieval
      ↓
Confidence + Escalation Policy
      ↓
Provider-Neutral Draft Contract
      ↓
OpenAI Responses API (server-side only)
      ↓
Strict JSON Schema Output
      ↓
Grounding Validation
      ↓
Deterministic Policy Reattached
      ↓
AI Draft OR Safe Deterministic Fallback
```

## Authority boundary
The AI provider is allowed to return only:

- `customerReply`
- `groundedArticleIds`
- `rationale`

The provider cannot return or modify:

- support tier
- severity
- confidence
- escalation state
- escalation reasons
- approval state

Those values remain owned by deterministic application logic.

## Grounding boundary
Every accepted provider draft must cite at least one knowledge article that was already retrieved by the deterministic support workflow. A provider response citing an unknown article ID is rejected and replaced by the deterministic fallback.

## Provider failure boundary
Provider timeout, HTTP failure, malformed JSON, schema mismatch, invented knowledge citations, or other validation failure does not break the support workflow. The system falls back to the existing grounded deterministic draft while preserving the original escalation decision.

## Public portfolio / abuse boundary
The public API route accepts only IDs for the repository's predefined synthetic tickets. It is intentionally not an unrestricted OpenAI proxy and does not accept arbitrary customer text.

## Data handling
- OpenAI credentials are read server-side from environment variables only.
- `.env` files remain ignored.
- The Responses API request sets `store: false`.
- No real customer, billing, Stripe, or BrewVerse production data is used.
- No model response is allowed to claim that consequential account or billing actions occurred without supplied evidence.

## Configuration

```text
OPENAI_API_KEY=<server-side secret>
OPENAI_MODEL=gpt-5.6
AI_DRAFT_TIMEOUT_MS=8000
```

The timeout is bounded by application code to 1–15 seconds.

## Certification requirements
BSF-2 is not complete until CI proves:

1. production dependency audit passes
2. existing BSF-1 policy tests remain green
3. governed-draft tests pass
4. strict TypeScript passes
5. Next.js production build passes
6. tests prove model output cannot override mandatory escalation
