import { z } from 'zod';

export const projectSettingSchema = z.object({
  id: z.uuid(),
  embeddingModel: z.string(),
  ragStrategy: z.enum(['basic', 'hybrid', 'multi-query-vector', 'multi-query-hybrid']),
  reRankingModel: z.string(),
  updatedAt: z.iso.datetime(),
});

export type ProjectSetting = z.infer<typeof projectSettingSchema>;
