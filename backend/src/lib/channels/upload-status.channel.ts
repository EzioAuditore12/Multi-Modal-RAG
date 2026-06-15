import { createChannel, Channel } from 'better-sse';

export const uploadChannels = new Map<string, Channel>();

export const getUploadChannel = (projectId: string) => {
  if (!uploadChannels.has(projectId)) {
    uploadChannels.set(projectId, createChannel());
  }
  return uploadChannels.get(projectId)!;
};
