export interface TestGenerationResponse {
  title: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedQuestion {
  id: string;
  type: 'quiz' | 'text';
  question: string;
  questionContent?: string;
  options?: GeneratedOption[];
  expectedAnswer?: string;
  explanation: string;
}

export interface GeneratedOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export const testGenerationSchema = {
  type: 'json_object',
  json_object: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Название теста',
      },
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Уникальный идентификатор вопроса',
            },
            type: {
              type: 'string',
              enum: ['quiz', 'text'],
              description: 'Тип вопроса',
            },
            question: {
              type: 'string',
              description: 'Текст вопроса (обычный текст)',
            },
            questionContent: {
              type: 'string',
              description:
                'Дополнительный контент вопроса в формате Markdown (код, формулы и т.д.). Опциональное поле.',
            },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Идентификатор варианта ответа',
                  },
                  text: {
                    type: 'string',
                    description: 'Текст варианта ответа',
                  },
                  isCorrect: {
                    type: 'boolean',
                    description: 'Правильность варианта ответа',
                  },
                },
                required: ['id', 'text', 'isCorrect'],
              },
              description: 'Варианты ответов для квиз-вопросов',
            },
            expectedAnswer: {
              type: 'string',
              description: 'Ожидаемый ответ для текстовых вопросов',
            },
            explanation: {
              type: 'string',
              description: 'Объяснение правильного ответа',
            },
          },
          required: ['id', 'type', 'question', 'explanation'],
        },
      },
    },
    required: ['title', 'questions'],
  },
};
