import { useState, useEffect, useCallback } from 'react';
import { LessonApiService, type Message } from './lesson_api';
import type { Thread } from '../../../shared/api/lessons';

export const useLessonPage = (
  lessonId: string | undefined,
  lessonContent: string,
) => {
  // Состояние для веток и сообщений
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string>('main');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState<
    string | null
  >(null);

  // UI состояния
  const [threadMenuAnchor, setThreadMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
  const [messageMenuAnchor, setMessageMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  const loadThreads = useCallback(async () => {
    if (!lessonId) return;
    try {
      const loadedThreads = await LessonApiService.loadThreads(lessonId);
      setThreads(loadedThreads);
    } catch (error) {
      console.error('Failed to load threads:', error);
    }
  }, [lessonId]);

  const loadThreadMessages = useCallback(
    async (threadId: string) => {
      if (!lessonId) return;
      try {
        const convertedMessages = await LessonApiService.loadThreadMessages(
          lessonId,
          threadId,
        );
        setMessages(convertedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    },
    [lessonId],
  );

  // Загрузка веток при монтировании
  useEffect(() => {
    if (lessonId) {
      loadThreads();
    }
  }, [lessonId, loadThreads]);

  // Загрузка сообщений текущей ветки
  useEffect(() => {
    if (lessonId && currentThreadId) {
      loadThreadMessages(currentThreadId);
    }
  }, [lessonId, currentThreadId, loadThreadMessages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || !lessonId) return;

    const newUserMessage: Message = {
      id: `temp-${Date.now()}`,
      type: 'user',
      content: inputValue,
      threadId: currentThreadId,
    };
    const preloaderMessage: Message = {
      id: `preloader-${Date.now()}`,
      type: 'preloader',
      content: '',
      threadId: currentThreadId,
    };

    setMessages((prev: Message[]) => [
      ...prev,
      newUserMessage,
      preloaderMessage,
    ]);
    const questionText = inputValue;
    setInputValue('');
    setShowInput(false);
    setIsLoading(true);

    try {
      const response = await LessonApiService.askQuestion(
        lessonId,
        questionText,
        currentThreadId,
        lessonContent,
      );

      const botResponse: Message = {
        id: response.messageId,
        type: 'bot',
        content: response.answer,
        threadId: response.threadId,
      };

      setMessages((prev: Message[]) => {
        const withoutPreloader = prev.filter(
          (m: Message) => m.type !== 'preloader',
        );
        return [...withoutPreloader, botResponse];
      });

      // Обновить список веток
      await loadThreads();
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content:
          'Извините, произошла ошибка при обработке вашего вопроса. Пожалуйста, попробуйте еще раз.',
        threadId: currentThreadId,
      };
      setMessages((prev: Message[]) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewThread = () => {
    const newThreadId = `thread-${Date.now()}`;
    setCurrentThreadId(newThreadId);
    setMessages([]);
    setShowInput(true);
  };

  const handleSwitchThread = (threadId: string) => {
    setCurrentThreadId(threadId);
    setThreadMenuAnchor(null);
  };

  const handleDeleteThread = async () => {
    if (!lessonId || !threadToDelete) return;

    try {
      await LessonApiService.deleteThread(lessonId, threadToDelete);

      // Если удаляем текущую ветку, переключаемся на main
      if (threadToDelete === currentThreadId) {
        setCurrentThreadId('main');
      }

      await loadThreads();
      setDeleteDialogOpen(false);
      setThreadToDelete(null);
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };

  const handleRegenerateMessage = async () => {
    if (!lessonId || !selectedMessageId) return;

    setRegeneratingMessageId(selectedMessageId);
    setMessageMenuAnchor(null);

    try {
      const response = await LessonApiService.regenerateMessage(
        lessonId,
        selectedMessageId,
      );

      // Обновить сообщение в списке
      setMessages((prev: Message[]) =>
        prev.map((msg: Message) =>
          msg.id === selectedMessageId
            ? { ...msg, content: response.newMessage.content }
            : msg,
        ),
      );

      setSelectedMessageId(null);
    } catch (error) {
      console.error('Failed to regenerate message:', error);
    } finally {
      setRegeneratingMessageId(null);
    }
  };

  const openDeleteDialog = (threadId: string) => {
    setThreadToDelete(threadId);
    setDeleteDialogOpen(true);
    setThreadMenuAnchor(null);
  };

  return {
    // Состояние
    threads,
    currentThreadId,
    messages,
    showInput,
    inputValue,
    isLoading,
    regeneratingMessageId,
    threadMenuAnchor,
    deleteDialogOpen,
    threadToDelete,
    messageMenuAnchor,
    selectedMessageId,

    // Сеттеры
    setShowInput,
    setInputValue,
    setThreadMenuAnchor,
    setDeleteDialogOpen,
    setMessageMenuAnchor,
    setSelectedMessageId,

    // Обработчики
    handleSendMessage,
    handleCreateNewThread,
    handleSwitchThread,
    handleDeleteThread,
    handleRegenerateMessage,
    openDeleteDialog,
  };
};
