import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { createChannel, createSession } from 'better-sse';
import { authMiddleware } from '@/middlewares/auth.middleware';

export const testRouter: Router = express.Router();
export const testRegistry = new OpenAPIRegistry();

const uploadStatusChannel = createChannel({
  state: {
    message: '' as string,
  },
});

testRouter.get('/sse', authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.user.id as string;

  const session = await createSession(req, res);

  // Simulate a 5-step upload with 5-second intervals
  let step = 0;
  const totalSteps = 5;

  const interval = setInterval(() => {
    step++;
    const message = `Uploading... Step ${step} of ${totalSteps}`;
    session.push(message, 'message'); // Send directly to THIS user only

    if (step >= totalSteps) {
      clearInterval(interval);
      session.push('Upload complete!', 'message');
    }
  }, 5000);

  // CRITICAL: Stop the interval if the user closes the tab/disconnects early
  session.on('disconnected', () => {
    clearInterval(interval);
  });
});
