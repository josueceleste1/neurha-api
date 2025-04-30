// src/v1/rag/rag.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller({ path: 'rag', version: '1' })
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    return this.ragService.askWithContext(body.question);
  }
}
