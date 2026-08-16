import assert from "node:assert/strict";
import test from "node:test";
import { generateGovernedDraft } from "../src/ai/governedDraft";
import type { DraftContext, DraftProvider } from "../src/ai/types";
import { assessBillingScenario } from "../src/billing/policy";
import { runLocalSupportFlowWithBilling } from "../src/billing/runBillingSupportFlow";
import { findSyntheticBillingScenario } from "../src/billing/syntheticBillingData";
import { demoTickets, knowledgeBase } from "../src/demoData";

function scenario(id: string) {
  const value = findSyntheticBillingScenario(id);
  assert.ok(value, `expected synthetic billing scenario ${id}`);
  return value;
}

function ticket(id: string) {
  const value = demoTickets.find((item) => item.id === id);
  assert.ok(value, `expected synthetic ticket ${id}`);
  return value;
}

test("upgrade entitlement mismatch requires human review before access mutation", () => {
  const assessment = assessBillingScenario(scenario("BILL-DEMO-2001"));
  const decision = runLocalSupportFlowWithBilling(ticket("TKT-1001"), knowledgeBase);

  assert.equal(assessment.authority, "human-approval-required");
  assert.equal(assessment.humanReviewRequired, true);
  assert.ok(assessment.recommendedActions.includes("investigate_entitlement_sync"));
  assert.ok(assessment.prohibitedActions.includes("force_entitlement"));
  assert.equal(decision.escalate, true);
  assert.equal(decision.billing?.kind, "upgrade_entitlement_mismatch");
});

test("failed payment may be explained but payment method changes stay prohibited", () => {
  const assessment = assessBillingScenario(scenario("BILL-DEMO-2002"));

  assert.equal(assessment.authority, "automated-explanation");
  assert.equal(assessment.humanReviewRequired, false);
  assert.ok(assessment.recommendedActions.includes("recommend_payment_update"));
  assert.ok(assessment.prohibitedActions.includes("change_payment_method"));
});

test("period-end cancellation may be explained from deterministic billing state", () => {
  const assessment = assessBillingScenario(scenario("BILL-DEMO-2003"));

  assert.equal(assessment.authority, "automated-explanation");
  assert.equal(assessment.humanReviewRequired, false);
  assert.ok(assessment.evidence.includes("cancel-at-period-end:true"));
  assert.ok(assessment.recommendedActions.includes("explain_cancellation_timing"));
});

test("reactivation guidance is allowed when synthetic subscription and entitlement agree", () => {
  const assessment = assessBillingScenario(scenario("BILL-DEMO-2004"));

  assert.equal(assessment.authority, "automated-explanation");
  assert.equal(assessment.humanReviewRequired, false);
  assert.ok(assessment.recommendedActions.includes("explain_reactivation_state"));
});

test("invoice request permits guidance without financial record mutation", () => {
  const assessment = assessBillingScenario(scenario("BILL-DEMO-2005"));

  assert.equal(assessment.authority, "automated-explanation");
  assert.ok(assessment.recommendedActions.includes("provide_invoice_guidance"));
  assert.ok(assessment.prohibitedActions.includes("alter_financial_records"));
});

test("refund request forces human approval and automation cannot issue refund", () => {
  const assessment = assessBillingScenario(scenario("BILL-DEMO-2006"));
  const decision = runLocalSupportFlowWithBilling(ticket("TKT-2006"), knowledgeBase);

  assert.equal(assessment.authority, "human-approval-required");
  assert.equal(assessment.humanReviewRequired, true);
  assert.ok(assessment.prohibitedActions.includes("issue_refund"));
  assert.equal(decision.escalate, true);
  assert.ok(decision.escalationReasons.some((reason) => reason.includes("consequential financial action")));
});

test("chargeback dispute requires specialist escalation and cannot be resolved by automation", () => {
  const assessment = assessBillingScenario(scenario("BILL-DEMO-2007"));
  const decision = runLocalSupportFlowWithBilling(ticket("TKT-2007"), knowledgeBase);

  assert.equal(assessment.authority, "specialist-escalation");
  assert.equal(assessment.humanReviewRequired, true);
  assert.ok(assessment.prohibitedActions.includes("resolve_dispute"));
  assert.equal(decision.classification.tier, 3);
  assert.equal(decision.escalate, true);
});

test("governed drafting receives billing evidence but deterministic authority remains final", async () => {
  const supportTicket = ticket("TKT-2006");
  const decision = runLocalSupportFlowWithBilling(supportTicket, knowledgeBase);
  let captured: DraftContext | undefined;

  const provider: DraftProvider = {
    name: "billing-test-provider",
    model: "test-model",
    async generateDraft(context) {
      captured = context;
      return {
        customerReply: "I can document your refund request and route it for authorized review, but I cannot promise or issue the refund from this automation.",
        groundedArticleIds: [context.retrieved[0]!.article.id],
        rationale: "The reply uses retrieved refund guidance and preserves required human review.",
      };
    },
  };

  const result = await generateGovernedDraft(supportTicket, decision, provider);

  assert.equal(captured?.billing?.kind, "refund_request");
  assert.equal(captured?.billing?.humanReviewRequired, true);
  assert.ok(captured?.billing?.prohibitedActions.includes("issue_refund"));
  assert.equal(result.source, "ai");
  assert.equal(result.escalate, true);
});
