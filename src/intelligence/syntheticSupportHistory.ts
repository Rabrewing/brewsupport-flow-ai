import { runLocalSupportFlowWithBilling } from "../billing/runBillingSupportFlow";
import type { KnowledgeArticle, SupportTicket } from "../types";
import type { SupportCaseObservation, SupportCaseRecord } from "./types";

/**
 * Synthetic historical support tickets used only for portfolio analytics.
 * These are not production customer records and contain no real identities,
 * Stripe IDs, credentials, payment data, or support transcripts.
 */
export const syntheticHistoricalTickets: SupportTicket[] = [
  {
    id: "HIST-5001",
    subject: "Pro upgrade did not unlock Pro",
    body: "My upgrade payment succeeded but the application still shows Starter access.",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2001",
  },
  {
    id: "HIST-5002",
    subject: "Payment failed on renewal",
    body: "My Pro subscription payment failed and the invoice is still open. How do I update payment?",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2002",
  },
  {
    id: "HIST-5003",
    subject: "Why do I still have access after canceling?",
    body: "I canceled my subscription but I still have access. When does the paid period end?",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2003",
  },
  {
    id: "HIST-5004",
    subject: "Reactivate Team subscription",
    body: "I removed my cancellation. Can you confirm the Team subscription and access are active again?",
    customerPlan: "team",
    billingScenarioId: "BILL-DEMO-2004",
  },
  {
    id: "HIST-5005",
    subject: "Need a paid invoice copy",
    body: "Where can I find the paid invoice or receipt for my Starter subscription?",
    customerPlan: "starter",
    billingScenarioId: "BILL-DEMO-2005",
  },
  {
    id: "HIST-5006",
    subject: "Refund request for Pro charge",
    body: "I was charged for Pro and want a refund. Please refund the payment.",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2006",
  },
  {
    id: "HIST-5007",
    subject: "Chargeback needs resolution",
    body: "I opened a chargeback dispute. Can support resolve the dispute and reverse the charge?",
    customerPlan: "team",
    billingScenarioId: "BILL-DEMO-2007",
  },
  {
    id: "HIST-5008",
    subject: "Second upgrade still showing Starter",
    body: "I upgraded my subscription to Pro and billing is successful, but account access is still Starter.",
    customerPlan: "pro",
    billingScenarioId: "BILL-DEMO-2001",
  },
  {
    id: "HIST-5009",
    subject: "Cannot access my account",
    body: "I cannot login to my account with the expected email. What recovery steps should I use?",
    customerPlan: "starter",
  },
  {
    id: "HIST-5010",
    subject: "Login email access problem",
    body: "My account access is blocked and I am unsure which email sign-in method I used.",
    customerPlan: "pro",
  },
  {
    id: "HIST-5011",
    subject: "How do I create a project?",
    body: "I just joined. How do I create my first project and review the generated plan?",
    customerPlan: "starter",
  },
  {
    id: "HIST-5012",
    subject: "Projects screen keeps timing out",
    body: "The Projects screen is slow and keeps timing out. It is not working reliably.",
    customerPlan: "team",
  },
  {
    id: "HIST-5013",
    subject: "Project setup is confusing",
    body: "Feedback: the first project setup is confusing and the instructions are unclear.",
    customerPlan: "starter",
  },
  {
    id: "HIST-5014",
    subject: "Suspicious account activity",
    body: "I think my account was hacked because I see suspicious activity. Please secure it.",
    customerPlan: "team",
  },
];

export const syntheticHistoricalObservations: SupportCaseObservation[] = [
  { ticketId: "HIST-5001", receivedAt: "2026-08-14T13:05:00Z", firstResponseAt: "2026-08-14T13:13:00Z", outcome: "escalated" },
  { ticketId: "HIST-5002", receivedAt: "2026-08-14T13:32:00Z", firstResponseAt: "2026-08-14T13:39:00Z", resolvedAt: "2026-08-14T14:02:00Z", outcome: "resolved" },
  { ticketId: "HIST-5003", receivedAt: "2026-08-14T14:10:00Z", firstResponseAt: "2026-08-14T14:16:00Z", resolvedAt: "2026-08-14T14:27:00Z", outcome: "resolved" },
  { ticketId: "HIST-5004", receivedAt: "2026-08-14T15:20:00Z", firstResponseAt: "2026-08-14T15:31:00Z", resolvedAt: "2026-08-14T15:51:00Z", outcome: "resolved" },
  { ticketId: "HIST-5005", receivedAt: "2026-08-14T16:02:00Z", firstResponseAt: "2026-08-14T16:07:00Z", resolvedAt: "2026-08-14T16:18:00Z", outcome: "resolved" },
  { ticketId: "HIST-5006", receivedAt: "2026-08-15T12:15:00Z", firstResponseAt: "2026-08-15T12:24:00Z", outcome: "escalated" },
  { ticketId: "HIST-5007", receivedAt: "2026-08-15T12:44:00Z", firstResponseAt: "2026-08-15T12:49:00Z", outcome: "escalated" },
  { ticketId: "HIST-5008", receivedAt: "2026-08-15T13:11:00Z", firstResponseAt: "2026-08-15T13:24:00Z", outcome: "open", reopened: true },
  { ticketId: "HIST-5009", receivedAt: "2026-08-15T14:03:00Z", firstResponseAt: "2026-08-15T14:10:00Z", resolvedAt: "2026-08-15T14:31:00Z", outcome: "resolved" },
  { ticketId: "HIST-5010", receivedAt: "2026-08-15T15:22:00Z", firstResponseAt: "2026-08-15T15:34:00Z", resolvedAt: "2026-08-15T16:01:00Z", outcome: "resolved" },
  { ticketId: "HIST-5011", receivedAt: "2026-08-16T11:05:00Z", firstResponseAt: "2026-08-16T11:09:00Z", resolvedAt: "2026-08-16T11:21:00Z", outcome: "resolved" },
  { ticketId: "HIST-5012", receivedAt: "2026-08-16T12:18:00Z", firstResponseAt: "2026-08-16T12:25:00Z", outcome: "escalated", reopened: true },
  { ticketId: "HIST-5013", receivedAt: "2026-08-16T13:40:00Z", firstResponseAt: "2026-08-16T13:52:00Z", outcome: "open" },
  { ticketId: "HIST-5014", receivedAt: "2026-08-16T14:17:00Z", firstResponseAt: "2026-08-16T14:21:00Z", outcome: "escalated" },
];

export function buildSyntheticSupportHistory(articles: KnowledgeArticle[]): SupportCaseRecord[] {
  const observations = new Map(syntheticHistoricalObservations.map((observation) => [observation.ticketId, observation]));

  return syntheticHistoricalTickets.map((ticket) => {
    const observation = observations.get(ticket.id);
    if (!observation) throw new Error(`Missing synthetic operations observation for ${ticket.id}`);
    return {
      ticket,
      decision: runLocalSupportFlowWithBilling(ticket, articles),
      observation,
    };
  });
}
