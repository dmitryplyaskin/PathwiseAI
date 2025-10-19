# Интеграция алгоритма SM-2 для интервального повторения

## Обзор

Данный документ описывает пошаговую интеграцию алгоритма интервального повторения SM-2 в проект PathwiseAI. Система будет автоматически рассчитывать интервалы повторения уроков на основе результатов тестирования.

## Текущее состояние

### ❌ Что отсутствует:

- Логика обновления статуса урока после тестирования
- Расчет интервалов повторения по алгоритму SM-2
- API для получения уроков для повторения
- Фронтенд-компоненты для отображения уроков для повторения
- Обновление данных урока на фронтенде после тестирования

### ✅ Что уже есть:

- Поля в базе данных: `status`, `last_reviewed_at`, `next_review_at`, `ease_factor`, `interval`
- Система тестирования с оценкой результатов
- Фронтенд-компоненты для отображения статуса урока

## Пошаговая интеграция

### 1. Backend: Обновление логики тестирования

#### 1.1 Создать сервис для SM-2 алгоритма

**Файл:** `src/modules/courses/services/sm2-spaced-repetition.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { LessonStatus } from '../entities/lesson.entity';

export interface SM2Result {
  status: LessonStatus;
  interval: number;
  easeFactor: number;
  nextReviewAt: Date;
}

@Injectable()
export class SM2SpacedRepetitionService {
  private readonly MIN_EASE_FACTOR = 1.3;
  private readonly INITIAL_EASE_FACTOR = 2.5;
  private readonly INITIAL_INTERVAL = 1;

  calculateNextReview(
    currentStatus: LessonStatus,
    currentInterval: number,
    currentEaseFactor: number,
    score: number, // 0-100
  ): SM2Result {
    const now = new Date();

    // Определяем качество ответа по баллу
    let quality: number;
    if (score >= 85) {
      quality = 5; // Отлично
    } else if (score >= 70) {
      quality = 4; // Хорошо
    } else if (score >= 50) {
      quality = 3; // Удовлетворительно
    } else if (score >= 30) {
      quality = 2; // Плохо
    } else {
      quality = 1; // Очень плохо
    }

    let newStatus: LessonStatus;
    let newInterval: number;
    let newEaseFactor: number;

    if (quality >= 3) {
      // Правильный ответ
      if (currentStatus === LessonStatus.NOT_STARTED) {
        newStatus = LessonStatus.LEARNING;
        newInterval = this.INITIAL_INTERVAL;
        newEaseFactor = this.INITIAL_EASE_FACTOR;
      } else if (currentStatus === LessonStatus.LEARNING) {
        newStatus = LessonStatus.MASTERED;
        newInterval = Math.round(currentInterval * currentEaseFactor);
        newEaseFactor = Math.max(
          this.MIN_EASE_FACTOR,
          currentEaseFactor +
            0.1 -
            (5 - quality) * (0.08 + (5 - quality) * 0.02),
        );
      } else {
        // MASTERED
        newStatus = LessonStatus.MASTERED;
        newInterval = Math.round(currentInterval * currentEaseFactor);
        newEaseFactor = Math.max(
          this.MIN_EASE_FACTOR,
          currentEaseFactor +
            0.1 -
            (5 - quality) * (0.08 + (5 - quality) * 0.02),
        );
      }
    } else {
      // Неправильный ответ
      newStatus = LessonStatus.LEARNING;
      newInterval = this.INITIAL_INTERVAL;
      newEaseFactor = Math.max(this.MIN_EASE_FACTOR, currentEaseFactor - 0.2);
    }

    const nextReviewAt = new Date(
      now.getTime() + newInterval * 24 * 60 * 60 * 1000,
    );

    return {
      status: newStatus,
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReviewAt,
    };
  }
}
```

#### 1.2 Обновить ExamsService

**Файл:** `src/modules/exams/services/exams.service.ts`

