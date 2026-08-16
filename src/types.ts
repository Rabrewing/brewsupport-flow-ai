import type { BillingSupportAssessment } from "./billing/types";

export type TicketCategory = "billing" | "account" | "bug" | "how_to" | "security" | "feedback" | "other";
export type Severity = "low" | "medium" | "high" | "critical";
export type SupportTier = 1 | 2 | 3;
export type RetrievalStrategy = "lexical" | "semantic" | "hybrid";
export type RetrievalMode = "lexical" | "hybrid" | "lexical-fallback";

export interface SupportTicket {
  id: string;
  subject: string;
  body: string;
  customerPlan?: "starter" | "pro" | "team";
  /** Optional synthetic BSF-4 billing fixture. Never a production Stripe/customer identifier. */
  billingScenarioId?: string;
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
  /** Final score used for ranking and downstream confidence. */
  score: number;
  /** Exact-token overlap score from the deterministic lexical retriever. */
  lexicalScore?: number;
  /** Cosine similarity score supplied by the semantic retriever. */
  semanticScore?: number;
  strategy?: RetrievalStrategy;
}

export interface RetrievalMetadata {
  mode: RetrievalMode;
  provider?: string;
  model?: string;
  fallbackReason?: string;
}

export interface SupportDecision {
  classification: Classification;
  retrieved: RetrievalResult[];
  retrieval: RetrievalMetadata;
  confidence: number;
  escalate: boolean;
  escalationReasons: string[];
  draft: string;
  vocThemes: string[];
  billing?: BillingSupportAssessment;
}
