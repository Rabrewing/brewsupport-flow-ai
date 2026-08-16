export type TicketCategory = "billing" | "account" | "bug" | "how_to" | "security" | "feedback" | "other";
export type Severity = "low" | "medium" | "high" | "critical";
export type SupportTier = 1 | 2 | 3;

export interface SupportTicket {
  id: string;
  subject: string;
  body: string;
  customerPlan?: "starter" | "pro" | "team";
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  body: string;
  tags: string[];
}

export interface Classification {
  category: TicketCategory;
  severity: Severity;
  tier: SupportTier;
  signals: string[];
}

export interface RetrievalResult {
  article: KnowledgeArticle;
  score: number;
}

export interface SupportDecision {
  classification: Classification;
  retrieved: RetrievalResult[];
  confidence: number;
  escalate: boolean;
  escalationReasons: string[];
  draft: string;
  vocThemes: string[];
}
