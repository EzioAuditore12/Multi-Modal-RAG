import { AIMessage, type BaseMessage } from '@langchain/core/messages';
import {
  PromptTemplate,
  type PromptTemplateInput,
} from '@langchain/core/prompts';

interface StructurePromptOutputOptions {
  messages: BaseMessage[];
  promptTemplate: PromptTemplateInput;
  variables?: Record<string, any>;
}

export async function structurePromptOutput({
  messages,
  promptTemplate,
  variables,
}: StructurePromptOutputOptions): Promise<string> {
  const finalMessage = messages.find(
    (msg) => msg instanceof AIMessage && !msg.tool_calls?.length,
  );

  const responseTemplate = new PromptTemplate(promptTemplate);

  const formattedResponse = await responseTemplate.format({
    answer: finalMessage?.content ?? 'No result found.',
    ...variables,
  });

  return formattedResponse;
}
