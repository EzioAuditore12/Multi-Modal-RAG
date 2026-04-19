import fs from 'node:fs';
import zlib from 'node:zlib';

import { HumanMessage } from 'langchain';

import {
  googleDocumentEmbeddingModel,
  googleLlmModel,
} from '@/ai/models/google.model';
import { db } from '@/db';

import { userService } from '../user.service';

import {
  ChunkingStrategy,
  Strategy,
  unstructuredClient,
} from '@/lib/unstructured';

type Chunk = {
  text: string;
  metadata?: {
    orig_elements?: any[];
  };
};

type ContentData = {
  text: string;
  tables: string[];
  images: string[];
  types: string[];
};

export class RagIngestionService {
  private readonly llmModel = googleLlmModel;
  private readonly documentEmbeddingModel = googleDocumentEmbeddingModel;

  private readonly unstructuredClient = unstructuredClient;

  private readonly database = db;

  private readonly userService = userService;

  public async processDocuments(filePath: string) {
    const chunks =
      await this.partitianDocumentAndSplitInChunksByTitle(filePath);
  }

  private async partitianDocumentAndSplitInChunksByTitle(filePath: string) {
    const data = fs.readFileSync(filePath);

    try {
      const response = await this.unstructuredClient.general.partition({
        partitionParameters: {
          files: {
            content: data,
            fileName: filePath,
          },
          strategy: Strategy.HiRes,
          extractImageBlockTypes: ['Image'],
          pdfInferTableStructure: true,
          includeOrigElements: true,
          chunkingStrategy: ChunkingStrategy.byTitle,
          maxCharacters: 3000,
          newAfterNChars: 2400,
          combineUnderNChars: 500,
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new Error('Unable to process');
    }
  }

  private async summarizeChunks(chunks: Chunk[]) {
    console.log('🧠 Processing chunks with AI Summaries...');

    const langchainDocuments: {
      page_content: string;
      metadata: { original_content: string };
    }[] = [];

    const totalChunks = chunks.length;

    for (let i = 0; i < totalChunks; i++) {
      const chunk = chunks[i];
      const currentChunk = i + 1;
      console.log(`   Processing chunk ${currentChunk}/${totalChunks}`);

      // Analyze chunk content
      const contentData = this.separateContentTypes(chunk);

      // Debug prints
      console.log(`     Types found: ${contentData.types}`);
      console.log(
        `     Tables: ${contentData.tables.length}, Images: ${contentData.images.length}`,
      );

      let enhancedContent: string;
      // Create AI-enhanced summary if chunk has tables/images
      if (contentData.tables.length > 0 || contentData.images.length > 0) {
        console.log(`     → Creating AI summary for mixed content...`);
        try {
          enhancedContent = (await this.createAiEnhancedSummary(
            contentData.text,
            contentData.tables,
            contentData.images,
          )) as string;
          console.log(`     → AI summary created successfully`);
          console.log(
            `     → Enhanced content preview: ${enhancedContent.slice(0, 200)}...`,
          );
        } catch (e) {
          console.log(`     ❌ AI summary failed: ${e}`);
          enhancedContent = contentData.text;
        }
      } else {
        console.log(`     → Using raw text (no tables/images)`);
        enhancedContent = contentData.text;
      }

      // Create LangChain Document with rich metadata
      langchainDocuments.push({
        page_content: enhancedContent,
        metadata: {
          original_content: JSON.stringify({
            raw_text: contentData.text,
            tables_html: contentData.tables,
            images_base64: contentData.images,
          }),
        },
      });
    }
  }

  private separateContentTypes(chunk: Chunk): ContentData {
    const contentData: ContentData = {
      text: chunk.text,
      tables: [],
      images: [],
      types: ['text'],
    };

    if (chunk.metadata?.orig_elements) {
      let origElements = chunk.metadata.orig_elements;

      // Handle base64-zlib encoded string
      if (typeof origElements === 'string') {
        const buffer = Buffer.from(origElements, 'base64');
        const decompressed = zlib.inflateSync(buffer).toString('utf-8');
        origElements = JSON.parse(decompressed);
      }

      for (const element of origElements) {
        const elementType = element?.type || element?.constructor?.name;

        if (elementType === 'Table') {
          contentData.types.push('table');
          const tableHtml = element?.metadata?.text_as_html || element.text;
          contentData.tables.push(tableHtml);
        } else if (elementType === 'Image') {
          if (element?.metadata?.image_base64) {
            contentData.types.push('image');
            contentData.images.push(element.metadata.image_base64);
          }
        }
      }
    }

    contentData.types = Array.from(new Set(contentData.types));

    return contentData;
  }

  private async createAiEnhancedSummary(
    text: string,
    tables: string[],
    images: string[],
  ) {
    let promptText = `You are creating a searchable description for document content retrieval.

        CONTENT TO ANALYZE:
        TEXT CONTENT:
        ${text}
        `;

    if (tables && tables.length > 0) {
      promptText += 'TABLES:\n';
      tables.forEach((table, i) => {
        promptText += `Table ${i + 1}:\n${table}\n\n`;
      });
    }

    promptText += `
    YOUR TASK:
    Generate a comprehensive, searchable description that covers:

        1. Key facts, numbers, and data points from text and tables
        2. Main topics and concepts discussed  
        3. Questions this content could answer
        4. Visual content analysis (charts, diagrams, patterns in images)
        5. Alternative search terms users might use

        Make it detailed and searchable - prioritize findability over brevity.

        SEARCHABLE DESCRIPTION:`;

    // Build message content for LLM
    const messageContent: any[] = [{ type: 'text', text: promptText }];

    for (const imageBase64 of images) {
      messageContent.push({
        type: 'image_url',
        image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
      });
    }

    try {
      const response = await this.llmModel.invoke([
        new HumanMessage({ content: messageContent }),
      ]);
      return response.content;
    } catch (e) {
      console.error(`     ❌ AI summary failed: ${e}`);
      // Fallback to simple summary
      let summary = text.slice(0, 300) + '...';
      if (tables.length) summary += ` [Contains ${tables.length} table(s)]`;
      if (images.length) summary += ` [Contains ${images.length} image(s)]`;
      return summary;
    }
  }
}

export const ragIngestionService = new RagIngestionService();
