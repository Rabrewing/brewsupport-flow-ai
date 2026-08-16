import { NextResponse } from "next/server";
import { generateGovernedDraft } from "../../../src/ai/governedDraft";
import { OpenAiDraftProvider } from "../../../src/ai/openAiDraftProvider";
import { demoTickets, knowledgeBase } from "../../../src/demoData";
import { runSupportFlow } from "../../../src/supportFlow";

export const runtime = "nodejs";

function resolveTimeoutMs(): number {
  const parsed = Number(process.env.AI_DRAFT_TIMEOUT_MS ?? "8000");
  if (!Number.isFinite(parsed)) return 8000;
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
  // It is intentionally not an unrestricted proxy for arbitrary user text or OpenAI usage.
  const ticket = demoTickets.find((item) => item.id === ticketId);
  if (!ticket) {
    return NextResponse.json({ error: "Unknown synthetic ticket" }, { status: 404 });
  }

  const decision = runSupportFlow(ticket, knowledgeBase);
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const provider = apiKey
    ? new OpenAiDraftProvider({
        apiKey,
        model: process.env.OPENAI_MODEL?.trim() || "gpt-5.6",
        timeoutMs: resolveTimeoutMs(),
      })
    : undefined;

  const governedDraft = await generateGovernedDraft(ticket, decision, provider);

  return NextResponse.json(
    {
      ticketId: ticket.id,
      ...governedDraft,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
