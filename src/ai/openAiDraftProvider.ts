import type { DraftContext, DraftProvider } from "./types";

interface OpenAiDraftProviderOptions {
  apiKey: string;
  model?: string;
  timeoutMs?: number;
}

interface OpenAiResponsePayload {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
}

const DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    customerReply: { type: "string" },
    groundedArticleIds: {
      type: "array",
      items: { type: "string" },
    },
    rationale: { type: "string" },
  },
  required: ["customerReply", "groundedArticleIds", "rationale"],
} as const;

function extractOutputText(payload: OpenAiResponsePayload): string | undefined {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) return payload.output_text;

  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === "string" && content.text.trim()) return content.text;
    }
  }

  return undefined;
}

export class OpenAiDraftProvider implements DraftProvider {
  readonly name = "openai";
  readonly model: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(options: OpenAiDraftProviderOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? "gpt-5.6";
    this.timeoutMs = options.timeoutMs ?? 8000;
  }

  async generateDraft(context: DraftContext): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const knowledge = context.retrieved.map(({ article, score }) => ({
      id: article.id,
      title: article.title,
      body: article.body,
      retrievalScore: score,
    }));

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          store: false,
          max_output_tokens: 500,
          instructions:
            "You draft concise SaaS customer-support replies. Use only the supplied retrieved knowledge as factual grounding. Never claim that a refund, account change, security fix, entitlement change, charge reversal, or other consequential action has already occurred unless the supplied knowledge explicitly proves it. Do not make policy decisions. If human review is required, acknowledge the issue and explain that specialist review is required. Cite only retrieved article IDs in groundedArticleIds. Return only the requested structured output.",
          input: JSON.stringify({
            ticket: {
              id: context.ticket.id,
              subject: context.ticket.subject,
              body: context.ticket.body,
              customerPlan: context.ticket.customerPlan ?? null,
            },
            classification: context.classification,
            confidence: context.confidence,
            requiresHumanReview: context.requiresHumanReview,
            escalationReasons: context.escalationReasons,
            retrievedKnowledge: knowledge,
          }),
          text: {
            format: {
              type: "json_schema",
              name: "brewsupport_grounded_draft",
              description: "A grounded support reply with traceable knowledge citations.",
              strict: true,
              schema: DRAFT_SCHEMA,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI Responses API returned HTTP ${response.status}`);
      }

      const payload = (await response.json()) as OpenAiResponsePayload;
      const outputText = extractOutputText(payload);
      if (!outputText) throw new Error("OpenAI response did not contain output text");

      return JSON.parse(outputText) as unknown;
    } finally {
      clearTimeout(timeout);
    }
  }
}
