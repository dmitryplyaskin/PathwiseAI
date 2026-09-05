export interface Unit {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessonsCount: number;
  completedLessons: number;
  lastStudied: string;
  status: 'completed' | 'in_progress' | 'not_started';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const mockUnits: Unit[] = [
  {
    id: '1',
    title: 'Основы машинного обучения',
    description:
      'Изучите фундаментальные концепции машинного обучения, типы алгоритмов и их применение.',
    progress: 100,
    lessonsCount: 8,
    completedLessons: 8,
    lastStudied: '2025-09-20',
    status: 'completed',
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'Обучение с учителем',
    description:
      'Глубокое погружение в алгоритмы обучения с учителем: регрессия, классификация и оценка моделей.',
    progress: 75,
    lessonsCount: 12,
    completedLessons: 9,
    lastStudied: '2025-09-21',
    status: 'in_progress',
    difficulty: 'intermediate',
  },
  {
    id: '3',
    title: 'Обучение без учителя',
    description:
      'Изучите кластеризацию, снижение размерности и другие методы обучения без учителя.',
    progress: 50,
    lessonsCount: 10,
    completedLessons: 5,
    lastStudied: '2025-09-19',
    status: 'in_progress',
    difficulty: 'intermediate',
  },
  {
    id: '4',
    title: 'Нейронные сети и глубокое обучение',
    description:
      'Погрузитесь в мир нейронных сетей, от перцептронов до сверточных и рекуррентных сетей.',
    progress: 25,
    lessonsCount: 15,
    completedLessons: 4,
    lastStudied: '2025-09-18',
    status: 'in_progress',
    difficulty: 'advanced',
  },
  {
    id: '5',
    title: 'Обработка естественного языка',
    description:
      'Изучите методы NLP: токенизация, эмбеддинги, трансформеры и языковые модели.',
    progress: 0,
    lessonsCount: 14,
    completedLessons: 0,
    lastStudied: 'Never',
    status: 'not_started',
    difficulty: 'advanced',
  },
  {
    id: '6',
    title: 'Компьютерное зрение',
    description:
      'Освойте обработку изображений, CNN, детекцию объектов и сегментацию.',
    progress: 0,
    lessonsCount: 16,
    completedLessons: 0,
    lastStudied: 'Never',
    status: 'not_started',
    difficulty: 'advanced',
  },
];
