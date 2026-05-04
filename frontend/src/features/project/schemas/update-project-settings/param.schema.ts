import { z } from 'zod';
import { projectSettingSchema } from '../project-settings.schema';

export const updateProjectSettingsParamSchema = projectSettingSchema
  .omit({ updatedAt: true })
  .partial({ ragStrategy: true, embeddingModel: true, reRankingModel: true });

export type UpdateProjectSettingsParamSchema = z.infer<typeof updateProjectSettingsParamSchema>;
