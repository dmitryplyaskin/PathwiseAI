import { Injectable, Inject } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import openrouterConfig from '../../../config/openrouter.config';

@Injectable()
export class OpenRouterService {
  private client: OpenAI;

  constructor(
    @Inject(openrouterConfig.KEY)
    private config: ConfigType<typeof openrouterConfig>,
  ) {
    this.client = new OpenAI({
      baseURL: this.config.baseUrl,
      apiKey: this.config.apiKey,
      defaultHeaders: {
        'HTTP-Referer': this.config.siteUrl,
        'X-Title': this.config.appName,
      },
    });
  }

  async generateResponse(messages: Array<{ role: string; content: string }>) {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model,
        messages:
          messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw new Error('Не удалось получить ответ от AI модели');
    }
  }

  async generateStreamResponse(
    messages: Array<{ role: string; content: string }>,
  ) {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.config.model,
        messages:
          messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

      return stream;
    } catch (error) {
      console.error('OpenRouter Stream API Error:', error);
      throw new Error('Не удалось создать поток ответа от AI модели');
    }
  }
}
