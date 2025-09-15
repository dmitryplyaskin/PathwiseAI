import {
  Container,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  Box,
  Grid,
  Stack,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add, MenuBook, AccessTime } from '@mui/icons-material';
import { EducationCard } from './ui';

// Заглушки данных для демонстрации
const recentModules = [
  {
    id: 1,
    title: 'Основы JavaScript',
    description:
      'Изучение базовых концепций JavaScript: переменные, функции, циклы',
    progress: 85,
    lastStudied: '2 дня назад',
    status: 'completed',
  },
  {
    id: 2,
    title: 'React Hooks',
    description:
      'Глубокое погружение в хуки React: useState, useEffect, useContext',
    progress: 60,
    lastStudied: '5 дней назад',
    status: 'in-progress',
  },
  {
    id: 3,
    title: 'TypeScript Fundamentals',
    description: 'Основы TypeScript: типы, интерфейсы, дженерики',
    progress: 100,
    lastStudied: '1 неделя назад',
    status: 'completed',
  },
];

const reviewModules = [
  {
    id: 4,
    title: 'Алгоритмы сортировки',
    description:
      'Повторение основных алгоритмов сортировки и их временной сложности',
    dueDate: 'Сегодня',
    priority: 'high',
  },
  {
    id: 5,
    title: 'CSS Flexbox',
    description: 'Закрепление знаний о флексбокс-контейнерах и их свойствах',
    dueDate: 'Завтра',
    priority: 'medium',
  },
  {
    id: 6,
    title: 'Git команды',
    description: 'Повторение основных команд Git для работы с репозиторием',
    dueDate: 'Через 2 дня',
    priority: 'low',
  },
];

function App() {
  const handleNewModule = () => {
    console.log('Создание нового модуля');
  };

  const handleModuleClick = (moduleId: string) => {
    console.log('Клик по модуль:', moduleId);
  };

  const getPriorityColor = (
    priority: string,
  ): 'error' | 'warning' | 'info' | 'default' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Срочно';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Обычный';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Заголовок */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ flexDirection: 'column', py: 6 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            PathwiseAI
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Персональная система обучения с искусственным интеллектом
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Секция создания нового модуля */}
        <Box display="flex" justifyContent="center" mb={6}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleNewModule}
            sx={{ py: 2, px: 4 }}
          >
            Изучить новый модуль
          </Button>
        </Box>

        {/* Последние пройденные модули */}
        <Stack spacing={3} mb={6}>
          <Box display="flex" alignItems="center" gap={1}>
            <MenuBook color="primary" />
            <Typography variant="h2">Последние пройденные модули</Typography>
          </Box>

          <Grid container spacing={3}>
            {recentModules.map((module) => (
              <Grid key={module.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <EducationCard
                  // @ts-ignore
                  module={module}
                  handleModuleClick={handleModuleClick}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* Модули для повторения */}
        <Stack spacing={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTime color="primary" />
            <Typography variant="h2">Требуют повторения</Typography>
          </Box>

          <Grid container spacing={3}>
            {reviewModules.map((module) => (
              <Grid key={module.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  onClick={() => handleModuleClick(module.id.toString())}
                  sx={{ cursor: 'pointer', height: '100%' }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="h4" component="h3">
                        {module.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {module.description}
                      </Typography>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="caption" color="text.secondary">
                          {module.dueDate}
                        </Typography>

                        <Chip
                          label={getPriorityText(module.priority)}
                          color={getPriorityColor(module.priority)}
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
