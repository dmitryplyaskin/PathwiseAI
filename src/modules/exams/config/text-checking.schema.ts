export interface TextCheckingResponse {
  isCorrect: boolean;
  score: number;
  explanation: string;
  feedback: string;
}

export const textCheckingSchema = {
  type: 'json_object',
  json_object: {
    type: 'object',
    properties: {
      isCorrect: {
        type: 'boolean',
        description: 'Правильность ответа',
      },
      score: {
        type: 'number',
        description: 'Оценка от 0 до 100',
      },
      explanation: {
        type: 'string',
        description: 'Объяснение оценки',
      },
      feedback: {
        type: 'string',
        description: 'Обратная связь для студента',
      },
    },
    required: ['isCorrect', 'score', 'explanation', 'feedback'],
  },
};
