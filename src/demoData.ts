import type { KnowledgeArticle, SupportTicket } from "./types";

export const knowledgeBase: KnowledgeArticle[] = [
  {
    id: "kb-billing-entitlements",
    title: "Subscription entitlement refresh",
    tags: ["billing", "subscription", "upgrade", "entitlement", "plan"],
    body: "After a successful plan change, verify the billing event and refresh account entitlements. If billing state and application state disagree, do not manually alter payment records; collect the account state and escalate for investigation.",
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
    body: "I upgraded my subscription to Pro but my account is still showing Starter. Can you help?",
    customerPlan: "pro",
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
];
