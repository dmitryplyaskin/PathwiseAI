export interface CourseGenerationResponse {
  name: string;
  description: string;
  lessons: Array<{
    name: string;
    description: string;
  }>;
}

export const courseGenerationSchema = {
  type: 'json_schema',
  json_schema: {
    name: 'course_generation',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Название курса',
        },
        description: {
          type: 'string',
          description: 'Описание курса (2-3 предложения)',
        },
        lessons: {
          type: 'array',
          description: 'Список уроков курса',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Название урока',
              },
              description: {
                type: 'string',
                description: 'Краткое описание урока (1-2 предложения)',
              },
            },
            required: ['name', 'description'],
            additionalProperties: false,
          },
          minItems: 3,
          maxItems: 15,
        },
      },
      required: ['name', 'description', 'lessons'],
      additionalProperties: false,
    },
  },
} as const;
