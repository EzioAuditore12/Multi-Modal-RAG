import { googleLlmModel } from '@/ai/models/google.model';

export class RagRetreivalService {
  private readonly llmMode = googleLlmModel;

  public async retreiveContext() {}

  private async vectorSerach() {}

  private async keywordSearch() {}

  private async hybridSearch() {}

  private async multiQueryVectorSearch() {}

  private async multiQueryHybridSearch() {}
}

export const ragRetreivalService = new RagRetreivalService();
