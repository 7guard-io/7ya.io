export type RagDocument = {
  id: string;
  text: string;
  title?: string;
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
};

export type RagDocumentSummary = Omit<RagDocument, 'text'>;

export type RagChunkOptions = {
  maxChars?: number;
  overlapChars?: number;
};

export type RagChunk = {
  id: string;
  documentId: string;
  text: string;
  start: number;
  end: number;
  length: number;
  title?: string;
  sourceUrl?: string;
  metadata?: Record<string, unknown>;
};

export type RagPosting = {
  chunkId: string;
  frequency: number;
};

export type RagIndex = {
  version: '7ya-rag-index-v1';
  options: Required<RagChunkOptions>;
  documents: RagDocumentSummary[];
  chunks: RagChunk[];
  postings: Record<string, RagPosting[]>;
  documentFrequency: Record<string, number>;
  averageChunkLength: number;
};

export type RagSearchOptions = {
  limit?: number;
  minimumScore?: number;
};

export type RagCitation = {
  documentId: string;
  chunkId: string;
  title?: string;
  sourceUrl?: string;
  start: number;
  end: number;
};

export type RagSearchResult = {
  rank: number;
  score: number;
  text: string;
  citation: RagCitation;
  metadata?: Record<string, unknown>;
};
