import { z } from 'zod';
import type { ValidatedRequest } from 'express-zod-safe';

import { projectSettingUpdateSchema } from '@/db/models/project-settings.model';

export const updateProjectSettingParamSchema = z.object({
  id: z.uuid(),
});

export const updateProjectSettingSchema = projectSettingUpdateSchema.omit({
  id: true,
});

export type UpdateProjectSetting = z.infer<typeof updateProjectSettingSchema>;

export type UpdateProjectSettingsRequest = ValidatedRequest<{
  params: typeof updateProjectSettingParamSchema;
  body: typeof updateProjectSettingSchema;
}>;