Добавить импорт и инжекцию сервиса:

```typescript
import { SM2SpacedRepetitionService } from '../../courses/services/sm2-spaced-repetition.service';

@Injectable()
export class ExamsService {
  constructor(
    // ... существующие зависимости
    private readonly sm2Service: SM2SpacedRepetitionService,
  ) {}
```

Обновить метод `submitTestResult`:

```typescript
async submitTestResult(submitTestResultDto: SubmitTestResultDto) {
  const { examId, answers, timeSpent } = submitTestResultDto;

  // ... существующий код до строки 323 ...

  // НОВОЕ: Обновляем прогресс урока
  await this.updateLessonProgress(exam, score);

  return {
    examId,
    score,
    correctAnswers,
    totalQuestions,
    timeSpent: parseInt(timeSpent),
    completedAt: exam.completed_at,
  };
}

private async updateLessonProgress(exam: Exam, score: number) {
  // Получаем урок из экзамена
  const lesson = await this.lessonRepository.findOne({
    where: { id: exam.lesson_id },
  });

  if (!lesson) {
    console.warn(`Lesson with ID ${exam.lesson_id} not found`);
    return;
  }

  // Рассчитываем новые параметры по SM-2
  const sm2Result = this.sm2Service.calculateNextReview(
    lesson.status,
    lesson.interval,
    lesson.ease_factor,
    score,
  );

  // Обновляем урок
  await this.lessonRepository.update(lesson.id, {
    status: sm2Result.status,
    interval: sm2Result.interval,
    ease_factor: sm2Result.easeFactor,
    last_reviewed_at: new Date(),
    next_review_at: sm2Result.nextReviewAt,
  });
}
```

#### 1.3 Добавить API для получения уроков для повторения

**Файл:** `src/modules/courses/services/lessons.service.ts`

Добавить метод:

```typescript
async findLessonsForReview(userId: string): Promise<Lesson[]> {
  const now = new Date();

  return this.lessonRepository.find({
    where: {
      user: { id: userId },
      next_review_at: LessThanOrEqual(now),
      status: In([LessonStatus.LEARNING, LessonStatus.MASTERED]),
    },
    relations: ['unit', 'unit.course'],
    order: {
      next_review_at: 'ASC',
    },
  });
}
```

**Файл:** `src/modules/courses/controllers/lessons.controller.ts`

Добавить endpoint:

```typescript
@Get('for-review/:userId')
async getLessonsForReview(@Param('userId') userId: string) {
  return this.lessonsService.findLessonsForReview(userId);
}
```

### 2. Frontend: API интеграция

#### 2.1 Обновить типы API

**Файл:** `frontend/src/shared/api/lessons/types.ts`

Добавить интерфейс для урока для повторения:

```typescript
export interface LessonForReview {
  id: string;
  title: string;
  description?: string;
  content: string;
  reading_time?: number;
  difficulty?: number;
  order: number;
  status: LessonStatus;
  last_reviewed_at?: string;
  next_review_at: string;
  ease_factor: number;
  interval: number;
  unit: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  created_at: string;
  updated_at: string;
}
```

#### 2.2 Добавить API методы

**Файл:** `frontend/src/shared/api/lessons/api.ts`

Добавить метод:

```typescript
export const lessonsApi = {
  // ... существующие методы

  getLessonsForReview: async (userId: string): Promise<LessonForReview[]> => {
    return apiClient.get<LessonForReview[]>(`/lessons/for-review/${userId}`);
  },
};
```

#### 2.3 Обновить состояние после тестирования

**Файл:** `frontend/src/widgets/test/ui/TestModal.tsx`

Обновить метод `finishTest`:

