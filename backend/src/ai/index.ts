import { ChatGoogle } from "@langchain/google";

import { env } from "@/env";

export const googleLlmModel = new ChatGoogle("gemini-3.1-flash-lite-preview", {
  apiKey: env.GOOGLE_API_KEY,
});
