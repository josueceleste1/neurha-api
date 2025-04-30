import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    // Pega a chave como possivelmente nula e depois refina para string
    const apiKeyNullable = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKeyNullable) {
      throw new Error('OPENAI_API_KEY não configurado.');
    }
    const apiKey: string = apiKeyNullable;

    this.openai = new OpenAI({ apiKey });
  }

  async askSimple(question: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: question }],
      });
      // Garante que o conteúdo não seja null
      const contentNullable = completion.choices[0].message.content;
      if (contentNullable === null) {
        throw new Error('Resposta da API veio vazia.');
      }
      const content: string = contentNullable;
      return content;
    } catch (err: any) {
      if (err?.status) {
        throw new Error(
          `OpenAI API retornou ${err.status}: ${JSON.stringify(err)}`,
        );
      }
      throw new Error(`Erro ao consultar LLM: ${err.message}`);
    }
  }
}
