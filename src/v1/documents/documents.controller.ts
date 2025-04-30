// src/documents/documents.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
/// <reference types="multer" />
import { handleFileUpload } from './upload.handler';

@Controller('documents')
export class DocumentsController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return handleFileUpload(file);
  }
}
