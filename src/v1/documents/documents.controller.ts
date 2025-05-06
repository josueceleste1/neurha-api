// src/v1/documents/documents.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { handleFileUpload } from '../documents/upload.handler';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Post()
  createFolder(@Body('name') name: string) {
    if (!name) {
      throw new NotFoundException('Folder name is required');
    }
    return this.documentsService.createFolder(name);
  }

  @Patch(':id')
  renameFolder(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    if (!name) {
      throw new NotFoundException('Folder name is required');
    }
    return this.documentsService.renameFolder(id, name);
  }

  @Delete(':id')
  deleteFolder(@Param('id') id: string) {
    return this.documentsService.deleteFolder(id);
  }

  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new NotFoundException('No files provided');
    }
    const uploadedMeta = [] as { url: string; originalName: string }[];
    for (const file of files) {
      const { url } = await handleFileUpload(file);
      uploadedMeta.push({ url, originalName: file.originalname });
    }
    return this.documentsService.uploadFiles(id, uploadedMeta);
  }

  @Delete(':id/files/:fileId')
  deleteFile(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
  ) {
    return this.documentsService.deleteFile(id, fileId);
  }
}