```typescript
const finishTest = async (finalAnswers?: QuestionAnswer[]) => {
  // ... существующий код до строки 175 ...

  try {
    await testsApi.submitTestResult({
      examId: testData.id,
      userId: userId ?? '',
      answers: answersToUse.map((answer) => ({
        questionId: answer.questionId,
        answer: answer.answer || '',
        isCorrect: answer.isCorrect,
        explanation: answer.llmExplanation,
      })),
      timeSpent: timeSpent.toString(),
    });

    console.log('Test results submitted successfully');

    // НОВОЕ: Обновляем данные урока
    if (testData.lessonId) {
      // Можно добавить callback для обновления родительского компонента
      // или использовать глобальное состояние
      window.dispatchEvent(
        new CustomEvent('lessonUpdated', {
          detail: { lessonId: testData.lessonId },
        }),
      );
    }
  } catch (error) {
    // ... существующий код обработки ошибок
  } finally {
    setIsSubmitting(false);
  }
};
```

### 3. Frontend: Компоненты для повторения

#### 3.1 Создать компонент списка уроков для повторения

**Файл:** `frontend/src/widgets/review-lessons/ui/ReviewLessonsList.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { AccessTime, PlayCircle, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { lessonsApi } from '@shared/api/lessons/api';
import type { LessonForReview } from '@shared/api/lessons/types';
import { useCurrentUser } from '@shared/hooks/useCurrentUser';

interface ReviewLessonsListProps {
  maxItems?: number;
}

export const ReviewLessonsList: React.FC<ReviewLessonsListProps> = ({
  maxItems = 6,
}) => {
  const [lessons, setLessons] = useState<LessonForReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const lessonsData = await lessonsApi.getLessonsForReview(userId);
        setLessons(lessonsData.slice(0, maxItems));
      } catch (err) {
        console.error('Failed to fetch review lessons:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Не удалось загрузить уроки для повторения',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [userId, maxItems]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 'Сегодня';
    } else if (diffDays === 1) {
      return 'Завтра';
    } else if (diffDays <= 7) {
      return `Через ${diffDays} дн.`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  const getPriorityColor = (daysOverdue: number): 'error' | 'warning' | 'info' => {
    if (daysOverdue > 3) return 'error';
    if (daysOverdue > 0) return 'warning';
    return 'info';
  };

  const getPriorityText = (daysOverdue: number): string => {
    if (daysOverdue > 3) return 'Критично';
    if (daysOverdue > 0) return 'Важно';
    return 'Планово';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (lessons.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="body1" color="text.secondary">
          Нет уроков для повторения
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {lessons.map((lesson) => {
        const nextReviewDate = new Date(lesson.next_review_at);
        const now = new Date();
        const daysOverdue = Math.floor(
          (now.getTime() - nextReviewDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        return (
          <Grid key={lesson.id} item xs={12} sm={6} lg={4}>
            <Card
              sx={{
                cursor: 'pointer',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() =>
                navigate(
                  `/courses/${lesson.unit.course.id}/lessons/${lesson.id}`,
                )
              }
            >
              <CardContent>
                <Stack spacing={2} height="100%">
                  <Typography variant="h6" component="h3" fontWeight={600}>
                    {lesson.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {lesson.unit.course.title} • {lesson.unit.title}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Следующее повторение: {formatDate(lesson.next_review_at)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Интервал: {lesson.interval} дн.
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt="auto"
                  >
                    <Chip
                      label={getPriorityText(daysOverdue)}
                      color={getPriorityColor(daysOverdue)}
                      size="small"
                    />

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlayCircle />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/courses/${lesson.unit.course.id}/lessons/${lesson.id}`,
                        );
                      }}
                    >
                      Повторить
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
```

#### 3.2 Обновить главную страницу

**Файл:** `frontend/src/pages/home/ui/HomePage.tsx`

Заменить статический блок "Требуют повторения" на динамический:

```typescript
import { ReviewLessonsList } from '@widgets/review-lessons/ui/ReviewLessonsList';

// В компоненте HomePage заменить:
{/* Модули для повторения */}
<Stack spacing={3}>
  <Box display="flex" alignItems="center" gap={1}>
    <AccessTime color="primary" />
    <Typography variant="h2">Требуют повторения</Typography>
  </Box>

  <ReviewLessonsList maxItems={6} />
