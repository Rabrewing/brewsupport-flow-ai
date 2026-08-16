import type { BillingSupportAssessment, SyntheticBillingScenario } from "./types";

const ALWAYS_PROHIBITED = [
  "issue_refund",
  "reverse_charge",
  "change_payment_method",
  "resolve_dispute",
  "alter_subscription",
  "alter_financial_records",
  "force_entitlement",
] as const;

export function assessBillingScenario(scenario: SyntheticBillingScenario): BillingSupportAssessment {
  switch (scenario.kind) {
    case "upgrade_entitlement_mismatch":
      return {
        scenarioId: scenario.id,
        kind: scenario.kind,
        authority: "human-approval-required",
        humanReviewRequired: true,
        recommendedActions: ["explain_billing_state", "investigate_entitlement_sync"],
        prohibitedActions: [...ALWAYS_PROHIBITED],
        reasons: [
          "subscription payment state and application entitlement disagree",
          "entitlement mutation must be investigated before any account change",
        ],
        evidence: [
          `subscription:${scenario.subscription.status}/${scenario.subscription.plan}`,
          `payment:${scenario.payment.status}`,
          `application-entitlement:${scenario.applicationEntitlement}`,
        ],
        summary: "The synthetic billing record shows a paid Pro subscription while the application still reports Starter access.",
      };

    case "payment_failed":
      return {
        scenarioId: scenario.id,
        kind: scenario.kind,
        authority: "automated-explanation",
        humanReviewRequired: false,
        recommendedActions: ["explain_billing_state", "recommend_payment_update"],
        prohibitedActions: [...ALWAYS_PROHIBITED],
        reasons: ["support may explain the failed payment and approved recovery path without changing payment credentials"],
        evidence: [
          `subscription:${scenario.subscription.status}`,
          `payment:${scenario.payment.status}`,
          `failure:${scenario.payment.failureReason ?? "unspecified"}`,
          `invoice:${scenario.invoice?.status ?? "none"}`,
        ],
        summary: "The synthetic subscription is past due because the latest payment failed; support may explain next steps but cannot modify payment details.",
      };

    case "cancel_at_period_end":
      return {
        scenarioId: scenario.id,
        kind: scenario.kind,
        authority: "automated-explanation",
        humanReviewRequired: false,
        recommendedActions: ["explain_billing_state", "explain_cancellation_timing"],
        prohibitedActions: [...ALWAYS_PROHIBITED],
        reasons: ["the cancellation flag and paid-through date are deterministic billing state that can be explained safely"],
        evidence: [
          `subscription:${scenario.subscription.status}`,
          `cancel-at-period-end:${scenario.subscription.cancelAtPeriodEnd}`,
          `current-period-end:${scenario.subscription.currentPeriodEnd}`,
        ],
        summary: "The synthetic subscription remains active until the current paid period ends, when cancellation is scheduled to take effect.",
      };

    case "reactivated":
      return {
        scenarioId: scenario.id,
        kind: scenario.kind,
        authority: "automated-explanation",
        humanReviewRequired: false,
        recommendedActions: ["explain_billing_state", "explain_reactivation_state"],
        prohibitedActions: [...ALWAYS_PROHIBITED],
        reasons: ["the synthetic subscription and application entitlement agree after reactivation"],
        evidence: [
          `subscription:${scenario.subscription.status}`,
          `cancel-at-period-end:${scenario.subscription.cancelAtPeriodEnd}`,
          `application-entitlement:${scenario.applicationEntitlement}`,
        ],
        summary: "The synthetic subscription is active, the cancellation flag is cleared, and the application entitlement matches the Team plan.",
      };

    case "invoice_request":
      return {
        scenarioId: scenario.id,
        kind: scenario.kind,
        authority: "automated-explanation",
        humanReviewRequired: false,
        recommendedActions: ["explain_billing_state", "provide_invoice_guidance"],
        prohibitedActions: [...ALWAYS_PROHIBITED],
        reasons: ["support may provide guidance for an existing synthetic invoice without changing financial records"],
        evidence: [
          `invoice:${scenario.invoice?.id ?? "none"}`,
          `invoice-status:${scenario.invoice?.status ?? "none"}`,
          `payment:${scenario.payment.status}`,
        ],
        summary: "The synthetic invoice is already paid and may be referenced for customer guidance; no billing mutation is required.",
      };

    case "refund_request":
      return {
        scenarioId: scenario.id,
        kind: scenario.kind,
        authority: "human-approval-required",
        humanReviewRequired: true,
        recommendedActions: ["explain_billing_state", "request_refund_review"],
        prohibitedActions: [...ALWAYS_PROHIBITED],
        reasons: [
          "a refund request is consequential financial action",
          "support automation may explain and route the request but cannot issue or promise the refund",
        ],
        evidence: [
          `payment:${scenario.payment.status}`,
          `refund:${scenario.refund.status}`,
          `invoice:${scenario.invoice?.status ?? "none"}`,
        ],
        summary: "The synthetic payment succeeded and a refund has only been requested; a human must review any financial action.",
      };

    case "dispute_chargeback":
      return {
        scenarioId: scenario.id,
        kind: scenario.kind,
        authority: "specialist-escalation",
        humanReviewRequired: true,
        recommendedActions: ["request_dispute_review"],
        prohibitedActions: [...ALWAYS_PROHIBITED],
        reasons: [
          "chargeback/dispute handling requires specialist review",
          "automation must not concede, resolve, reverse, or otherwise alter dispute state",
        ],
        evidence: [
          `dispute:${scenario.dispute.status}`,
          `payment:${scenario.payment.status}`,
          `amount:${scenario.payment.amountCents ?? 0}-${scenario.payment.currency ?? "usd"}`,
        ],
        summary: "The synthetic chargeback is awaiting a specialist response and cannot be resolved by support automation.",
      };
  }
}
