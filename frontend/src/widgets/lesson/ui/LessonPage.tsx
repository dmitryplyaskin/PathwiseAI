import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import {
  QuestionAnswer,
  Send,
  AutoAwesome,
  Close,
  Info,
  Delete,
  Refresh,
  ForkRight,
  MoreVert,
  ChatBubbleOutline,
  CheckCircle,
} from '@mui/icons-material';
import { MarkdownRenderer } from '../../../shared/ui';
import { mockLessonContent } from '../model/mock';
import { StickyInfoBlock } from './StickyInfoBlock';
import { useLesson } from '../../../shared/model/lessons';
import {
  lessonsApi,
  type Thread,
  type ThreadMessage,
} from '../../../shared/api/lessons';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'preloader';
  content: string;
  threadId: string;
}

export const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lesson, loading, notFound } = useLesson(lessonId);

  // Определяем контент урока: реальный или мок
  const lessonContent = lesson?.content || mockLessonContent;
  const lessonTitle = lesson?.title || 'Введение в машинное обучение';

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
      const loadedThreads = await lessonsApi.getThreads(lessonId);
      setThreads(loadedThreads);
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  }, [lessonId]);

  const loadThreadMessages = useCallback(
    async (threadId: string) => {
      if (!lessonId) return;
      try {
        const threadMessages = await lessonsApi.getThreadMessages(
          lessonId,
          threadId,
        );

        // Конвертируем сообщения из API в формат компонента
        const convertedMessages: Message[] = threadMessages.map(
          (msg: ThreadMessage) => ({
            id: msg.id,
            type: msg.role === 'user' ? 'user' : 'bot',
            content: msg.content,
            threadId: msg.threadId,
          }),
        );

        // Для основной ветки всегда показываем контент урока как первое сообщение
        if (threadId === 'main') {
          setMessages([
            {
              id: 'lesson-content',
              type: 'bot',
              content: lessonContent,
              threadId: 'main',
            },
            ...convertedMessages,
          ]);
        } else {
          setMessages(convertedMessages);
        }
      } catch (error) {
        console.error('Error loading thread messages:', error);
      }
    },
    [lessonId, lessonContent],
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
      const response = await lessonsApi.askQuestion(
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
      console.error('Error sending question:', error);
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
      await lessonsApi.deleteThread(lessonId, threadToDelete);

      // Если удаляем текущую ветку, переключаемся на main
      if (threadToDelete === currentThreadId) {
        setCurrentThreadId('main');
      }

      await loadThreads();
      setDeleteDialogOpen(false);
      setThreadToDelete(null);
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  const handleRegenerateMessage = async () => {
    if (!lessonId || !selectedMessageId) return;

    setRegeneratingMessageId(selectedMessageId);
    setMessageMenuAnchor(null);

    try {
      const response = await lessonsApi.regenerateMessage(
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
      console.error('Error regenerating message:', error);
    } finally {
      setRegeneratingMessageId(null);
    }
  };

  const openDeleteDialog = (threadId: string) => {
    setThreadToDelete(threadId);
    setDeleteDialogOpen(true);
    setThreadMenuAnchor(null);
  };

  // Показываем прелоадер при загрузке
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #f8fbff 0%, #eff6ff 50%, #dbeafe 100%)',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'primary.100',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h5" fontWeight={600} color="primary.main">
              Загрузка урока...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Подготавливаем материалы для изучения
            </Typography>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #f8fbff 0%, #eff6ff 50%, #dbeafe 100%)',
      }}
    >
      {/* Заголовок с градиентом */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          color: 'white',
          py: 6,
          px: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 20% 50%, rgba(96, 165, 250, 0.3) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" sx={{ position: 'relative' }}>
            {notFound && (
              <Fade in>
                <Chip
                  icon={<Info sx={{ color: 'white !important' }} />}
                  label="Демо-режим"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </Fade>
            )}
            <Typography
              variant="h1"
              component="h1"
              color="white"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              {lessonTitle}
            </Typography>
            <Typography
              variant="body1"
              color="white"
              sx={{
                textAlign: 'center',
                maxWidth: '700px',
                opacity: 0.95,
                fontSize: '1.1rem',
              }}
            >
              {lesson
                ? 'Интерактивный урок с поддержкой ИИ-помощника для персонализированного обучения'
                : 'Демо-версия урока · Данные отсутствуют в базе'}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            {/* Панель управления ветками */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: '2px solid',
                borderColor: 'primary.100',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ChatBubbleOutline sx={{ color: 'primary.main' }} />
                <Typography variant="body2" fontWeight={600}>
                  Текущая ветка:{' '}
                  <Chip
                    label={
                      currentThreadId === 'main'
                        ? 'Основная'
                        : `Ветка ${threads.findIndex((t) => t.threadId === currentThreadId) + 1}`
                    }
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Создать новую ветку">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ForkRight />}
                    onClick={handleCreateNewThread}
                    sx={{ borderRadius: 2 }}
                  >
                    Новая ветка
                  </Button>
                </Tooltip>
                {threads.length > 0 && (
                  <Tooltip title="Переключить ветку">
                    <Badge badgeContent={threads.length} color="primary">
                      <IconButton
                        size="small"
                        onClick={(e) => setThreadMenuAnchor(e.currentTarget)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Badge>
                  </Tooltip>
                )}
              </Box>
            </Paper>

            <Stack spacing={3}>
              {messages.map((msg: Message, index: number) => (
                <Fade in key={msg.id} timeout={300 + index * 100}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      bgcolor:
                        msg.type === 'user' ? 'primary.50' : 'background.paper',
                      border: '2px solid',
                      borderColor:
                        msg.type === 'user' ? 'primary.200' : 'divider',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        borderColor:
                          msg.type === 'user' ? 'primary.main' : 'primary.100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.12)',
                      },
                    }}
                  >
                    {msg.type === 'preloader' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 2,
                          py: 2,
                        }}
                      >
                        <CircularProgress size={24} thickness={4} />
                        <Typography variant="body2" color="text.secondary">
                          ИИ-помощник думает...
                        </Typography>
                      </Box>
                    ) : msg.type === 'bot' ? (
                      <>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <AutoAwesome
                              sx={{ color: 'primary.main', fontSize: 20 }}
                            />
                            <Typography
                              variant="caption"
                              fontWeight={600}
                              color="primary.main"
                              sx={{
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                              }}
                            >
                              {msg.id === 'lesson-content'
                                ? 'Материал урока'
                                : 'Ответ ИИ-помощника'}
                            </Typography>
                            {regeneratingMessageId === msg.id && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  ml: 2,
                                }}
                              >
                                <CircularProgress size={16} thickness={4} />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Перегенерация...
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          {msg.id !== 'lesson-content' && (
                            <Tooltip title="Действия">
                              <IconButton
                                size="small"
                                disabled={regeneratingMessageId === msg.id}
                                onClick={(e) => {
                                  setSelectedMessageId(msg.id);
                                  setMessageMenuAnchor(e.currentTarget);
                                }}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                        {regeneratingMessageId === msg.id ? (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              py: 4,
                              opacity: 0.6,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Генерируется новый ответ...
                            </Typography>
                          </Box>
                        ) : (
                          <MarkdownRenderer
                            showLineNumbers={true}
                            maxCodeHeight="500px"
                          >
                            {msg.content}
                          </MarkdownRenderer>
                        )}
                      </>
                    ) : (
                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={600}
                            color="primary.main"
                            sx={{
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                            }}
                          >
                            Ваш вопрос
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ fontWeight: 500, color: 'text.primary' }}
                        >
                          {msg.content}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Fade>
              ))}

              <Fade in timeout={500}>
                <Box sx={{ mt: 4 }}>
                  {showInput ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        border: '2px solid',
                        borderColor: 'primary.200',
                        borderRadius: 3,
                        background:
                          'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
                      }}
                    >
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <QuestionAnswer
                              sx={{ color: 'primary.main', fontSize: 20 }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="primary.main"
                            >
                              Задайте вопрос ИИ-помощнику
                            </Typography>
                          </Box>
                          <Tooltip title="Закрыть">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setShowInput(false);
                                setInputValue('');
                              }}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Например: Объясни разницу между обучением с учителем и без учителя..."
                          multiline
                          rows={3}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              bgcolor: 'background.paper',
                              '&:hover': {
                                '& fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                            },
                          }}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setShowInput(false);
                              setInputValue('');
                            }}
                            sx={{ borderRadius: 2 }}
                          >
                            Отмена
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            startIcon={<Send />}
                            sx={{
                              borderRadius: 2,
                              px: 3,
                            }}
                          >
                            {isLoading ? 'Отправка...' : 'Отправить'}
                          </Button>
                        </Box>
                      </Stack>
                    </Paper>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => setShowInput(true)}
                        startIcon={<QuestionAnswer />}
                        size="large"
                        sx={{
                          py: 2,
                          px: 4,
                          borderRadius: 3,
                          fontWeight: 600,
                          fontSize: '1rem',
                          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Задать вопрос ИИ-помощнику
                      </Button>
                    </Box>
                  )}
                </Box>
              </Fade>
            </Stack>
          </Box>
          <StickyInfoBlock lesson={lesson} notFound={notFound} />
        </Box>
      </Container>

      {/* Меню веток */}
      <Menu
        anchorEl={threadMenuAnchor}
        open={Boolean(threadMenuAnchor)}
        onClose={() => setThreadMenuAnchor(null)}
        PaperProps={{
          sx: { minWidth: 250, borderRadius: 2 },
        }}
      >
        <MenuItem disabled sx={{ opacity: '1 !important', fontWeight: 600 }}>
          Доступные ветки разговоров
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => handleSwitchThread('main')}
          selected={currentThreadId === 'main'}
        >
          <ListItemIcon>
            {currentThreadId === 'main' ? (
              <CheckCircle fontSize="small" color="primary" />
            ) : (
              <ChatBubbleOutline fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>Основная ветка</ListItemText>
        </MenuItem>
        {threads
          .filter((t: Thread) => t.threadId !== 'main')
          .map((thread: Thread, index: number) => (
            <MenuItem
              key={thread.threadId}
              onClick={() => handleSwitchThread(thread.threadId)}
              selected={currentThreadId === thread.threadId}
            >
              <ListItemIcon>
                {currentThreadId === thread.threadId ? (
                  <CheckCircle fontSize="small" color="primary" />
                ) : (
                  <ForkRight fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={`Ветка ${index + 1}`}
                secondary={`${thread.messageCount} сообщений`}
              />
              <Tooltip title="Удалить ветку">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(thread.threadId);
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'white',
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </MenuItem>
          ))}
      </Menu>

      {/* Меню действий с сообщением */}
      <Menu
        anchorEl={messageMenuAnchor}
        open={Boolean(messageMenuAnchor)}
        onClose={() => {
          setMessageMenuAnchor(null);
          setSelectedMessageId(null);
        }}
        PaperProps={{
          sx: { minWidth: 200, borderRadius: 2 },
        }}
      >
        <MenuItem
          onClick={handleRegenerateMessage}
          disabled={regeneratingMessageId !== null}
        >
          <ListItemIcon>
            <Refresh fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {regeneratingMessageId !== null
              ? 'Генерация...'
              : 'Перегенерировать ответ'}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, minWidth: 400 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Удалить ветку?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Вы уверены, что хотите удалить эту ветку разговора? Все сообщения в
            ней будут удалены без возможности восстановления.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleDeleteThread}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
