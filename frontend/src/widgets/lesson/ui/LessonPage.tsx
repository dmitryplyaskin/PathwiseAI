import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { QuestionAnswer, Send } from '@mui/icons-material';
import { MarkdownRenderer } from '../../../shared/ui';
import { mockLessonContent } from '../model/mock';
import { StickyInfoBlock } from './StickyInfoBlock';

interface Message {
  id: number;
  type: 'user' | 'bot' | 'preloader';
  content: string;
}

export const LessonPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'bot', content: mockLessonContent },
  ]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
    setInputValue('');
    setShowInput(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 2,
        type: 'bot',
        content: `Это симулированный ответ на ваш вопрос: "${inputValue}". PathwiseAI анализирует контекст урока и предоставляет персонализированные объяснения.`,
      };
      setMessages((prev) => [...prev.slice(0, -1), botResponse]);
    }, 2000);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Заголовок */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexDirection: 'column', py: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Введение в машинное обучение
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            maxWidth="600px"
          >
            Интерактивный урок с поддержкой ИИ-помощника для
            персонализированного обучения
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              {messages.map((msg) => (
                <Paper
                  key={msg.id}
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor:
                      msg.type === 'user' ? 'primary.50' : 'background.paper',
                    border: '1px solid',
                    borderColor:
                      msg.type === 'user' ? 'primary.200' : 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {msg.type === 'preloader' ? (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', py: 2 }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : msg.type === 'bot' ? (
                    <MarkdownRenderer
                      showLineNumbers={true}
                      maxCodeHeight="500px"
                    >
                      {msg.content}
                    </MarkdownRenderer>
                  ) : (
                    <Typography sx={{ fontWeight: 500 }}>
                      {msg.content}
                    </Typography>
                  )}
                </Paper>
              ))}

              <Box sx={{ mt: 3 }}>
                {showInput ? (
                  <Paper
                    elevation={0}
                    sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <QuestionAnswer fontSize="small" />
                        Задайте вопрос ИИ-помощнику
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Например: Объясни разницу между обучением с учителем и без учителя..."
                          multiline
                          maxRows={3}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim()}
                          startIcon={<Send />}
                          sx={{
                            minWidth: 100,
                            borderRadius: 2,
                          }}
                        >
                          Отправить
                        </Button>
                      </Box>
                    </Stack>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      onClick={() => setShowInput(true)}
                      startIcon={<QuestionAnswer />}
                      size="large"
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        fontWeight: 500,
                      }}
                    >
                      Задать вопрос ИИ-помощнику
                    </Button>
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
          <StickyInfoBlock />
        </Box>
      </Container>
    </Box>
  );
};
