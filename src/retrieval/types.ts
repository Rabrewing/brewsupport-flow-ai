export interface EmbeddingProvider {
  readonly name: string;
  readonly model: string;
  embed(inputs: string[]): Promise<number[][]>;
}

export interface HybridRetrievalOptions {
  limit?: number;
  lexicalWeight?: number;
  semanticWeight?: number;
  minimumScore?: number;
}
