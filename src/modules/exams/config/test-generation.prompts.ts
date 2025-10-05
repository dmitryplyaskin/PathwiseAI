export interface TestGenerationPromptsConfig {
  systemPrompt: string;
  userPromptTemplate: string;
  complexityLevels: {
    simple: string;
    normal: string;
    professional: string;
  };
}

export const testGenerationPrompts: TestGenerationPromptsConfig = {
  systemPrompt:
    'Ты - эксперт по созданию образовательных тестов для платформы PathwiseAI. Твоя задача - создавать качественные тестовые вопросы на основе материала урока. Все вопросы ДОЛЖНЫ быть на русском языке. Возвращай ТОЛЬКО валидный JSON без дополнительных комментариев.',

  userPromptTemplate: `Создай тест на основе урока:

ЗАГОЛОВОК УРОКА: \${lessonTitle}
СОДЕРЖАНИЕ УРОКА:
\${lessonContent}

ТРЕБОВАНИЯ К ТЕСТУ:
- Количество вопросов: \${questionCount}
- Язык: Русский
- Формат: Только валидный JSON
- Разнообразие: Смешивай типы вопросов (квиз и текстовые)
- Качество: Вопросы должны проверять понимание ключевых концепций урока

ТИПЫ ВОПРОСОВ:
1. Квиз-вопросы (quiz): 4 варианта ответа, один правильный
2. Текстовые вопросы (text): открытые вопросы для проверки понимания

СТРУКТУРА JSON:
{
  "title": "Тест по уроку: [название урока]",
  "questions": [
    {
      "id": "uuid",
      "type": "quiz" | "text",
      "question": "Текст вопроса на русском",
      "options": [{"id": "opt1", "text": "Вариант 1", "isCorrect": true}, ...], // только для quiz
      "expectedAnswer": "Ожидаемый ответ", // только для text
      "explanation": "Объяснение правильного ответа"
    }
  ]
}

Создай тест сейчас. Выводи только JSON:`,

  complexityLevels: {
    simple: 'Простые вопросы на запоминание фактов и базовых понятий',
    normal: 'Вопросы средней сложности на понимание концепций и их применение',
    professional:
      'Сложные вопросы на глубокое понимание, анализ и синтез знаний',
  },
};
