import assert from "node:assert/strict";
import test from "node:test";
import { demoTickets, knowledgeBase } from "../src/demoData";
import { retrieveKnowledgeHybrid } from "../src/retrieval/hybridRetriever";
import { runHybridSupportFlow } from "../src/retrieval/hybridSupportFlow";
import type { EmbeddingProvider } from "../src/retrieval/types";
import { runSupportFlow } from "../src/supportFlow";
import type { SupportTicket } from "../src/types";

function semanticFixtureProvider(): EmbeddingProvider {
  return {
    name: "fixture-embeddings",
    model: "fixture-v1",
    async embed(inputs: string[]) {
      return inputs.map((input, index) => {
        if (index === 0) return [1, 0, 0];
        if (input.includes("Subscription entitlement refresh")) return [1, 0, 0];
        if (input.includes("Account access troubleshooting")) return [0, 1, 0];
        return [0, 0, 1];
      });
    },
  };
}

test("hybrid retrieval uses semantic similarity to strengthen the relevant KB match", async () => {
  const ticket: SupportTicket = {
    id: "TKT-RAG-1",
    subject: "My paid features never unlocked",
    body: "I moved to the better plan but the app did not grant what I paid for.",
    customerPlan: "pro",
  };

  const retrieval = await retrieveKnowledgeHybrid(ticket, knowledgeBase, semanticFixtureProvider());

  assert.equal(retrieval.metadata.mode, "hybrid");
  assert.equal(retrieval.metadata.provider, "fixture-embeddings");
  assert.equal(retrieval.results[0]?.article.id, "kb-billing-entitlements");
  assert.equal(retrieval.results[0]?.semanticScore, 1);
  assert.equal(retrieval.results[0]?.strategy, "hybrid");
  assert.ok((retrieval.results[0]?.score ?? 0) >= (retrieval.results[0]?.lexicalScore ?? 0));
});

test("embedding provider failure falls back to deterministic lexical retrieval", async () => {
  const provider: EmbeddingProvider = {
    name: "failing-provider",
    model: "fixture-v1",
    async embed() {
      throw new Error("simulated embedding outage");
    },
  };

  const decision = await runHybridSupportFlow(demoTickets[0], knowledgeBase, provider);

  assert.equal(decision.retrieval.mode, "lexical-fallback");
  assert.equal(decision.retrieved[0]?.article.id, "kb-billing-entitlements");
  assert.match(decision.retrieval.fallbackReason ?? "", /simulated embedding outage/);
});

test("malformed embedding vectors are rejected and degrade to lexical retrieval", async () => {
  const provider: EmbeddingProvider = {
    name: "malformed-provider",
    model: "fixture-v1",
    async embed(inputs) {
      return inputs.map((_, index) => (index === 0 ? [1, 0] : [1]));
    },
  };

  const decision = await runHybridSupportFlow(demoTickets[1], knowledgeBase, provider);

  assert.equal(decision.retrieval.mode, "lexical-fallback");
  assert.equal(decision.retrieved[0]?.article.id, "kb-product-howto");
});

test("security escalation remains deterministic even with successful semantic retrieval", async () => {
  const decision = await runHybridSupportFlow(demoTickets[2], knowledgeBase, semanticFixtureProvider());

  assert.equal(decision.retrieval.mode, "hybrid");
  assert.equal(decision.classification.severity, "critical");
  assert.equal(decision.classification.tier, 3);
  assert.equal(decision.escalate, true);
  assert.ok(decision.escalationReasons.includes("high-risk policy signal"));
});

test("no embedding provider preserves the existing lexical support path", async () => {
  const lexical = runSupportFlow(demoTickets[0], knowledgeBase);
  const hybridWithoutProvider = await runHybridSupportFlow(demoTickets[0], knowledgeBase);

  assert.equal(hybridWithoutProvider.retrieval.mode, "lexical");
  assert.equal(hybridWithoutProvider.retrieved[0]?.article.id, lexical.retrieved[0]?.article.id);
  assert.equal(hybridWithoutProvider.confidence, lexical.confidence);
  assert.equal(hybridWithoutProvider.escalate, lexical.escalate);
});
