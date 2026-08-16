import type { KnowledgeArticle, SupportTicket } from "./types";

export const knowledgeBase: KnowledgeArticle[] = [
  {
    id: "kb-billing-entitlements",
    title: "Subscription entitlement refresh",
    tags: ["billing", "subscription", "upgrade", "entitlement", "plan", "starter", "pro"],
    body: "After a successful plan change, verify the billing event and compare the subscription plan with application entitlements. If billing state and application state disagree, do not force access or alter payment records; collect the account state and escalate for investigation.",
  },
  {
    id: "kb-payment-failure",
    title: "Failed payment and past-due guidance",
    tags: ["billing", "payment", "failed", "past_due", "card", "invoice", "retry"],
    body: "When a payment fails, explain the current subscription and invoice state and direct the customer to the approved payment-update flow. Support automation must not request card details or change a payment method on the customer's behalf.",
  },
  {
    id: "kb-cancellation-reactivation",
    title: "Cancellation and reactivation timing",
    tags: ["billing", "cancel", "cancellation", "reactivate", "reactivation", "period", "access"],
    body: "A subscription scheduled to cancel at period end remains active through the paid-through date. If cancellation is removed before the period ends, verify the subscription is active and that application entitlement agrees before confirming reactivation state.",
  },
  {
    id: "kb-invoice-access",
    title: "Invoice and receipt guidance",
    tags: ["billing", "invoice", "receipt", "paid", "download", "documentation"],
    body: "Support may guide a customer to an existing invoice or receipt when billing records show it is available. Do not fabricate invoice links or alter invoice/payment records.",
  },
  {
    id: "kb-refund-review",
    title: "Refund request review",
    tags: ["billing", "refund", "charge", "payment", "review", "approval"],
    body: "A refund request may be acknowledged and routed with relevant payment context, but support automation must not issue, promise, or represent a refund as completed. Financial action requires an authorized human review.",
  },
  {
    id: "kb-dispute-chargeback",
    title: "Dispute and chargeback escalation",
    tags: ["billing", "dispute", "chargeback", "payment", "fraud", "specialist", "evidence"],
    body: "Disputes and chargebacks require specialist review. Support automation may collect and summarize known evidence but must not concede, resolve, reverse, or otherwise alter dispute or payment state.",
  },
  {
    id: "kb-account-access",
    title: "Account access troubleshooting",
    tags: ["account", "login", "access", "email"],
    body: "Confirm the customer is using the expected sign-in method, verify the account email, and use approved recovery flows. Never request passwords or authentication secrets.",
  },
  {
    id: "kb-product-howto",
    title: "Getting started with projects",
    tags: ["how_to", "project", "help", "instructions"],
    body: "Open the Projects area, choose New Project, provide a clear goal, and review the generated plan before approving changes.",
  },
];

export const demoTickets: SupportTicket[] = [
  {
    id: "TKT-1001",
    subject: "Upgraded but still showing Starter",
    body: "I upgraded my subscription to Pro and the payment went through, but my account still shows Starter. Can you fix my access?",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2001",
  },
  {
    id: "TKT-1002",
    subject: "How do I create my first project?",
    body: "I just joined. How do I create a project and get started?",
    customerPlan: "starter",
  },
  {
    id: "TKT-1003",
    subject: "I think my account was hacked",
    body: "There is suspicious activity and I think my account was hacked. Please change everything immediately.",
    customerPlan: "team",
  },
  {
    id: "TKT-2002",
    subject: "My subscription payment failed",
    body: "My card was declined and now my Pro subscription says past due. What should I do to update payment?",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2002",
  },
  {
    id: "TKT-2003",
    subject: "I canceled but still have access",
    body: "I canceled my Pro subscription. Why can I still use it and when will my access end?",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2003",
  },
  {
    id: "TKT-2004",
    subject: "Did my subscription reactivate?",
    body: "I changed my mind about canceling. Can you confirm my Team subscription is active again?",
    customerPlan: "team",
    billingScenarioId: "BILL-DEMO-2004",
  },
  {
    id: "TKT-2005",
    subject: "I need my invoice",
    body: "Can you help me find the paid invoice or receipt for my Starter subscription?",
    customerPlan: "starter",
    billingScenarioId: "BILL-DEMO-2005",
  },
  {
    id: "TKT-2006",
    subject: "I want a refund",
    body: "I was charged for Pro and want a refund. Please refund the payment today.",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2006",
  },
  {
    id: "TKT-2007",
    subject: "Chargeback dispute on my account",
    body: "I opened a chargeback dispute for the Team subscription. Can you resolve the dispute and reverse the charge?",
    customerPlan: "team",
    billingScenarioId: "BILL-DEMO-2007",
  },
];
