//@ts-ignore
import { ToolNode } from '@langchain/langgraph/prebuilt';
import {
  ConditionalEdgeRouter,
  type GraphNode,
  type MessagesAnnotation,
  MessagesValue,
  StateGraph,
  StateSchema,
} from '@langchain/langgraph';
import { SystemMessage, AIMessage } from '@langchain/core/messages';

import { googleLlmModel } from '@/ai/models/google.model';
import { tools } from '@/ai/tools';

function extractJsonFromMarkdown(text: string): string {
  const match = text.match(/```json\s*([\s\S]*?)```/i);
  return match ? match[1] : text;
}

export class AiService {
  private readonly googleLlmModel = googleLlmModel;
  private readonly googleLlmModelWithTools = googleLlmModel.bindTools(tools);
  private readonly state = new StateSchema({
    messages: MessagesValue,
  });

  async test() {
    return await this.googleLlmModel.invoke([
      [
        'system',
        'You are a helpful assistant that translates English to French. Translate the user sentence.',
      ],
      ['human', 'I love programming.'],
    ]);
  }

  public agentBuilder = () => {
    return new StateGraph(this.state)
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
    const result = await this.googleLlmModelWithTools.invoke([
      new SystemMessage({
        content:
          'You are a helpful assistant tasked with performing a arthimetic set of inputs',
      }),
      ...state.messages,
    ]);

    return {
      messages: [result],
    };
  };

  private toolNode = new ToolNode(tools);

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

export const aiService = new AiService();
