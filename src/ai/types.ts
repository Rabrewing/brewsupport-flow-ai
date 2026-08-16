import type { Classification, RetrievalResult, SupportTicket } from "../types";

export interface DraftContext {
  ticket: SupportTicket;
  classification: Classification;
  retrieved: RetrievalResult[];
  confidence: number;
  requiresHumanReview: boolean;
  escalationReasons: string[];
}

export interface ProviderDraft {
  customerReply: string;
  groundedArticleIds: string[];
  rationale: string;
}

export interface DraftProvider {
  readonly name: string;
  readonly model: string;
  generateDraft(context: DraftContext): Promise<unknown>;
}

export type DraftSource = "ai" | "deterministic-fallback";

export interface GovernedDraftResult {
  draft: string;
  source: DraftSource;
  provider: string;
  model?: string;
  groundedArticleIds: string[];
  rationale: string;
  fallbackReason?: string;
  escalate: boolean;
  escalationReasons: string[];
  confidence: number;
}
