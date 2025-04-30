// src/documents/upload.handler.ts
import { extractPdfText } from './extract-pdf-text';
import { indexDocumentToStore } from '../../v1/rag/langchain/vectorstore.provider';
import { Express } from 'express';

export async function handleFileUpload(
  file: Express.Multer.File,
): Promise<string> {
  try {
    const text = await extractPdfText(file.buffer);
    await indexDocumentToStore(text);
    return 'Documento indexado com sucesso!';
  } catch (error) {
    console.error('Erro ao processar o upload do documento:', error);
    throw new Error('Falha ao indexar o documento');
  }
}
