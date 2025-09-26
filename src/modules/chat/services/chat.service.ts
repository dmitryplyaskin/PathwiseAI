import { Injectable, NotFoundException } from '@nestjs/common';
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

    // Получить ответ от AI
    const aiResponse =
      await this.openRouterService.generateResponse(openRouterMessages);

    // Сохранить ответ AI
    const aiMessage = this.chatMessageRepository.create({
      chatId: chat.id,
      role: MessageRole.ASSISTANT,
      content: aiResponse,
    });
    await this.chatMessageRepository.save(aiMessage);

    return {
      userMessage,
      aiMessage,
      chat,
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

  private async getChatHistory(chatId: string): Promise<ChatMessage[]> {
    return this.chatMessageRepository.find({
      where: { chatId },
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
      console.error('Stream error:', error);
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
