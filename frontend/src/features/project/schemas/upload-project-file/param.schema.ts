import { z } from 'zod';

export const uploadProjectFileParamSchema = z.object({
  id: z.uuid(),
  file: z.instanceof(FileList).refine((file) => file?.length == 1, 'File is required.'),
});

export type UploadProjectFileParam = z.infer<typeof uploadProjectFileParamSchema>;
