import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack, AccessTime } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { ReviewLessonsList } from '@widgets/review-lessons';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => void navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime color="primary" />
            <Typography variant="h1" component="h1">
              Повторение уроков
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h2" color="text.primary">
            Уроки для повторения
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Эти уроки требуют повторения согласно алгоритму интервального
            повторения. Чем раньше вы их повторите, тем лучше закрепите знания.
          </Typography>

          <ReviewLessonsList />
        </Stack>
      </Container>
    </Box>
  );
};
