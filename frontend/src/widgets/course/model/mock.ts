import type { Unit } from '@/widgets/units-list/model/mock';

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  progress: number;
  unitsCount: number;
  completedUnits: number;
  totalLessons: number;
  completedLessons: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: 'machine_learning' | 'data_science' | 'programming' | 'mathematics';
  tags: string[];
  rating: number;
  studentsCount: number;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
    rating: number;
    coursesCount: number;
    studentsCount: number;
  };
  prerequisites: string[];
  learningOutcomes: string[];
  syllabus: string[];
  units: Unit[];
  reviews: {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  lastStudied: string;
  status: 'completed' | 'in_progress' | 'not_started';
}

const mockCourseUnits: Unit[] = [
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

export const mockCourseDetail: CourseDetail = {
  id: '1',
  title: 'Машинное обучение с нуля',
  description:
    'Комплексный курс по машинному обучению от основ до продвинутых техник.',
  fullDescription: `
    Этот курс представляет собой полное введение в машинное обучение, охватывающее как теоретические основы, так и практическое применение. 
    
    Вы изучите различные типы алгоритмов машинного обучения, от простых линейных моделей до сложных нейронных сетей. Курс включает в себя практические проекты, которые помогут вам применить полученные знания на реальных данных.
    
    Особое внимание уделяется современным подходам в области глубокого обучения, обработки естественного языка и компьютерного зрения. Вы научитесь не только строить модели, но и правильно их оценивать, интерпретировать результаты и развертывать в продакшене.
  `,
  progress: 45,
  unitsCount: 6,
  completedUnits: 2,
  totalLessons: 73,
  completedLessons: 33,
  difficulty: 'beginner',
  estimatedTime: '40-50 часов',
  category: 'machine_learning',
  tags: [
    'Python',
    'Scikit-learn',
    'TensorFlow',
    'Pandas',
    'NumPy',
    'Matplotlib',
  ],
  rating: 4.8,
  studentsCount: 15420,
  instructor: {
    name: 'Анна Петрова',
    bio: 'Data Scientist с 8-летним опытом в области машинного обучения. Работала в ведущих технологических компаниях, автор более 50 научных публикаций. Специализируется на глубоком обучении и обработке естественного языка.',
    avatar: '/instructors/anna-petrova.jpg',
    rating: 4.9,
    coursesCount: 12,
    studentsCount: 45000,
  },
  prerequisites: [
    'Базовые знания Python (переменные, функции, условия, циклы)',
    'Основы математики (алгебра, основы статистики)',
    'Понимание основ программирования',
    'Желание изучать новые технологии',
  ],
  learningOutcomes: [
    'Понимание основных концепций машинного обучения',
    'Умение применять алгоритмы обучения с учителем и без учителя',
    'Навыки работы с библиотеками Python для ML (Scikit-learn, Pandas, NumPy)',
    'Создание и обучение нейронных сетей с помощью TensorFlow',
    'Обработка и анализ реальных наборов данных',
    'Оценка качества моделей и их интерпретация',
    'Понимание принципов работы алгоритмов глубокого обучения',
    'Навыки работы с задачами NLP и компьютерного зрения',
  ],
  syllabus: [
    'Введение в машинное обучение и типы задач',
    'Подготовка данных и разведочный анализ',
    'Алгоритмы обучения с учителем: регрессия и классификация',
    'Методы оценки качества моделей и кросс-валидация',
    'Алгоритмы обучения без учителя: кластеризация и снижение размерности',
    'Введение в нейронные сети и глубокое обучение',
    'Сверточные нейронные сети для компьютерного зрения',
    'Рекуррентные сети и обработка последовательностей',
    'Обработка естественного языка и языковые модели',
    'Продвинутые техники: ансамбли, регуляризация, оптимизация',
    'Развертывание моделей и MLOps',
    'Этика ИИ и интерпретируемость моделей',
  ],
  units: mockCourseUnits,
  reviews: [
    {
      id: '1',
      author: 'Михаил К.',
      rating: 5,
      comment:
        'Отличный курс! Очень понятно объясняются сложные концепции. Практические задания помогают закрепить материал.',
      date: '2025-09-15',
    },
    {
      id: '2',
      author: 'Елена С.',
      rating: 5,
      comment:
        'Прекрасная структура курса, от простого к сложному. ИИ-помощник действительно помогает разобраться в трудных моментах.',
      date: '2025-09-10',
    },
    {
      id: '3',
      author: 'Дмитрий В.',
      rating: 4,
      comment:
        'Хороший курс для начинающих. Единственное замечание - хотелось бы больше практических проектов.',
      date: '2025-09-05',
    },
  ],
  lastStudied: '2025-09-21',
  status: 'in_progress',
};
