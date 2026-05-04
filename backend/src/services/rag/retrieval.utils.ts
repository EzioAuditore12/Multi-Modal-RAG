import { inArray } from 'drizzle-orm';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { z } from 'zod';

import { db } from '@/db';
import { googleLlmModel } from '@/ai/models/google.model';
import { projectFileTable } from '@/db/models/project-file.table';
import { projectService } from '@/services/project.service';

export type RetrievedChunk = {
  id: string;
  projectFileId: string;
  content: string;
  metaData: unknown;
  score: number;
  source: 'vector' | 'keyword' | 'hybrid';
};

export type RetrievedCitation = {
  chunkId: string;
  projectFileId: string;
  filename: string;
  page: string | number;
};

export type RetrievedContextBundle = {
  texts: string[];
  images: string[];
  tables: string[];
  citations: RetrievedCitation[];
};

export async function getProjectSettings(projectId: string) {
  const projectSettings = await projectService.getSettings(projectId);

  if (!projectSettings) {
    throw new Error('Project settings not found');
  }

  return projectSettings;
}

export async function getProjectDocumentIds(
  projectId: string,
): Promise<string[]> {
  const projectFile = await projectService.getProjectFileById(projectId);
  return projectFile ? [projectFile.id] : [];
}

function parseOriginalContent(metaData: unknown): {
  raw_text?: string;
  tables_html?: string[];
  images_base64?: string[];
} {
  if (!metaData || typeof metaData !== 'object') return {};

  const originalContent = (metaData as Record<string, unknown>)
    .original_content;

  if (typeof originalContent !== 'string') return {};

  try {
    return JSON.parse(originalContent) as {
      raw_text?: string;
      tables_html?: string[];
      images_base64?: string[];
    };
  } catch {
    return {};
  }
}

export async function buildContextFromRetrievedChunks(
  chunks: RetrievedChunk[],
): Promise<RetrievedContextBundle> {
  if (!chunks.length) {
    return { texts: [], images: [], tables: [], citations: [] };
  }

  const projectFileIds = [
    ...new Set(chunks.map((chunk) => chunk.projectFileId)),
  ];

  const projectFiles = projectFileIds.length
    ? await db
        .select({
          id: projectFileTable.id,
          fileName: projectFileTable.fileName,
        })
        .from(projectFileTable)
        .where(inArray(projectFileTable.id, projectFileIds))
    : [];

  const filenameMap = new Map(
    projectFiles.map((file) => [file.id, file.fileName ?? 'Unknown Document']),
  );

  const texts: string[] = [];
  const images: string[] = [];
  const tables: string[] = [];
  const citations: RetrievedCitation[] = [];

  for (const chunk of chunks) {
    const originalContent = parseOriginalContent(chunk.metaData);
    const metadata = chunk.metaData as Record<string, unknown> | undefined;
    const pageValue = metadata?.page_number ?? metadata?.page ?? 'Unknown';

    const chunkText = originalContent.raw_text ?? chunk.content;
    if (chunkText) texts.push(chunkText);

    images.push(...(originalContent.images_base64 ?? []));
    tables.push(...(originalContent.tables_html ?? []));

    citations.push({
      chunkId: chunk.id,
      projectFileId: chunk.projectFileId,
      filename: filenameMap.get(chunk.projectFileId) ?? 'Unknown Document',
      page:
        typeof pageValue === 'string' || typeof pageValue === 'number'
          ? pageValue
          : 'Unknown',
    });
  }

  return { texts, images, tables, citations };
}

const queryVariationsSchema = z.object({
  queries: z.array(z.string()).default([]),
});

export async function generateQueryVariations(
  originalQuery: string,
  numQueries = 3,
): Promise<string[]> {
  const systemPrompt = `Generate ${numQueries - 1} alternative ways to phrase this question for document search. Use different keywords and synonyms while maintaining the same intent. Return exactly ${numQueries - 1} variations.`;

  try {
    const structuredLlm = googleLlmModel.withStructuredOutput(
      queryVariationsSchema,
    );
    const result = await structuredLlm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Original query: ${originalQuery}`),
    ]);

    return [originalQuery, ...(result.queries ?? []).slice(0, numQueries - 1)];
  } catch {
    return [originalQuery];
  }
}

export function rrfRankAndFuse(
  searchResultsList: RetrievedChunk[][],
  weights?: number[],
  k = 60,
): RetrievedChunk[] {
  if (
    !searchResultsList.length ||
    !searchResultsList.some((results) => results.length)
  ) {
    return [];
  }

  const resolvedWeights =
    weights ??
    Array.from(
      { length: searchResultsList.length },
      () => 1 / searchResultsList.length,
    );

  const chunkScores = new Map<string, number>();
  const allChunks = new Map<string, RetrievedChunk>();

  for (const [searchIndex, results] of searchResultsList.entries()) {
    const weight = resolvedWeights[searchIndex] ?? 1;

    for (const [rank, chunk] of results.entries()) {
      const rrfScore = weight * (1 / (k + rank + 1));
      chunkScores.set(chunk.id, (chunkScores.get(chunk.id) ?? 0) + rrfScore);
      if (!allChunks.has(chunk.id)) {
        allChunks.set(chunk.id, chunk);
      }
    }
  }

  return [...chunkScores.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([chunkId]) => allChunks.get(chunkId))
    .filter((chunk): chunk is RetrievedChunk => Boolean(chunk));
}
