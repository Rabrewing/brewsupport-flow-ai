import type { EmbeddingProvider } from "../retrieval/types";
import { runHybridSupportFlow } from "../retrieval/hybridSupportFlow";
import { runSupportFlow } from "../supportFlow";
import type { KnowledgeArticle, SupportDecision, SupportTicket } from "../types";
import { applySyntheticBillingPolicy } from "./supportFlow";

export function runLocalSupportFlowWithBilling(
  ticket: SupportTicket,
  articles: KnowledgeArticle[],
): SupportDecision {
  return applySyntheticBillingPolicy(ticket, runSupportFlow(ticket, articles));
}

export async function runHybridSupportFlowWithBilling(
  ticket: SupportTicket,
  articles: KnowledgeArticle[],
  provider?: EmbeddingProvider,
): Promise<SupportDecision> {
  const decision = await runHybridSupportFlow(ticket, articles, provider);
  return applySyntheticBillingPolicy(ticket, decision);
}
