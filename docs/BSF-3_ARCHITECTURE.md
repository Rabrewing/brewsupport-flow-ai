# BSF-3 — Semantic RAG Architecture

## Goal
Improve support knowledge retrieval beyond exact-token overlap while preserving deterministic safety and graceful degradation.

## Runtime flow

```text
Synthetic support ticket
        |
        v
Deterministic classification
        |
        +------------------------------+
        |                              |
        v                              v
Lexical KB retrieval          Embedding provider
(always available)            (optional, server-side)
        |                              |
        +--------------+---------------+
                       |
                       v
              Hybrid ranker
        lexical + semantic evidence
                       |
                       v
              Retrieval provenance
     combined / lexical / semantic scores
                       |
                       v
             Confidence calculation
                       |
                       v
          Deterministic escalation gate
                       |
                       v
              Governed AI drafting
                       |
                       v
                 Human action
```

## Provider abstraction
`EmbeddingProvider` exposes only:

```ts
embed(inputs: string[]): Promise<number[][]>
```

The support engine does not depend directly on one embedding vendor. The first adapter uses OpenAI's embeddings endpoint with `text-embedding-3-small` as the default model when an API key is configured.

## Hybrid ranking
The default ranking weights are:

- lexical evidence: 35%
- semantic evidence: 65%

Weights are normalized before use. The semantic score is cosine similarity clamped to the 0-1 range. The combined score remains the score consumed by the existing confidence calculation.

Every returned result can expose:

- final combined score
- lexical score
- semantic score
- retrieval strategy (`lexical`, `semantic`, or `hybrid`)

This makes the retrieval path inspectable instead of hiding a single unexplained relevance number.

## Safe degradation
Semantic retrieval is optional. The system falls back to deterministic lexical retrieval when:

- no embedding provider is configured
- the embedding provider throws or times out
- the provider returns the wrong number of vectors
- vectors are empty, malformed, non-finite, zero magnitude, or dimensionally inconsistent

A semantic failure does not fail the support case.

## Authority boundary
BSF-3 does **not** move policy authority into embeddings or the LLM.

Semantic retrieval may influence which KB evidence is ranked highest and therefore the retrieval component of confidence. It cannot directly set or override:

- support tier
- severity
- risk signals
- escalation state
- escalation reasons
- approval state
- consequential billing, security, account, or data actions

A security case remains Tier 3 / human-governed even if semantic retrieval returns a highly relevant article with a perfect score.

## Public portfolio boundary
- synthetic tickets only
- synthetic knowledge base only
- OpenAI credentials remain server-side
- the public API accepts predefined synthetic ticket IDs rather than arbitrary prompts
- no production BrewVerse implementation code or customer data

## Certification targets
BSF-3 is not complete until CI proves:

1. production dependency audit passes
2. all existing BSF-1 / BSF-2 tests remain green
3. semantic ranking test passes
4. embedding outage fallback test passes
5. malformed-vector fallback test passes
6. security escalation remains deterministic under semantic retrieval
7. strict TypeScript passes
8. Next.js production build passes
