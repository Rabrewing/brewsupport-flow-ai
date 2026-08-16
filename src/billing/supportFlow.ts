import type { SupportDecision, SupportTicket } from "../types";
import { assessBillingScenario } from "./policy";
import { findSyntheticBillingScenario } from "./syntheticBillingData";

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function applySyntheticBillingPolicy(
  ticket: SupportTicket,
  decision: SupportDecision,
): SupportDecision {
  const scenario = findSyntheticBillingScenario(ticket.billingScenarioId);
  if (!scenario) return decision;

  const billing = assessBillingScenario(scenario);
  const escalationReasons = billing.humanReviewRequired
    ? unique([
        ...decision.escalationReasons,
        ...billing.reasons.map((reason) => `billing-policy:${reason}`),
      ])
    : decision.escalationReasons;

  return {
    ...decision,
    billing,
    escalate: decision.escalate || billing.humanReviewRequired,
    escalationReasons,
    vocThemes: unique([
      ...decision.vocThemes,
      "billing operations",
      ...(billing.kind === "refund_request" ? ["refund request"] : []),
      ...(billing.kind === "dispute_chargeback" ? ["payment dispute"] : []),
      ...(billing.kind === "upgrade_entitlement_mismatch" ? ["entitlement mismatch"] : []),
    ]),
  };
}
