//@ts-ignore
import { ToolNode } from '@langchain/langgraph/prebuilt';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import {
  ConditionalEdgeRouter,
  GraphNode,
  MessagesAnnotation,
  MessagesValue,
  StateGraph,
  StateSchema,
} from '@langchain/langgraph';
import { z } from 'zod';
import { StructuredOutputParser } from '@langchain/core/output_parsers';

import { googleLlmModel } from '@/ai/models/google.model';
import { ArticleInput, articleTools } from '@/ai/tools/article';
import { ArticleGeneratorResponse } from '@/schemas/ai/article/article-generate-response.schema';

function extractJsonFromMarkdown(text: string): string {
  const match = text.match(/```json\s*([\s\S]*?)```/i);
  return match ? match[1] : text;
}

export class AiArticleService {
  private readonly googleLLmModelWithArticleTool =
    googleLlmModel.bindTools(articleTools);

  public async generateArticle(
    articleInput: ArticleInput,
  ): Promise<ArticleGeneratorResponse> {
    const { topic, length, style } = articleInput;

    const structuredOutputParser = StructuredOutputParser.fromZodSchema(
      z.object({
        topic: z.string().describe('the name of the topic'),
        content: z.string().describe('the content inside the article'),
      }),
    );

    // Get format instructions from the parser
    const formatInstructions = structuredOutputParser.getFormatInstructions();

    // Compose the prompt with format instructions
    const prompt = `Write an article about the following topic.
      Topic: ${topic}
      ${length ? `Length: ${length} words.` : ''}
      ${style ? `Style: ${style}.` : ''}
      ${formatInstructions}
      `;

    // Run the agentBuilder workflow
    const result = await this.agentBuilder().invoke({
      messages: [new HumanMessage({ content: prompt })],
    });

    const lastMessage = result.messages.at(-1);
    const content = lastMessage?.content;
    const articleText = typeof content === 'string' ? content : '';

    const jsonText = extractJsonFromMarkdown(articleText);
    return await structuredOutputParser.parse(jsonText);
  }

  private agentBuilder = () => {
    const state = new StateSchema({
      messages: MessagesValue,
    });

    return new StateGraph(state)
      .addNode('llmCall', this.llmCall)
      .addNode('toolNode', this.toolNode)
      .addEdge('__start__', 'llmCall')
      .addConditionalEdges('llmCall', this.shouldContinue, [
        'toolNode',
        '__end__',
      ])
      .addEdge('toolNode', 'llmCall')
      .compile();
  };

  private llmCall: GraphNode<typeof MessagesAnnotation.State> = async (
    state,
  ) => {
    const result = await this.googleLLmModelWithArticleTool.invoke([
      new SystemMessage({
        content:
          "You are a helpful assistant that generates well-written articles based on the user's topic, desired length, and style. Respond with a complete article when requested.",
      }),
      ...state.messages,
    ]);

    return {
      messages: [result],
    };
  };

  private toolNode = new ToolNode(articleTools);

  private shouldContinue: ConditionalEdgeRouter<
    typeof MessagesAnnotation.State
  > = (state) => {
    const messages = state.messages;
    const lastMessage = messages.at(-1);

    if (lastMessage instanceof AIMessage && lastMessage.tool_calls?.length) {
      return 'toolNode';
    }

    return '__end__';
  };
}

export const aiArticleService = new AiArticleService();
