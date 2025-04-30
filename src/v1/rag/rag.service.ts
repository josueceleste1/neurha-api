// src/v1/rag/rag.service.ts
import { Injectable } from '@nestjs/common';
import { runRagChain } from './langchain/rag-chain';

@Injectable()
export class RagService {
  async askWithContext(question: string): Promise<string> {
    return runRagChain(question);
  }
}
