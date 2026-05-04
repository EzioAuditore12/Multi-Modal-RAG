import { and, cosineDistance, desc, eq, sql } from 'drizzle-orm';
import { PromptTemplate } from '@langchain/core/prompts';

import { db } from '@/db';
import { googleLlmModel } from '@/ai/models/google.model';
import { aiService } from '@/services/ai.service';
import { projectService } from '@/services/project.service';
import { projectFileEmbeddingTable } from '@/db/models/project-file-embedding.model';
import type { RagStrategy } from '@/db/enums/rag-stratergy.enum';

type RetrievedContext = {
  id: string;
  content: string;
  metaData: unknown;
  score: number;
  source: 'vector' | 'keyword' | 'hybrid';
};

type RetrieveContextInput = {
  projectId: string;
  query: string;
  strategy?: RagStrategy;
  limit?: number;
};

export class RagRetreivalService {
  private readonly llmModel = googleLlmModel;

  public async retreiveContext({
    projectId,
    query,
    limit = 5,
  }: RetrieveContextInput): Promise<RetrievedContext[]> {
    const projectSettings = await projectService.getSettings(projectId);
    const activeStrategy = projectSettings.ragStrategy;

    switch (activeStrategy) {
      case 'hybrid':
        return await this.hybridSearch(projectId, query, limit);
      case 'multi-query-vector':
        return await this.multiQueryVectorSearch(projectId, query, limit);
      case 'multi-query-hybrid':
        return await this.multiQueryHybridSearch(projectId, query, limit);
      case 'basic':
      default:
        return await this.vectorSearch(projectId, query, limit);
    }
  }

  private async vectorSearch(
    projectId: string,
    query: string,
    limit: number,
  ): Promise<RetrievedContext[]> {
    const queryEmbedding = await aiService.generateQueryEmbedding(query);

    const similarity = sql<number>`1 - (${cosineDistance(projectFileEmbeddingTable.embedding, queryEmbedding)})`;

    const rows = await db
      .select({
        id: projectFileEmbeddingTable.id,
        content: projectFileEmbeddingTable.content,
        metaData: projectFileEmbeddingTable.metaData,
        score: similarity,
      })
      .from(projectFileEmbeddingTable)
      .where(eq(projectFileEmbeddingTable.projectFileId, projectId))
      .orderBy(desc(similarity))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id.toString(),
      content: row.content,
      metaData: row.metaData,
      score: Number(row.score ?? 0),
      source: 'vector' as const,
    }));
  }

  private async keywordSearch(
    projectId: string,
    query: string,
    limit: number,
  ): Promise<RetrievedContext[]> {
    const score = sql<number>`ts_rank_cd(
      to_tsvector('english', ${projectFileEmbeddingTable.content}),
      plainto_tsquery('english', ${query})
    )`;

    const rows = await db
      .select({
        id: projectFileEmbeddingTable.id,
        content: projectFileEmbeddingTable.content,
        metaData: projectFileEmbeddingTable.metaData,
        score,
      })
      .from(projectFileEmbeddingTable)
      .where(
        and(
          eq(projectFileEmbeddingTable.projectFileId, projectId),
          sql`to_tsvector('english', ${projectFileEmbeddingTable.content}) @@ plainto_tsquery('english', ${query})`,
        ),
      )
      .orderBy(desc(score))
      .limit(limit);

    return rows.map((row) => ({
      id: row.id.toString(),
      content: row.content,
      metaData: row.metaData,
      score: Number(row.score ?? 0),
      source: 'keyword' as const,
    }));
  }

  private async hybridSearch(
    projectId: string,
    query: string,
    limit: number,
  ): Promise<RetrievedContext[]> {
    const [vectorResults, keywordResults] = await Promise.all([
      this.vectorSearch(projectId, query, limit),
      this.keywordSearch(projectId, query, limit),
    ]);

    return this.mergeResults(vectorResults, keywordResults, limit, 'hybrid');
  }

  private async multiQueryVectorSearch(
    projectId: string,
    query: string,
    limit: number,
  ): Promise<RetrievedContext[]> {
    const expandedQueries = await this.generateQueryVariants(query);

    const results = await Promise.all(
      expandedQueries.map((expandedQuery) =>
        this.vectorSearch(projectId, expandedQuery, limit),
      ),
    );

    return this.mergeResults(results.flat(), [], limit, 'vector');
  }

  private async multiQueryHybridSearch(
    projectId: string,
    query: string,
    limit: number,
  ): Promise<RetrievedContext[]> {
    const expandedQueries = await this.generateQueryVariants(query);

    const [vectorSets, keywordSets] = await Promise.all([
      Promise.all(
        expandedQueries.map((expandedQuery) =>
          this.vectorSearch(projectId, expandedQuery, limit),
        ),
      ),
      Promise.all(
        expandedQueries.map((expandedQuery) =>
          this.keywordSearch(projectId, expandedQuery, limit),
        ),
      ),
    ]);

    return this.mergeResults(
      vectorSets.flat(),
      keywordSets.flat(),
      limit,
      'hybrid',
    );
  }

  private async generateQueryVariants(query: string): Promise<string[]> {
    const prompt = PromptTemplate.fromTemplate(
      `Generate 3 short search queries that mean the same thing as the user question.\nQuestion: {query}\nReturn only one query per line.`,
    );

    const formattedPrompt = await prompt.format({ query });
    const response = await this.llmModel.invoke(formattedPrompt);
    const content =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    return [
      query,
      ...content
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    ]
      .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 4);
  }

  private mergeResults(
    vectorResults: RetrievedContext[],
    keywordResults: RetrievedContext[],
    limit: number,
    source: RetrievedContext['source'],
  ): RetrievedContext[] {
    const merged = new Map<string, RetrievedContext>();

    for (const result of [...vectorResults, ...keywordResults]) {
      const existing = merged.get(result.id);

      if (!existing || result.score > existing.score) {
        merged.set(result.id, { ...result, source });
      }
    }

    return [...merged.values()]
      .sort((left, right) => right.score - left.score)
      .slice(0, limit);
  }
}

export const ragRetreivalService = new RagRetreivalService();
