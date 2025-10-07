export interface PromptsConfig {
  systemPrompt: string;
  userPromptTemplate: string;
  complexityLevels: {
    simple: string;
    normal: string;
    professional: string;
  };
}

export const lessonGenerationPrompts: PromptsConfig = {
  systemPrompt:
    'You are an expert educator creating educational content for the PathwiseAI platform. Your task is to create structured lessons in JSON format. All lesson content MUST be in Russian language. Return ONLY valid JSON without any conversational elements, confirmations, or meta-commentary.',
  userPromptTemplate: `Create a lesson on the topic: "\${topic}"
\${details}

STRICT OUTPUT REQUIREMENTS:
- Content language: Russian (all titles, content, examples)
- Format: Valid JSON only
- No conversational phrases ("Отлично", "Я помогу", "Конечно" etc.)
- No explanations outside JSON structure
- No markdown code blocks wrapping the JSON (\`\`\`json)
- Direct JSON output only

COMPLEXITY LEVEL: \${complexityDescription}

CONTENT REQUIREMENTS:
- Title: Clear, specific title in Russian related to the topic
- Description: Brief summary (1-2 sentences) explaining what the lesson covers and its main value
- Content: Use markdown formatting (headers ##, ###, lists, **bold**, *italic*, code blocks where appropriate)
- Structure: Introduction → Core concepts → Examples → Practical tips → Summary
- Complexity alignment: Content depth must match the specified complexity level
- Write in an engaging, educational tone
- Include real-world examples and analogies where appropriate

JSON SCHEMA:
{
  "title": "string - lesson title in Russian",
  "description": "string - brief summary (1-2 sentences) explaining what the lesson covers and its main value in Russian",
  "content": "string - full lesson text in Russian with markdown formatting including sections: ## Введение, ## Основной материал, ## Примеры, ## Практические советы, ## Заключение",
  "readingTime": "number - estimated reading time in minutes (based on average reading speed of 200 words/minute in Russian)",
  "difficulty": "number - difficulty rating from 1 to 10 based on cognitive load, prerequisites, and concept abstraction. Simple: 1-3, Normal: 4-6, Professional: 7-10"
}

OUTPUT VALIDATION:
- Ensure valid JSON syntax (proper escaping of quotes, newlines as \\n)
- Description field must be concise (1-2 sentences) and informative
- Content field must contain well-formatted markdown text in Russian
- All fields are required and non-empty
- readingTime must be realistic (5-30 minutes typical range)
- difficulty must be an integer 1-10 that corresponds to complexity level
- Content should be comprehensive and educational

Generate the lesson now. Output JSON directly:`,
  complexityLevels: {
    simple:
      'very simple, using analogies and basic terminology. Target audience: beginners with no prior knowledge. Use simple explanations and everyday examples',
    normal:
      'intermediate level, using proper terminology. Target audience: learners with basic understanding. Balance between accessibility and technical accuracy',
    professional:
      'professional level, using complex terminology and technical details. Target audience: advanced learners. Include in-depth explanations and advanced concepts',
  },
};
