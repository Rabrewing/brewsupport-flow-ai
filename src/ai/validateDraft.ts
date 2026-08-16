import type { ProviderDraft } from "./types";

const ALLOWED_KEYS = new Set(["customerReply", "groundedArticleIds", "rationale"]);

export function validateProviderDraft(raw: unknown, allowedArticleIds: string[]): ProviderDraft {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("AI draft must be an object");
  }

  const record = raw as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ALLOWED_KEYS.has(key)) throw new Error(`Unexpected AI draft field: ${key}`);
  }

  if (typeof record.customerReply !== "string") throw new Error("customerReply must be a string");
  const customerReply = record.customerReply.trim();
  if (customerReply.length < 1 || customerReply.length > 1600) {
    throw new Error("customerReply length is outside the allowed range");
  }

  if (!Array.isArray(record.groundedArticleIds) || record.groundedArticleIds.some((id) => typeof id !== "string")) {
    throw new Error("groundedArticleIds must be a string array");
  }

  const groundedArticleIds = [...new Set(record.groundedArticleIds as string[])];
  const allowed = new Set(allowedArticleIds);
  if (groundedArticleIds.length === 0) throw new Error("AI draft must cite at least one retrieved article");
  if (groundedArticleIds.some((id) => !allowed.has(id))) {
    throw new Error("AI draft cited knowledge that was not retrieved");
  }

  if (typeof record.rationale !== "string") throw new Error("rationale must be a string");
  const rationale = record.rationale.trim();
  if (rationale.length < 1 || rationale.length > 600) {
    throw new Error("rationale length is outside the allowed range");
  }

  return { customerReply, groundedArticleIds, rationale };
}
