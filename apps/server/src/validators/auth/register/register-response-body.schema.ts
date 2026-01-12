import { z } from "zod";

import { selectUserTableSchema } from "@/db/models/user.model";
import { tokensSchema } from "../token.schema";

export const registerResponseBodySchema = z.object({
  user: selectUserTableSchema,
  tokens: tokensSchema,
});

export type RegisterResponseBody = z.infer<typeof registerResponseBodySchema>;
