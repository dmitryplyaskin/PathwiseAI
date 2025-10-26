import { Injectable, Inject, Logger } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import OpenAI from 'openai';
import openrouterConfig from '../../../config/openrouter.config';

@Injectable()
export class OpenRouterService {
  private readonly logger = new Logger(OpenRouterService.name);
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

  async generateResponse(
    messages: Array<{ role: string; content: string }>,
    options?: {
      temperature?: number;
      max_tokens?: number;
      response_format?: Record<string, unknown>;
    },
  ) {
    try {
      const completionParams = {
        model: this.config.model,
        messages:
          messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: options?.temperature ?? undefined,
        max_tokens: options?.max_tokens ?? undefined,
        ...(options?.response_format && {
          response_format: options.response_format,
        }),
      };

      const completion = await this.client.chat.completions.create(
        completionParams as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
      );

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        { err: errorObj, model: this.config.model },
        'OpenRouter API Error',
      );
      if (error instanceof Error) {
        throw new Error(
          `Не удалось получить ответ от AI модели: ${error.message}`,
        );
      }
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
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        { err: errorObj, model: this.config.model },
        'OpenRouter Stream API Error',
      );
      throw new Error('Не удалось создать поток ответа от AI модели');
    }
  }
}
