import assert from "node:assert/strict";
import test from "node:test";
import { OpenAiEmbeddingProvider } from "../src/retrieval/openAiEmbeddingProvider";

const originalFetch = globalThis.fetch;

test("OpenAI embedding adapter orders vectors by provider index", { concurrency: false }, async () => {
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({
        data: [
          { index: 1, embedding: [0, 1] },
          { index: 0, embedding: [1, 0] },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )) as typeof fetch;

  try {
    const provider = new OpenAiEmbeddingProvider({ apiKey: "test-key", model: "test-embedding-model" });
    const vectors = await provider.embed(["query", "article"]);
    assert.deepEqual(vectors, [
      [1, 0],
      [0, 1],
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("OpenAI embedding adapter rejects response-count mismatch", { concurrency: false }, async () => {
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({
        data: [{ index: 0, embedding: [1, 0] }],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )) as typeof fetch;

  try {
    const provider = new OpenAiEmbeddingProvider({ apiKey: "test-key", model: "test-embedding-model" });
    await assert.rejects(() => provider.embed(["query", "article"]), /count did not match/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
