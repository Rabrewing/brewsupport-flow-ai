import assert from "node:assert/strict";
import test from "node:test";
import { generateGovernedDraft } from "../src/ai/governedDraft";
import type { DraftProvider } from "../src/ai/types";
import { demoTickets, knowledgeBase } from "../src/demoData";
import { runSupportFlow } from "../src/supportFlow";

function providerReturning(factory: DraftProvider["generateDraft"]): DraftProvider {
  return {
    name: "test-provider",
    model: "test-model",
    generateDraft: factory,
  };
}

test("uses a valid grounded AI draft for a low-risk ticket", async () => {
  const ticket = demoTickets[1];
  const decision = runSupportFlow(ticket, knowledgeBase);
  const provider = providerReturning(async (context) => ({
    customerReply: "Open the Projects area, choose New Project, and review the plan before approving changes.",
    groundedArticleIds: [context.retrieved[0]!.article.id],
    rationale: "The response is grounded in the retrieved getting-started article.",
  }));

  const result = await generateGovernedDraft(ticket, decision, provider);

  assert.equal(result.source, "ai");
  assert.equal(result.provider, "test-provider");
  assert.equal(result.escalate, false);
  assert.equal(result.groundedArticleIds.length, 1);
});

test("AI drafting cannot override a deterministic mandatory escalation", async () => {
  const ticket = demoTickets[2];
  const decision = runSupportFlow(ticket, knowledgeBase);
  const provider = providerReturning(async (context) => ({
    customerReply: "Thanks for reporting the suspicious activity. A specialist needs to review this before account changes are made.",
    groundedArticleIds: [context.retrieved[0]!.article.id],
    rationale: "The reply acknowledges the issue without claiming that a security action has already occurred.",
  }));

  const result = await generateGovernedDraft(ticket, decision, provider);

  assert.equal(result.source, "ai");
  assert.equal(result.escalate, true);
  assert.ok(result.escalationReasons.includes("high-risk policy signal"));
});

test("rejects hallucinated knowledge citations and falls back deterministically", async () => {
  const ticket = demoTickets[1];
  const decision = runSupportFlow(ticket, knowledgeBase);
  const provider = providerReturning(async () => ({
    customerReply: "This answer cites knowledge that was never retrieved.",
    groundedArticleIds: ["kb-invented-article"],
    rationale: "Invalid grounding should be rejected.",
  }));

  const result = await generateGovernedDraft(ticket, decision, provider);

  assert.equal(result.source, "deterministic-fallback");
  assert.equal(result.fallbackReason, "AI provider failed validation or execution");
});

test("provider failures degrade to the existing deterministic support path", async () => {
  const ticket = demoTickets[1];
  const decision = runSupportFlow(ticket, knowledgeBase);
  const provider = providerReturning(async () => {
    throw new Error("simulated provider outage");
  });

  const result = await generateGovernedDraft(ticket, decision, provider);

  assert.equal(result.source, "deterministic-fallback");
  assert.equal(result.escalate, decision.escalate);
  assert.equal(result.confidence, decision.confidence);
});
