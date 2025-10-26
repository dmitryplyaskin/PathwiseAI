import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Response } from 'express';
import { Chat } from '../entities/chat.entity';
import { ChatMessage, MessageRole } from '../entities/chat-message.entity';
import { CreateChatMessageDto } from '../dto/create-chat-message.dto';
import { GetChatMessagesDto } from '../dto/get-chat-messages.dto';
import { OpenRouterService } from './openrouter.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    private readonly openRouterService: OpenRouterService,
  ) {}

  async getOrCreateChat(lessonId: string): Promise<Chat> {
    let chat = await this.chatRepository.findOne({
      where: { lessonId },
      relations: ['messages'],
    });

    if (!chat) {
      chat = this.chatRepository.create({ lessonId });
      chat = await this.chatRepository.save(chat);
    }

    return chat;
  }

  async sendMessage(createChatMessageDto: CreateChatMessageDto) {
    const {
      lessonId,
      userId,
      content,
      threadId = 'main',
      lessonContent,
    } = createChatMessageDto;

    // Получить или создать чат для урока
    const chat = await this.getOrCreateChat(lessonId);

    // Сохранить сообщение пользователя
    const userMessage = this.chatMessageRepository.create({
      chatId: chat.id,
      userId,
      role: MessageRole.USER,
      content,
      threadId,
    });
    await this.chatMessageRepository.save(userMessage);

    // Получить историю сообщений для контекста (только текущая ветка)
    const messages = await this.getChatHistory(chat.id, threadId);

    // Подготовить системный промпт с контекстом урока
    const systemPrompt = lessonContent
      ? `Ты - AI-помощник в образовательной платформе PathwiseAI. Студент изучает урок и задает вопросы, чтобы лучше понять материал.

КОНТЕКСТ УРОКА:
${lessonContent}

Твоя задача:
- Отвечай на вопросы студента, основываясь на контексте урока
- Объясняй понятно и с примерами
- Помогай углубить понимание темы
- Если вопрос выходит за рамки урока, мягко верни к теме`
      : 'Ты - AI-помощник в образовательной платформе PathwiseAI. Помогай студентам понять материал урока, отвечай на их вопросы четко и понятно.';

    // Подготовить сообщения для OpenRouter
    const openRouterMessages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages.map((msg) => ({
        role: msg.role === MessageRole.ASSISTANT ? 'assistant' : 'user',
        content: msg.content,
      })),
    ];

    // Получить ответ от AI
    const aiResponse =
      await this.openRouterService.generateResponse(openRouterMessages);

    // Сохранить ответ AI
    const aiMessage = this.chatMessageRepository.create({
      chatId: chat.id,
      role: MessageRole.ASSISTANT,
      content: aiResponse,
      threadId,
    });
    await this.chatMessageRepository.save(aiMessage);

    return {
      userMessage,
      aiMessage,
      chat,
      threadId,
    };
  }

  async getChatMessages(getChatMessagesDto: GetChatMessagesDto) {
    const { lessonId } = getChatMessagesDto;

    const chat = await this.chatRepository.findOne({
      where: { lessonId },
      relations: ['messages'],
    });

    if (!chat) {
      return [];
    }

    return chat.messages.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }

  private async getChatHistory(
    chatId: string,
    threadId?: string,
  ): Promise<ChatMessage[]> {
    const where: { chatId: string; threadId?: string } = { chatId };
    if (threadId) {
      where.threadId = threadId;
    }
    return this.chatMessageRepository.find({
      where,
      order: { created_at: 'ASC' },
    });
  }

  async deleteChat(lessonId: string) {
    const chat = await this.chatRepository.findOne({ where: { lessonId } });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    await this.chatRepository.remove(chat);
    return { message: 'Чат успешно удален' };
  }

  async clearChatHistory(lessonId: string) {
    const chat = await this.chatRepository.findOne({ where: { lessonId } });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    await this.chatMessageRepository.delete({ chatId: chat.id });
    return { message: 'История чата очищена' };
  }

  async deleteThread(lessonId: string, threadId: string) {
    const chat = await this.chatRepository.findOne({ where: { lessonId } });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    await this.chatMessageRepository.delete({ chatId: chat.id, threadId });
    return { message: 'Ветка разговора удалена', threadId };
  }

  async regenerateMessage(
    lessonId: string,
    messageId: string,
    lessonContent?: string,
  ) {
    const chat = await this.chatRepository.findOne({ where: { lessonId } });

    if (!chat) {
      throw new NotFoundException('Чат не найден');
    }

    // Найти сообщение для регенерации
    const messageToRegenerate = await this.chatMessageRepository.findOne({
      where: { id: messageId, chatId: chat.id, role: MessageRole.ASSISTANT },
    });

    if (!messageToRegenerate) {
      throw new NotFoundException('Сообщение не найдено');
    }

    const threadId = messageToRegenerate.threadId;

    // Получить все сообщения до этого в ветке
    const allMessages = await this.getChatHistory(chat.id, threadId);
    const messageIndex = allMessages.findIndex((msg) => msg.id === messageId);
    const messagesBeforeRegeneration = allMessages.slice(0, messageIndex);

    // Подготовить системный промпт
    const systemPrompt = lessonContent
      ? `Ты - AI-помощник в образовательной платформе PathwiseAI. Студент изучает урок и задает вопросы, чтобы лучше понять материал.

КОНТЕКСТ УРОКА:
${lessonContent}

Твоя задача:
- Отвечай на вопросы студента, основываясь на контексте урока
- Объясняй понятно и с примерами
- Помогай углубить понимание темы
- Если вопрос выходит за рамки урока, мягко верни к теме`
      : 'Ты - AI-помощник в образовательной платформе PathwiseAI. Помогай студентам понять материал урока, отвечай на их вопросы четко и понятно.';

    const openRouterMessages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messagesBeforeRegeneration.map((msg) => ({
        role: msg.role === MessageRole.ASSISTANT ? 'assistant' : 'user',
        content: msg.content,
      })),
    ];

    // Получить новый ответ от AI
    const newResponse =
      await this.openRouterService.generateResponse(openRouterMessages);

    // Обновить сообщение
    messageToRegenerate.content = newResponse;
    await this.chatMessageRepository.save(messageToRegenerate);

    return {
      message: 'Ответ перегенерирован',
      newMessage: messageToRegenerate,
    };
  }

  async getThreads(lessonId: string) {
    const chat = await this.chatRepository.findOne({ where: { lessonId } });

    if (!chat) {
      return [];
    }

    // Получить все уникальные threadId
    const messages = await this.chatMessageRepository.find({
      where: { chatId: chat.id },
      order: { created_at: 'ASC' },
    });

    const threadsMap = new Map<
      string,
      {
        threadId: string;
        messageCount: number;
        firstMessage: string;
        createdAt: Date;
        lastActivity: Date;
      }
    >();

    messages.forEach((msg) => {
      if (!threadsMap.has(msg.threadId)) {
        threadsMap.set(msg.threadId, {
          threadId: msg.threadId,
          messageCount: 0,
          firstMessage: msg.content.substring(0, 50) + '...',
          createdAt: msg.created_at,
          lastActivity: msg.created_at,
        });
      }
      const thread = threadsMap.get(msg.threadId);
      if (thread) {
        thread.messageCount++;
        thread.lastActivity = msg.created_at;
      }
    });

    return Array.from(threadsMap.values()).sort(
      (a, b) =>
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime(),
    );
  }

  async getThreadMessages(lessonId: string, threadId: string) {
    const chat = await this.chatRepository.findOne({ where: { lessonId } });

    if (!chat) {
      return [];
    }

    return this.chatMessageRepository.find({
      where: { chatId: chat.id, threadId },
      order: { created_at: 'ASC' },
    });
  }

  async sendMessageStream(
    createChatMessageDto: CreateChatMessageDto,
    res: Response,
  ) {
    const { lessonId, userId, content } = createChatMessageDto;

    // Получить или создать чат для урока
    const chat = await this.getOrCreateChat(lessonId);

    // Сохранить сообщение пользователя
    const userMessage = this.chatMessageRepository.create({
      chatId: chat.id,
      userId,
      role: MessageRole.USER,
      content,
    });
    await this.chatMessageRepository.save(userMessage);

    // Получить историю сообщений для контекста
    const messages = await this.getChatHistory(chat.id);

    // Подготовить сообщения для OpenRouter
    const openRouterMessages = [
      {
        role: 'system',
        content:
          'Ты - AI-помощник в образовательной платформе PathwiseAI. Помогай студентам понять материал урока, отвечай на их вопросы четко и понятно. Если вопрос не связан с учебой, вежливо переведи разговор на образовательную тему.',
      },
      ...messages.map((msg) => ({
        role: msg.role === MessageRole.ASSISTANT ? 'assistant' : 'user',
        content: msg.content,
      })),
    ];

    // Настроить заголовки для SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    let fullResponse = '';

    try {
      // Получить стрим ответа от AI
      const stream =
        await this.openRouterService.generateStreamResponse(openRouterMessages);

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content, type: 'chunk' })}\n\n`);
        }
      }

      // Сохранить полный ответ AI
      const aiMessage = this.chatMessageRepository.create({
        chatId: chat.id,
        role: MessageRole.ASSISTANT,
        content: fullResponse,
      });
      await this.chatMessageRepository.save(aiMessage);

      // Отправить финальное сообщение
      res.write(
        `data: ${JSON.stringify({
          content: '',
          type: 'end',
          messageId: aiMessage.id,
        })}\n\n`,
      );
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      this.logger.error({ err: errorObj, lessonId, userId }, 'Stream error');
      res.write(
        `data: ${JSON.stringify({
          error: 'Произошла ошибка при получении ответа',
          type: 'error',
        })}\n\n`,
      );
    }

    res.end();
  }
}
