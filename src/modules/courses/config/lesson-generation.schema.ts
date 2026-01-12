export interface LessonGenerationResponse {
  title: string;
  description: string;
  content: string;
  readingTime: number;
  difficulty: number;
}

export const lessonGenerationSchema = {
  type: 'json_schema',
  json_schema: {
    name: 'lesson_generation',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Заголовок урока',
        },
        description: {
          type: 'string',
          description: 'Краткое описание урока (1-2 предложения)',
        },
        content: {
          type: 'string',
          description:
            'Основной контент урока в формате Markdown (не HTML). Используй заголовки ##/###, списки, выделения и примеры. Весь текст — на русском.',
        },
        readingTime: {
          type: 'integer',
          description: 'Примерное время чтения урока в минутах (целое число)',
        },
        difficulty: {
          type: 'integer',
          description: 'Уровень сложности урока от 1 до 10 (целое число)',
        },
      },
      required: [
        'title',
        'description',
        'content',
        'readingTime',
        'difficulty',
      ],
      additionalProperties: false,
    },
  },
} as const;
