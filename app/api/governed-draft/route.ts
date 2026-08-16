import { NextResponse } from "next/server";
import { generateGovernedDraft } from "../../../src/ai/governedDraft";
import { OpenAiDraftProvider } from "../../../src/ai/openAiDraftProvider";
import { runHybridSupportFlowWithBilling } from "../../../src/billing/runBillingSupportFlow";
import { demoTickets, knowledgeBase } from "../../../src/demoData";
import { OpenAiEmbeddingProvider } from "../../../src/retrieval/openAiEmbeddingProvider";

export const runtime = "nodejs";

function resolveTimeoutMs(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? String(fallback));
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1000, Math.min(15000, Math.round(parsed)));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be an object" }, { status: 400 });
  }

  const ticketId = (body as Record<string, unknown>).ticketId;
  if (typeof ticketId !== "string") {
    return NextResponse.json({ error: "ticketId is required" }, { status: 400 });
  }

  // Public portfolio safety boundary: the route accepts only pre-defined synthetic fixtures.
  // It is intentionally not an unrestricted proxy for arbitrary user text, OpenAI usage, or billing actions.
  const ticket = demoTickets.find((item) => item.id === ticketId);
  if (!ticket) {
    return NextResponse.json({ error: "Unknown synthetic ticket" }, { status: 404 });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const embeddingProvider = apiKey
    ? new OpenAiEmbeddingProvider({
        apiKey,
        model: process.env.OPENAI_EMBEDDING_MODEL?.trim() || "text-embedding-3-small",
        timeoutMs: resolveTimeoutMs(process.env.AI_EMBEDDING_TIMEOUT_MS, 8000),
      })
    : undefined;

  const decision = await runHybridSupportFlowWithBilling(ticket, knowledgeBase, embeddingProvider);

  const draftProvider = apiKey
    ? new OpenAiDraftProvider({
        apiKey,
        model: process.env.OPENAI_MODEL?.trim() || "gpt-5.6",
        timeoutMs: resolveTimeoutMs(process.env.AI_DRAFT_TIMEOUT_MS, 8000),
      })
    : undefined;

  const governedDraft = await generateGovernedDraft(ticket, decision, draftProvider);

  return NextResponse.json(
    {
      ticketId: ticket.id,
      retrieval: decision.retrieval,
      retrieved: decision.retrieved.map((result) => ({
        articleId: result.article.id,
        title: result.article.title,
        score: result.score,
        lexicalScore: result.lexicalScore ?? null,
        semanticScore: result.semanticScore ?? null,
        strategy: result.strategy ?? "lexical",
      })),
      billing: decision.billing ?? null,
      ...governedDraft,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
