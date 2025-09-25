import type { Lesson } from '@/widgets/lessons-list/model/mock';

export interface LessonGroup {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
  completedLessons: number;
  isExpanded: boolean;
}

export interface UnitDetail {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  lessonGroups: LessonGroup[];
}

const mockLessonsGroup1: Lesson[] = [
  {
    id: '1-1',
    title: 'Что такое машинное обучение?',
    description:
      'Введение в основные концепции и терминологию машинного обучения.',
    progress: 100,
    lastStudied: '2025-09-20',
    status: 'completed',
  },
  {
    id: '1-2',
    title: 'Типы машинного обучения',
    description: 'Обучение с учителем, без учителя и обучение с подкреплением.',
    progress: 100,
    lastStudied: '2025-09-20',
    status: 'completed',
  },
  {
    id: '1-3',
    title: 'Жизненный цикл ML-проекта',
    description:
      'Этапы разработки проекта машинного обучения от идеи до внедрения.',
    progress: 75,
    lastStudied: '2025-09-21',
    status: 'in_progress',
  },
];

const mockLessonsGroup2: Lesson[] = [
  {
    id: '2-1',
    title: 'Подготовка данных',
    description: 'Очистка, нормализация и предобработка данных для ML.',
    progress: 50,
    lastStudied: '2025-09-19',
    status: 'in_progress',
  },
  {
    id: '2-2',
    title: 'Разведочный анализ данных',
    description:
      'EDA: визуализация, статистический анализ и поиск закономерностей.',
    progress: 25,
    lastStudied: '2025-09-18',
    status: 'in_progress',
  },
  {
    id: '2-3',
    title: 'Feature Engineering',
    description: 'Создание и отбор признаков для улучшения качества модели.',
    progress: 0,
    lastStudied: 'Never',
    status: 'in_progress',
  },
];

const mockLessonsGroup3: Lesson[] = [
  {
    id: '3-1',
    title: 'Первая модель машинного обучения',
    description: 'Создание простой модели линейной регрессии с нуля.',
    progress: 0,
    lastStudied: 'Never',
    status: 'in_progress',
  },
  {
    id: '3-2',
    title: 'Оценка качества модели',
    description: 'Метрики качества и методы валидации моделей.',
    progress: 0,
    lastStudied: 'Never',
    status: 'in_progress',
  },
];

export const mockUnitDetail: UnitDetail = {
  id: '1',
  title: 'Основы машинного обучения',
  description:
    'Комплексное введение в машинное обучение. В этом модуле вы изучите основные концепции, типы алгоритмов, подготовку данных и создадите свою первую модель.',
  totalLessons: 8,
  completedLessons: 3,
  progress: 37,
  difficulty: 'beginner',
  estimatedTime: '4-6 часов',
  prerequisites: [
    'Базовые знания Python',
    'Основы математики',
    'Статистика (желательно)',
  ],
  lessonGroups: [
    {
      id: 'group-1',
      title: 'Введение в ML',
      description: 'Основные концепции и терминология машинного обучения',
      lessons: mockLessonsGroup1,
      progress: 92,
      completedLessons: 2,
      isExpanded: true,
    },
    {
      id: 'group-2',
      title: 'Работа с данными',
      description:
        'Подготовка, анализ и обработка данных для машинного обучения',
      lessons: mockLessonsGroup2,
      progress: 25,
      completedLessons: 0,
      isExpanded: false,
    },
    {
      id: 'group-3',
      title: 'Первые модели',
      description: 'Создание и оценка простых моделей машинного обучения',
      lessons: mockLessonsGroup3,
      progress: 0,
      completedLessons: 0,
      isExpanded: false,
    },
  ],
};
