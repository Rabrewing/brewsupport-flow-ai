import { retrieveKnowledge } from "../supportFlow";
import type {
  KnowledgeArticle,
  RetrievalMetadata,
  RetrievalResult,
  SupportTicket,
} from "../types";
import type { EmbeddingProvider, HybridRetrievalOptions } from "./types";

export interface HybridRetrievalResponse {
  results: RetrievalResult[];
  metadata: RetrievalMetadata;
}

const DEFAULT_OPTIONS: Required<HybridRetrievalOptions> = {
  limit: 3,
  lexicalWeight: 0.35,
  semanticWeight: 0.65,
  minimumScore: 0.12,
};

function articleText(article: KnowledgeArticle): string {
  return `${article.title}\n${article.body}\nTags: ${article.tags.join(", ")}`;
}

function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length === 0 || left.length !== right.length) {
    throw new Error("Embedding vectors must be non-empty and have matching dimensions");
  }

  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    const leftValue = left[index]!;
    const rightValue = right[index]!;
    if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) {
      throw new Error("Embedding vectors must contain only finite values");
    }
    dot += leftValue * rightValue;
    leftMagnitude += leftValue * leftValue;
    rightMagnitude += rightValue * rightValue;
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    throw new Error("Embedding vectors must have non-zero magnitude");
  }

  const cosine = dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
  return Number(Math.max(0, Math.min(1, cosine)).toFixed(3));
}

function clampWeight(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function resolveWeights(options: Required<HybridRetrievalOptions>): { lexicalWeight: number; semanticWeight: number } {
  const lexical = clampWeight(options.lexicalWeight);
  const semantic = clampWeight(options.semanticWeight);
  const total = lexical + semantic;
  if (total === 0) return { lexicalWeight: 0.35, semanticWeight: 0.65 };
  return {
    lexicalWeight: lexical / total,
    semanticWeight: semantic / total,
  };
}

function lexicalFallback(
  ticket: SupportTicket,
  articles: KnowledgeArticle[],
  limit: number,
  reason?: string,
): HybridRetrievalResponse {
  return {
    results: retrieveKnowledge(ticket, articles, limit),
    metadata: reason
      ? { mode: "lexical-fallback", fallbackReason: reason }
      : { mode: "lexical" },
  };
}

export async function retrieveKnowledgeHybrid(
  ticket: SupportTicket,
  articles: KnowledgeArticle[],
  provider?: EmbeddingProvider,
  partialOptions: HybridRetrievalOptions = {},
): Promise<HybridRetrievalResponse> {
  const options = { ...DEFAULT_OPTIONS, ...partialOptions };
  const limit = Math.max(1, Math.min(10, Math.round(options.limit)));

  if (!provider || articles.length === 0) {
    return lexicalFallback(ticket, articles, limit);
  }

  const lexical = retrieveKnowledge(ticket, articles, articles.length);
  const lexicalById = new Map(lexical.map((result) => [result.article.id, result.score]));
  const query = `${ticket.subject}\n${ticket.body}`;

  try {
    const vectors = await provider.embed([query, ...articles.map(articleText)]);
    if (vectors.length !== articles.length + 1) {
      throw new Error("Embedding response count did not match retrieval inputs");
    }

    const queryVector = vectors[0];
    if (!queryVector) throw new Error("Query embedding was not returned");
    const { lexicalWeight, semanticWeight } = resolveWeights(options);

    const results = articles
      .map((article, index): RetrievalResult => {
        const articleVector = vectors[index + 1];
        if (!articleVector) throw new Error(`Missing embedding for article ${article.id}`);

        const lexicalScore = lexicalById.get(article.id) ?? 0;
        const semanticScore = cosineSimilarity(queryVector, articleVector);
        const score = Number((lexicalScore * lexicalWeight + semanticScore * semanticWeight).toFixed(3));

        return {
          article,
          score,
          lexicalScore,
          semanticScore,
          strategy: lexicalScore > 0 ? "hybrid" : "semantic",
        };
      })
      .filter((result) => result.score >= options.minimumScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      results,
      metadata: {
        mode: "hybrid",
        provider: provider.name,
        model: provider.model,
      },
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Semantic retrieval failed";
    return lexicalFallback(ticket, articles, limit, reason);
  }
}
