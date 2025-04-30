// src/v1/llm/llm.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service';

@Controller({ path: 'llm', version: '1' })
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    return this.llmService.askSimple(body.question);
  }
}
