// src/documents/upload.handler.ts
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { extractPdfText as extractPdfTextFromBuffer } from './extract-pdf-text';
import { indexDocumentToStore } from '../../v1/rag/langchain/vectorstore.provider';
import { v4 as uuidv4 } from 'uuid';

/**
 * Saves the uploaded file, extracts text, indexes it, and
 * returns the public URL for the stored document.
 */
export async function handleFileUpload(
  file: Express.Multer.File,
): Promise<{ url: string }> {
  const ext = extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const uploadDir = join(process.cwd(), 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  const filepath = join(uploadDir, filename);
  await fs.writeFile(filepath, file.buffer);

  // use imported function only
  const text = await extractPdfTextFromBuffer(file.buffer);
  await indexDocumentToStore(text);

  return { url: `/uploads/${filename}` };
}
