export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  progress: number;
  unitsCount: number;
  completedUnits: number;
  totalLessons: number;
  completedLessons: number;
  lastStudied: string;
  status: 'completed' | 'in_progress' | 'not_started';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: 'machine_learning' | 'data_science' | 'programming' | 'mathematics';
  tags: string[];
  rating: number;
  studentsCount: number;
  instructor: string;
  thumbnail: string;
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Машинное обучение с нуля',
    description:
      'Комплексный курс по машинному обучению от основ до продвинутых техник. Изучите алгоритмы обучения с учителем и без, нейронные сети, обработку естественного языка и компьютерное зрение.',
    shortDescription: 'Полный курс ML от основ до нейросетей',
    progress: 45,
    unitsCount: 6,
    completedUnits: 2,
    totalLessons: 48,
    completedLessons: 22,
    lastStudied: '2025-09-21',
    status: 'in_progress',
    difficulty: 'beginner',
    estimatedTime: '40-50 часов',
    category: 'machine_learning',
    tags: ['Python', 'Scikit-learn', 'TensorFlow', 'Pandas'],
    rating: 4.8,
    studentsCount: 15420,
    instructor: 'Анна Петрова',
    thumbnail: '/courses/ml-basics.jpg',
  },
  {
    id: '2',
    title: 'Анализ данных с Python',
    description:
      'Изучите основы анализа данных с использованием Python. Работа с библиотеками Pandas, NumPy, Matplotlib, статистический анализ и визуализация данных.',
    shortDescription: 'Анализ данных с Pandas и NumPy',
    progress: 100,
    unitsCount: 4,
    completedUnits: 4,
    totalLessons: 32,
    completedLessons: 32,
    lastStudied: '2025-09-15',
    status: 'completed',
    difficulty: 'beginner',
    estimatedTime: '25-30 часов',
    category: 'data_science',
    tags: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    rating: 4.7,
    studentsCount: 12350,
    instructor: 'Михаил Иванов',
    thumbnail: '/courses/data-analysis.jpg',
  },
  {
    id: '3',
    title: 'Глубокое обучение и нейронные сети',
    description:
      'Продвинутый курс по глубокому обучению. CNN, RNN, LSTM, Transformers, GAN. Практические проекты по компьютерному зрению и NLP.',
    shortDescription: 'CNN, RNN, Transformers на практике',
    progress: 25,
    unitsCount: 8,
    completedUnits: 1,
    totalLessons: 64,
    completedLessons: 16,
    lastStudied: '2025-09-20',
    status: 'in_progress',
    difficulty: 'advanced',
    estimatedTime: '60-70 часов',
    category: 'machine_learning',
    tags: ['TensorFlow', 'PyTorch', 'Keras', 'Computer Vision'],
    rating: 4.9,
    studentsCount: 8950,
    instructor: 'Елена Смирнова',
    thumbnail: '/courses/deep-learning.jpg',
  },
  {
    id: '4',
    title: 'Python для начинающих',
    description:
      'Основы программирования на Python. Синтаксис, структуры данных, функции, ООП, работа с файлами, основы веб-разработки.',
    shortDescription: 'Изучите Python с нуля',
    progress: 80,
    unitsCount: 5,
    completedUnits: 4,
    totalLessons: 40,
    completedLessons: 32,
    lastStudied: '2025-09-19',
    status: 'in_progress',
    difficulty: 'beginner',
    estimatedTime: '30-35 часов',
    category: 'programming',
    tags: ['Python', 'ООП', 'Flask', 'Основы'],
    rating: 4.6,
    studentsCount: 25670,
    instructor: 'Дмитрий Козлов',
    thumbnail: '/courses/python-basics.jpg',
  },
  {
    id: '5',
    title: 'Статистика и теория вероятностей',
    description:
      'Математические основы для Data Science и ML. Описательная статистика, проверка гипотез, регрессионный анализ, байесовская статистика.',
    shortDescription: 'Математика для Data Science',
    progress: 0,
    unitsCount: 6,
    completedUnits: 0,
    totalLessons: 36,
    completedLessons: 0,
    lastStudied: 'Never',
    status: 'not_started',
    difficulty: 'intermediate',
    estimatedTime: '35-40 часов',
    category: 'mathematics',
    tags: ['Статистика', 'R', 'Python', 'Теория вероятностей'],
    rating: 4.5,
    studentsCount: 7890,
    instructor: 'Александр Волков',
    thumbnail: '/courses/statistics.jpg',
  },
  {
    id: '6',
    title: 'MLOps и развертывание моделей',
    description:
      'Изучите как развертывать ML модели в продакшене. Docker, Kubernetes, CI/CD, мониторинг моделей, A/B тестирование.',
    shortDescription: 'Развертывание ML в продакшене',
    progress: 0,
    unitsCount: 7,
    completedUnits: 0,
    totalLessons: 42,
    completedLessons: 0,
    lastStudied: 'Never',
    status: 'not_started',
    difficulty: 'advanced',
    estimatedTime: '45-50 часов',
    category: 'machine_learning',
    tags: ['Docker', 'Kubernetes', 'MLflow', 'FastAPI'],
    rating: 4.7,
    studentsCount: 5240,
    instructor: 'Игорь Петров',
    thumbnail: '/courses/mlops.jpg',
  },
];
