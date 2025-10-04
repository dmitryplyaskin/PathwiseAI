export interface LessonGenerationResponse {
  title: string;
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
        content: {
          type: 'string',
          description:
            'Основной контент урока в формате HTML с подробным объяснением темы',
        },
        readingTime: {
          type: 'number',
          description: 'Примерное время чтения урока в минутах',
        },
        difficulty: {
          type: 'number',
          description: 'Уровень сложности урока от 1 до 5',
        },
      },
      required: ['title', 'content', 'readingTime', 'difficulty'],
      additionalProperties: false,
    },
  },
} as const;
