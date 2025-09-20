import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
        content: `This is a simulated response to: "${inputValue}"`,
      };
      setMessages((prev) => [...prev.slice(0, -1), botResponse]);
    }, 2000);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', gap: 3, p: 3, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg) => (
            <Paper
              key={msg.id}
              elevation={1}
              sx={{
                p: 2,
                bgcolor:
                  msg.type === 'user' ? 'primary.light' : 'background.paper',
              }}
            >
              {msg.type === 'preloader' ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : msg.type === 'bot' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              ) : (
                <Typography>{msg.content}</Typography>
              )}
            </Paper>
          ))}

          <Box sx={{ mt: 2 }}>
            {showInput ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask your question..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  Send
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={() => setShowInput(true)}>
                  Ask a question
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        <StickyInfoBlock />
      </Box>
    </Container>
  );
};
