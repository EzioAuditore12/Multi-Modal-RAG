import { createChannel } from 'better-sse';

export const uploadStatus = createChannel({
  state: {
    message: '',
  },
});
