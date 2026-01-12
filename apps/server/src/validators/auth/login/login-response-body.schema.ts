import { z } from "zod";

import { selectUserTableSchema } from "@/db/models/user.model";
import { tokensSchema } from "../token.schema";

export const loginResponseBodySchema = z.object({
  user: selectUserTableSchema,
  tokens: tokensSchema,
});

export type LoginResponseBody = z.infer<typeof loginResponseBodySchema>;
