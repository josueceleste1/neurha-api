// src/v1/rag/rag.module.ts
import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';

@Module({
  controllers: [RagController],
  providers: [RagService],
})
export class RagModule {}
