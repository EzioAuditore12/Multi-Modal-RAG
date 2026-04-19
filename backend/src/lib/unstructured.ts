import { UnstructuredClient } from 'unstructured-client';

import { env } from '@/env';

enum Strategy {
  Fast = 'fast',
  HiRes = 'hi_res',
  Auto = 'auto',
  OcrOnly = 'ocr_only',
  OdOnly = 'od_only',
  Vlm = 'vlm',
}

enum ChunkingStrategy {
  basic = 'basic',
  byPage = 'by_page',
  bySimilarity = 'by_similarity',
  byTitle = 'by_title',
}

const unstructuredClient = new UnstructuredClient({
  serverURL: env.UNSTRUCTURED_API_ENDPOINT,
  security: {
    apiKeyAuth: env.UNSTRUCTURED_API_KEY,
  },
});

export { unstructuredClient, Strategy, ChunkingStrategy };
