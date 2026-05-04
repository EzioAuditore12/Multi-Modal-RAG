import { z } from 'zod';
import { projectSettingSchema } from '../project-settings.schema';

export const updateProjectSettingResponseSchema = projectSettingSchema;

export type UpdateProjectSettingResponse = z.infer<typeof updateProjectSettingResponseSchema>;
