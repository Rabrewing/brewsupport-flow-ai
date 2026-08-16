import { draftGroundedResponse } from "../supportFlow";
import type { SupportDecision, SupportTicket } from "../types";
import type { DraftProvider, GovernedDraftResult } from "./types";
import { validateProviderDraft } from "./validateDraft";

function deterministicFallback(
  ticket: SupportTicket,
  decision: SupportDecision,
  reason: string,
  provider?: DraftProvider,
): GovernedDraftResult {
  return {
    draft: draftGroundedResponse(ticket, decision.retrieved, decision.escalate),
    source: "deterministic-fallback",
    provider: provider?.name ?? "deterministic",
    model: provider?.model,
    groundedArticleIds: decision.retrieved.slice(0, 1).map((item) => item.article.id),
    rationale: "A deterministic grounded response was used because the AI drafting path was unavailable or invalid.",
    fallbackReason: reason,
    escalate: decision.escalate,
    escalationReasons: decision.escalationReasons,
    confidence: decision.confidence,
  };
}

export async function generateGovernedDraft(
  ticket: SupportTicket,
  decision: SupportDecision,
  provider?: DraftProvider,
): Promise<GovernedDraftResult> {
  if (!provider) return deterministicFallback(ticket, decision, "AI provider is not configured");
  if (decision.retrieved.length === 0) {
    return deterministicFallback(ticket, decision, "No retrieved knowledge is available for grounding", provider);
  }

  try {
    const raw = await provider.generateDraft({
      ticket,
      classification: decision.classification,
      retrieved: decision.retrieved,
      confidence: decision.confidence,
      requiresHumanReview: decision.escalate,
      escalationReasons: decision.escalationReasons,
    });

    const validated = validateProviderDraft(
      raw,
      decision.retrieved.map((item) => item.article.id),
    );

    return {
      draft: validated.customerReply,
      source: "ai",
      provider: provider.name,
      model: provider.model,
      groundedArticleIds: validated.groundedArticleIds,
      rationale: validated.rationale,
      escalate: decision.escalate,
      escalationReasons: decision.escalationReasons,
      confidence: decision.confidence,
    };
  } catch {
    return deterministicFallback(ticket, decision, "AI provider failed validation or execution", provider);
  }
}
