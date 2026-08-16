import type { EmbeddingProvider } from "./types";

interface OpenAiEmbeddingProviderOptions {
  apiKey: string;
  model?: string;
  timeoutMs?: number;
}

interface OpenAiEmbeddingPayload {
  data?: Array<{
    index?: number;
    embedding?: number[];
  }>;
}

function assertVector(vector: unknown, label: string): number[] {
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error(`${label} embedding is missing or empty`);
  }

  if (!vector.every((value) => typeof value === "number" && Number.isFinite(value))) {
    throw new Error(`${label} embedding contains non-finite values`);
  }

  return vector;
}

export class OpenAiEmbeddingProvider implements EmbeddingProvider {
  readonly name = "openai";
  readonly model: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;

  constructor(options: OpenAiEmbeddingProviderOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? "text-embedding-3-small";
    this.timeoutMs = options.timeoutMs ?? 8000;
  }

  async embed(inputs: string[]): Promise<number[][]> {
    if (inputs.length === 0) return [];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          input: inputs,
          encoding_format: "float",
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI Embeddings API returned HTTP ${response.status}`);
      }

      const payload = (await response.json()) as OpenAiEmbeddingPayload;
      if (!Array.isArray(payload.data) || payload.data.length !== inputs.length) {
        throw new Error("OpenAI embedding response count did not match the request");
      }

      const ordered = [...payload.data].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      const vectors = ordered.map((item, index) => assertVector(item.embedding, `item ${index}`));
      const dimension = vectors[0]?.length ?? 0;

      if (!vectors.every((vector) => vector.length === dimension)) {
        throw new Error("OpenAI embeddings returned inconsistent vector dimensions");
      }

      return vectors;
    } finally {
      clearTimeout(timeout);
    }
  }
}
