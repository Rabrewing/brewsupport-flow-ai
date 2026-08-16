export type BillingScenarioKind =
  | "upgrade_entitlement_mismatch"
  | "payment_failed"
  | "cancel_at_period_end"
  | "reactivated"
  | "invoice_request"
  | "refund_request"
  | "dispute_chargeback";

export type SyntheticSubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "unpaid";
export type SyntheticPaymentStatus = "succeeded" | "failed" | "requires_action" | "none";
export type SyntheticRefundStatus = "none" | "requested" | "approved" | "processed";
export type SyntheticDisputeStatus = "none" | "needs_response" | "under_review" | "won" | "lost";
export type BillingAuthority = "automated-explanation" | "human-approval-required" | "specialist-escalation";

export interface SyntheticBillingScenario {
  id: string;
  kind: BillingScenarioKind;
  customerId: string;
  subscription: {
    id: string;
    status: SyntheticSubscriptionStatus;
    plan: "starter" | "pro" | "team";
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string;
    latestInvoiceId?: string;
  };
  payment: {
    id?: string;
    status: SyntheticPaymentStatus;
    amountCents?: number;
    currency?: "usd";
    failureReason?: string;
  };
  invoice?: {
    id: string;
    status: "paid" | "open" | "void";
    amountDueCents: number;
    hostedInvoiceUrl?: string;
  };
  refund: {
    status: SyntheticRefundStatus;
  };
  dispute: {
    id?: string;
    status: SyntheticDisputeStatus;
  };
  applicationEntitlement: "starter" | "pro" | "team";
  notes: string[];
}

export type BillingAction =
  | "explain_billing_state"
  | "recommend_payment_update"
  | "provide_invoice_guidance"
  | "explain_cancellation_timing"
  | "explain_reactivation_state"
  | "investigate_entitlement_sync"
  | "request_refund_review"
  | "request_dispute_review";

export type ProhibitedBillingAction =
  | "issue_refund"
  | "reverse_charge"
  | "change_payment_method"
  | "resolve_dispute"
  | "alter_subscription"
  | "alter_financial_records"
  | "force_entitlement";

export interface BillingSupportAssessment {
  scenarioId: string;
  kind: BillingScenarioKind;
  authority: BillingAuthority;
  humanReviewRequired: boolean;
  recommendedActions: BillingAction[];
  prohibitedActions: ProhibitedBillingAction[];
  reasons: string[];
  evidence: string[];
  summary: string;
}
