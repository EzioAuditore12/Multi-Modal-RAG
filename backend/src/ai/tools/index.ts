import { tool } from "@langchain/core/tools";
import { z } from "zod";

const inputSchema = z.object({
  a: z.number().describe("first number"),
  b: z.number().describe("second number"),
});

type Input = z.infer<typeof inputSchema>;

const multiply = tool(
  ({ a, b }: Input) => {
    return a * b;
  },
  {
    name: "multiply",
    description: "Multiplies two numbers together",
    schema: inputSchema,
  },
);

const add = tool(
  ({ a, b }: Input) => {
    return a + b;
  },
  {
    name: "add",
    description: "Adds two numbers together",
    schema: inputSchema,
  },
);

const divide = tool(
  ({ a, b }: Input) => {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return a / b;
  },
  {
    name: "divide",
    description: "Divides the first number by the second number",
    schema: inputSchema,
  },
);

export const tools = [add, multiply, divide];
export const toolsByName = Object.fromEntries(
  tools.map((tool) => [tool.name, tool]),
);
