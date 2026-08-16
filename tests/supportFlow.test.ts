import assert from "node:assert/strict";
import test from "node:test";
import { demoTickets, knowledgeBase } from "../src/demoData.js";
import { classifyTicket, runSupportFlow } from "../src/supportFlow.js";

test("classifies subscription mismatch as billing tier 2", () => {
  const result = classifyTicket(demoTickets[0]);
  assert.equal(result.category, "billing");
  assert.equal(result.tier, 2);
});

test("allows grounded low-risk how-to response without escalation", () => {
  const result = runSupportFlow(demoTickets[1], knowledgeBase);
  assert.equal(result.classification.category, "how_to");
  assert.equal(result.escalate, false);
  assert.ok(result.retrieved.length > 0);
  assert.ok(result.confidence >= 0.65);
});

test("security signal always escalates", () => {
  const result = runSupportFlow(demoTickets[2], knowledgeBase);
  assert.equal(result.classification.category, "security");
  assert.equal(result.classification.tier, 3);
  assert.equal(result.escalate, true);
  assert.ok(result.escalationReasons.includes("high-risk policy signal"));
});

test("unsupported ticket does not invent a confident answer", () => {
  const result = runSupportFlow(
    { id: "TKT-9999", subject: "Something unusual", body: "Purple clouds appeared in my dashboard." },
    knowledgeBase,
  );
  assert.equal(result.escalate, true);
  assert.ok(result.confidence < 0.65);
});
