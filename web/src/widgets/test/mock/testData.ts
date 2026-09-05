import type { TestData } from '../types';

export const mockTestData: TestData = {
  id: 'test-1',
  title: 'Тестирование знаний',
  questions: [
    {
      id: 'q1',
      type: 'quiz',
      question: 'Что такое React?',
      options: [
        {
          id: 'opt1',
          text: 'Библиотека для создания пользовательских интерфейсов',
          isCorrect: true,
        },
        {
          id: 'opt2',
          text: 'Язык программирования',
          isCorrect: false,
        },
        {
          id: 'opt3',
          text: 'База данных',
          isCorrect: false,
        },
        {
          id: 'opt4',
          text: 'Операционная система',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'q2',
      type: 'text',
      question: 'Объясните, что такое виртуальный DOM в React?',
      expectedAnswer:
        'Виртуальный DOM - это легковесная копия реального DOM в памяти',
    },
    {
      id: 'q3',
      type: 'quiz',
      question: 'Какой хук используется для управления состоянием в React?',
      options: [
        {
          id: 'opt1',
          text: 'useEffect',
          isCorrect: false,
        },
        {
          id: 'opt2',
          text: 'useState',
          isCorrect: true,
        },
        {
          id: 'opt3',
          text: 'useContext',
          isCorrect: false,
        },
        {
          id: 'opt4',
          text: 'useReducer',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'q4',
      type: 'text',
      question:
        'Опишите основные преимущества использования TypeScript с React',
      expectedAnswer:
        'TypeScript добавляет статическую типизацию, улучшает автодополнение и помогает находить ошибки на этапе разработки',
    },
  ],
};

