// src/v1/rag/langchain/rag-chain.ts
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

// Mock documents: em produção, carregue dinamicamente
const docs = [
  {
    id: '1',
    text: 'A política de férias garante 15 dias após 12 meses de trabalho.',
  },
  { id: '2', text: 'O vale-refeição é de R$35 por dia útil.' },
];

let vectorStore: MemoryVectorStore;

async function initializeVectorStore() {
  vectorStore = await MemoryVectorStore.fromTexts(
    docs.map((d) => d.text),
    docs.map((d) => ({ id: d.id })),
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  );
}

let retriever: Awaited<ReturnType<MemoryVectorStore['asRetriever']>>;

const llm = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = PromptTemplate.fromTemplate(`
Com base nos documentos abaixo, responda a pergunta de forma objetiva:

{context}

Pergunta:
{question}
`);

const chain = RunnableSequence.from([
  {
    context: async (input: { question: string }) => {
      const docs = await retriever!.getRelevantDocuments(input.question);
      return docs.map((d) => d.pageContent).join('\n');
    },
    question: (input: { question: string }) => input.question,
  },
  prompt,
  llm,
]);

export async function runRagChain(question: string): Promise<string> {
  await initializeVectorStore();
  retriever = vectorStore.asRetriever();
  const response = await chain.invoke({ question });
  return typeof response.content === 'string'
    ? response.content
    : JSON.stringify(response.content);
}