</Stack>
```

#### 3.3 Создать страницу для повторения

**Файл:** `frontend/src/pages/review/ui/ReviewPage.tsx`

```typescript
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
import { ReviewLessonsList } from '@widgets/review-lessons/ui/ReviewLessonsList';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
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
            Эти уроки требуют повторения согласно алгоритму интервального повторения.
            Чем раньше вы их повторите, тем лучше закрепите знания.
          </Typography>

          <ReviewLessonsList />
        </Stack>
      </Container>
    </Box>
  );
};
```

### 4. Обновление навигации

#### 4.1 Добавить маршрут для страницы повторения

**Файл:** `frontend/src/app/App.tsx`

```typescript
import { ReviewPage } from '@pages/review/ui/ReviewPage';

// В роутере добавить:
<Route path="/review" element={<ReviewPage />} />
```

#### 4.2 Обновить навигационное меню

Добавить ссылку на страницу повторения в главное меню.

### 5. Тестирование

#### 5.1 Создать тесты для SM-2 сервиса

**Файл:** `src/modules/courses/services/sm2-spaced-repetition.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { SM2SpacedRepetitionService } from './sm2-spaced-repetition.service';
import { LessonStatus } from '../entities/lesson.entity';

describe('SM2SpacedRepetitionService', () => {
  let service: SM2SpacedRepetitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SM2SpacedRepetitionService],
    }).compile();

    service = module.get<SM2SpacedRepetitionService>(
      SM2SpacedRepetitionService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate correct intervals for good scores', () => {
    const result = service.calculateNextReview(
      LessonStatus.LEARNING,
      1,
      2.5,
      85, // Хороший балл
    );

    expect(result.status).toBe(LessonStatus.MASTERED);
    expect(result.interval).toBeGreaterThan(1);
    expect(result.easeFactor).toBeGreaterThan(2.5);
  });

  it('should reset interval for poor scores', () => {
    const result = service.calculateNextReview(
      LessonStatus.MASTERED,
      10,
      2.5,
      20, // Плохой балл
    );

    expect(result.status).toBe(LessonStatus.LEARNING);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBeLessThan(2.5);
  });
});
```

### 6. Документация

#### 6.1 Обновить документацию API

Добавить описание новых endpoints в документацию API.

#### 6.2 Создать пользовательскую документацию

**Файл:** `docs/USER_GUIDE_SPACED_REPETITION.md`

Описать для пользователей, как работает система интервального повторения.

## Проверка интеграции

### Чек-лист:

- [ ] SM-2 сервис создан и протестирован
- [ ] ExamsService обновлен для обновления прогресса урока
- [ ] API endpoint для получения уроков для повторения создан
- [ ] Frontend API методы добавлены
- [ ] Компонент ReviewLessonsList создан
- [ ] Главная страница обновлена
- [ ] Страница повторения создана
- [ ] Навигация обновлена
- [ ] Тесты написаны
- [ ] Документация обновлена

### Тестирование функциональности:

1. Пройти тест по уроку с разными баллами
2. Проверить обновление статуса урока
3. Проверить расчет интервалов повторения
4. Проверить отображение уроков для повторения
5. Проверить работу системы повторения

## Возможные улучшения

1. **Адаптивные интервалы** - учет времени прохождения теста
2. **Уведомления** - напоминания о необходимости повторения
3. **Аналитика** - статистика эффективности повторений
4. **Настройки пользователя** - возможность изменить параметры SM-2
5. **Экспорт/импорт** - синхронизация с внешними системами

## Заключение

Данная интеграция обеспечит полноценную работу системы интервального повторения на основе алгоритма SM-2. Система будет автоматически рассчитывать оптимальные интервалы повторения уроков на основе результатов тестирования пользователей.
