import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

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
    const prompt = await promptTemplate.invoke({
      context: contextString,
      question,
    });

    const resultSchema = z.object({
      answer: z.string().describe('Answer of the given context'),
    });

    const structuredModel = this.llmModel.withStructuredOutput(resultSchema);

    const response = await structuredModel.invoke(prompt);

    return response.answer;
  }
}

export const aiService = new AiService();
