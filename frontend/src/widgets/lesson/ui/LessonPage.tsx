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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  QuestionAnswer,
  Send,
  AutoAwesome,
  Close,
  Info,
} from '@mui/icons-material';
import { MarkdownRenderer } from '../../../shared/ui';
import { mockLessonContent } from '../model/mock';
import { StickyInfoBlock } from './StickyInfoBlock';
import { useLesson } from '../../../shared/model/lessons';

interface Message {
  id: number;
  type: 'user' | 'bot' | 'preloader';
  content: string;
}

export const LessonPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lesson, loading, notFound } = useLesson(lessonId);

  // Определяем контент урока: реальный или мок
  const lessonContent = lesson?.content || mockLessonContent;
  const lessonTitle = lesson?.title || 'Введение в машинное обучение';

  const [messages, setMessages] = useState<Message[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Инициализируем сообщения при загрузке контента урока
  useEffect(() => {
    if (lessonContent) {
      setMessages([{ id: 1, type: 'bot', content: lessonContent }]);
    }
  }, [lessonContent]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
    };
    const preloaderMessage: Message = {
      id: Date.now() + 1,
      type: 'preloader',
      content: '',
    };

    setMessages((prev) => [...prev, newUserMessage, preloaderMessage]);
    const questionText = inputValue;
    setInputValue('');
    setShowInput(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 2,
        type: 'bot',
        content: `Это симулированный ответ на ваш вопрос: "${questionText}". PathwiseAI анализирует контекст урока и предоставляет персонализированные объяснения.`,
      };
      setMessages((prev) => [...prev.slice(0, -1), botResponse]);
    }, 2000);
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
            <Stack spacing={3}>
              {messages.map((msg, index) => (
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
                            gap: 1,
                            mb: 2,
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
                            Материал урока
                          </Typography>
                        </Box>
                        <MarkdownRenderer
                          showLineNumbers={true}
                          maxCodeHeight="500px"
                        >
                          {msg.content}
                        </MarkdownRenderer>
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
                            disabled={!inputValue.trim()}
                            startIcon={<Send />}
                            sx={{
                              borderRadius: 2,
                              px: 3,
                            }}
                          >
                            Отправить
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
    </Box>
  );
};
