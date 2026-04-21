'use client';

import { useMutation } from '@tanstack/react-query';

import { uploadProjectFileApi } from '../api/upload-project-file.api';

export function useUploadProjectFile() {
  return useMutation({
    mutationFn: uploadProjectFileApi,
    onSuccess: (data) => {
      alert(`Project ${data.fileName} uploaded successfully`);
    },
    onError: (error) => {
      console.log(error);
      alert(error.message);
    },
  });
}
