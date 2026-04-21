import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import { UploadProjectFileParam } from '../schemas/upload-project-file/param.schema';
import { uploadProjectFileResponseSchema } from '../schemas/upload-project-file/response.schema';

export const uploadProjectFileApi = async (data: UploadProjectFileParam) => {
  const formData = new FormData();
  // Ensure we append the actual File object from the FileList
  if (data.file && data.file.length > 0) {
    formData.append('file', data.file[0]);
  }

  return await authenticatedTypedFetch({
    url: `project/project-file/${data.id}`,
    method: 'POST',
    body: formData,
    schema: uploadProjectFileResponseSchema,
  });
};
