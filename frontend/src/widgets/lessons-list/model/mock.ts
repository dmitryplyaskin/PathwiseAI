export interface Lesson {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastStudied: string;
  status: 'completed' | 'in_progress';
}

export const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    description: 'Learn the basics of machine learning and its core concepts.',
    progress: 100,
    lastStudied: '2025-09-20',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Supervised Learning',
    description:
      'Understand supervised learning algorithms like regression and classification.',
    progress: 75,
    lastStudied: '2025-09-21',
    status: 'in_progress',
  },
  {
    id: '3',
    title: 'Unsupervised Learning',
    description:
      'Explore unsupervised learning techniques including clustering and dimensionality reduction.',
    progress: 50,
    lastStudied: '2025-09-19',
    status: 'in_progress',
  },
  {
    id: '4',
    title: 'Neural Networks and Deep Learning',
    description: 'Dive into the world of neural networks and deep learning.',
    progress: 25,
    lastStudied: '2025-09-18',
    status: 'in_progress',
  },
  {
    id: '5',
    title: 'Natural Language Processing (NLP)',
    description: 'Get started with NLP and build models that understand text.',
    progress: 0,
    lastStudied: 'Never',
    status: 'in_progress',
  },
  {
    id: '6',
    title: 'Advanced ML Techniques',
    description:
      'Covering advanced topics like reinforcement learning and generative models.',
    progress: 0,
    lastStudied: 'Never',
    status: 'in_progress',
  },
];
