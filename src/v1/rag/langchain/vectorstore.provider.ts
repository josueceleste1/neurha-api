// src/v1/rag/langchain/vectorstore.provider.ts
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';

const COLLECTION_NAME = 'neurha-documents';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

let vectorStore: Chroma | null = null;

export function getVectorStore(): Chroma {
  if (!vectorStore) {
    vectorStore = new Chroma(embeddings, {
      collectionName: COLLECTION_NAME,
      url: 'http://localhost:8000',
    });
  }
  return vectorStore;
}

export async function indexDocumentToStore(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.createDocuments([text]);

  const store = getVectorStore();
  await store.addDocuments(splitDocs);
}
