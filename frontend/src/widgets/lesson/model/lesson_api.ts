import {
  lessonsApi,
  type Thread,
  type ThreadMessage,
} from '@shared/api/lessons';

export interface Message {
  id: string;
  type: 'user' | 'bot' | 'preloader';
  content: string;
  threadId: string;
}

export class LessonApiService {
  /**
   * Загружает список веток урока
   */
  static async loadThreads(lessonId: string): Promise<Thread[]> {
    try {
      return await lessonsApi.getThreads(lessonId);
    } catch (error) {
      console.error('Error loading threads:', error);
      throw error;
    }
  }

  /**
   * Загружает сообщения конкретной ветки
   */
  static async loadThreadMessages(
    lessonId: string,
    threadId: string,
  ): Promise<Message[]> {
    try {
      const threadMessages = await lessonsApi.getThreadMessages(
        lessonId,
        threadId,
      );

      // Конвертируем сообщения из API в формат компонента
      return threadMessages.map((msg: ThreadMessage) => ({
        id: msg.id,
        type: msg.role === 'user' ? 'user' : 'bot',
        content: msg.content,
        threadId: msg.threadId,
      }));
    } catch (error) {
      console.error('Error loading thread messages:', error);
      throw error;
    }
  }

  /**
   * Отправляет вопрос ИИ-помощнику
   */
  static async askQuestion(
    lessonId: string,
    question: string,
    threadId: string,
    lessonContent: string,
  ): Promise<{ messageId: string; answer: string; threadId: string }> {
    try {
      return await lessonsApi.askQuestion(
        lessonId,
        question,
        threadId,
        lessonContent,
      );
    } catch (error) {
      console.error('Error sending question:', error);
      throw error;
    }
  }

  /**
   * Удаляет ветку
   */
  static async deleteThread(lessonId: string, threadId: string): Promise<void> {
    try {
      await lessonsApi.deleteThread(lessonId, threadId);
    } catch (error) {
      console.error('Error deleting thread:', error);
      throw error;
    }
  }

  /**
   * Перегенерирует сообщение
   */
  static async regenerateMessage(
    lessonId: string,
    messageId: string,
  ): Promise<{ newMessage: { content: string } }> {
    try {
      return await lessonsApi.regenerateMessage(lessonId, messageId);
    } catch (error) {
      console.error('Error regenerating message:', error);
      throw error;
    }
  }
}
