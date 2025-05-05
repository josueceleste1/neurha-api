// src/v1/rag/langchain/rag-chain.ts
import { ChatOpenAI } from '@langchain/openai';
import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { getVectorStore } from './vectorstore.provider';

const retriever = getVectorStore().asRetriever();

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
      const docs = await retriever.getRelevantDocuments(input.question);
      return docs.map((d) => d.pageContent).join('\n');
    },
    question: (input: { question: string }) => input.question,
  },
  prompt,
  llm,
]);

export async function runRagChain(question: string): Promise<string> {
  const response = await chain.invoke({ question });
  return typeof response.content === 'string'
    ? response.content
    : JSON.stringify(response.content);
}
