import { buildSupportDecision, classifyTicket } from "../supportFlow";
import type { KnowledgeArticle, SupportDecision, SupportTicket } from "../types";
import { retrieveKnowledgeHybrid } from "./hybridRetriever";
import type { EmbeddingProvider, HybridRetrievalOptions } from "./types";

export async function runHybridSupportFlow(
  ticket: SupportTicket,
  articles: KnowledgeArticle[],
  provider?: EmbeddingProvider,
  options?: HybridRetrievalOptions,
): Promise<SupportDecision> {
  const classification = classifyTicket(ticket);
  const retrieval = await retrieveKnowledgeHybrid(ticket, articles, provider, options);
  return buildSupportDecision(ticket, classification, retrieval.results, retrieval.metadata);
}
