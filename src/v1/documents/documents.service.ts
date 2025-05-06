// src/v1/documents/documents.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface FileMeta {
  id: string;
  url: string;
  originalName: string;
}

export interface Folder {
  id: string;
  name: string;
  files: FileMeta[];
}

@Injectable()
export class DocumentsService {
  private folders: Folder[] = [];

  findAll(): Folder[] {
    return this.folders;
  }

  createFolder(name: string): Folder {
    const folder: Folder = { id: uuidv4(), name, files: [] };
    this.folders.push(folder);
    return folder;
  }

  renameFolder(id: string, name: string): Folder {
    const folder = this.folders.find(f => f.id === id);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    folder.name = name;
    return folder;
  }

  deleteFolder(id: string): { success: boolean } {
    const index = this.folders.findIndex(f => f.id === id);
    if (index === -1) {
      throw new NotFoundException('Folder not found');
    }
    this.folders.splice(index, 1);
    return { success: true };
  }

  uploadFiles(
    id: string,
    files: { url: string; originalName: string }[],
  ): FileMeta[] {
    const folder = this.folders.find(f => f.id === id);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    const newFiles: FileMeta[] = files.map(file => ({
      id: uuidv4(),
      url: file.url,
      originalName: file.originalName,
    }));
    folder.files.push(...newFiles);
    return folder.files;
  }

  deleteFile(id: string, fileId: string): { success: boolean } {
    const folder = this.folders.find(f => f.id === id);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    const index = folder.files.findIndex(file => file.id === fileId);
    if (index === -1) {
      throw new NotFoundException('File not found');
    }
    folder.files.splice(index, 1);
    return { success: true };
  }
}
