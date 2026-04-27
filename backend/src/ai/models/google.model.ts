import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@dakshp1234/langchain-google-genai';
import { TaskType } from '@google/generative-ai';

import { env } from '@/env';

export const GOOGLE_LLM_MODEL_NAME = 'gemini-3-flash-preview';

export const GOOGLE_EMBEDDING_MODEL_NAME = 'gemini-embedding-001';
export const GOOGLE_EMBEDDING_OUTPUT_DIMENSIONALITY: number = 1536;

export const googleLlmModel = new ChatGoogleGenerativeAI(
  GOOGLE_LLM_MODEL_NAME,
  {
    apiKey: env.GOOGLE_API_KEY,
    temperature: 0.7,
    maxOutputTokens: 2000,
  },
);

export const googleQueryEmbeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: env.GOOGLE_API_KEY,
  model: GOOGLE_EMBEDDING_MODEL_NAME,
  taskType: TaskType.RETRIEVAL_QUERY,
  outputDimensionality: GOOGLE_EMBEDDING_OUTPUT_DIMENSIONALITY,
});

export const googleDocumentEmbeddingModel = new GoogleGenerativeAIEmbeddings({
  apiKey: env.GOOGLE_API_KEY,
  model: GOOGLE_EMBEDDING_MODEL_NAME,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  outputDimensionality: GOOGLE_EMBEDDING_OUTPUT_DIMENSIONALITY,
});
