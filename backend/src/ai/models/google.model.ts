import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai';

import { env } from '@/env';

export const GOOGLE_LLM_MODEL_NAME = 'gemini-3.1-flash-lite-preview';

export const GOOGLE_EMBEDDING_MODEL_NAME = 'gemini-embedding-001';

export const googleLlmModel = new ChatGoogleGenerativeAI(
  GOOGLE_LLM_MODEL_NAME,
  {
    apiKey: env.GOOGLE_API_KEY,
    temperature: 0.7,
    maxOutputTokens: 2000,
  },
);

export const googleAiEmbedding = new GoogleGenerativeAIEmbeddings({
  model: GOOGLE_EMBEDDING_MODEL_NAME,
  apiKey: env.GOOGLE_API_KEY,
});
