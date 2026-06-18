import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { RedisChatMessageHistory } from '@langchain/redis';
import { z } from 'zod';
import { redisClient } from '@/lib/redis';

import {
  googleDocumentEmbeddingModel,
  googleLlmModel,
  googleQueryEmbeddingModel,
} from '@/ai/models/google.model';

export class AiService {
  private readonly llmModel = googleLlmModel;
  private readonly documentEmbeddingModel = googleDocumentEmbeddingModel;
  private readonly queryEmbeddingModel = googleQueryEmbeddingModel;

  public async generateTitle(text: string): Promise<string> {
    const promptTemplate = PromptTemplate.fromTemplate(
      'Create a good title from the given {text}',
    );

    const result = await promptTemplate.invoke({
      text,
    });

    const resultSchema = z.object({
      title: z.string().describe('title generated'),
    });

    const structuredModel = this.llmModel.withStructuredOutput(resultSchema);

    const response = await structuredModel.invoke(result);

    return response.title;
  }

  public async generateQueryEmbedding(query: string): Promise<number[]> {
    return await this.queryEmbeddingModel.embedQuery(query);
  }

  public async generateDocumentEmbedding(
    documents: string[],
  ): Promise<number[][]> {
    return await this.documentEmbeddingModel.embedDocuments(documents);
  }

  public async giveResponse(
    context: string | string[],
    question: string,
  ): Promise<string> {
    const promptTemplate = PromptTemplate.fromTemplate(
      Array.isArray(context)
        ? `Given the following context:\n{context}\n\nAnswer the question:\n{question}`
        : `Given the following context:\n{context}\n\nAnswer the question:\n{question}`,
    );

    const contextString = Array.isArray(context) ? context.join('\n') : context;
    const prompt = await promptTemplate.format({
      context: contextString,
      question,
    });

    const response = await this.llmModel.invoke(prompt);
    return typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);
  }

  public async *streamResponse(
    context: string | string[],
    question: string,
    chatId: string,
  ): AsyncGenerator<string, void, unknown> {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are a helpful assistant answering questions based on the provided context.\n\nContext:\n{context}'
      ],
      new MessagesPlaceholder('history'),
      ['human', '{question}']
    ]);

    const contextString = Array.isArray(context) ? context.join('\n') : context;

    const chain = promptTemplate.pipe(this.llmModel);

    const chatHistory = new RedisChatMessageHistory({
      sessionId: chatId,
      sessionTTL: 3600,
      client: redisClient,
    });

    const historyMessages = await chatHistory.getMessages();

    const stream = await chain.stream({
      context: contextString,
      question,
      history: historyMessages,
    });

    await chatHistory.addUserMessage(question);

    let aiFullResponse = '';

    for await (const chunk of stream) {
      if (typeof chunk.content === 'string') {
        aiFullResponse += chunk.content;
        yield chunk.content;
      }
    }

    await chatHistory.addAIMessage(aiFullResponse);
  }
}

export const aiService = new AiService();
