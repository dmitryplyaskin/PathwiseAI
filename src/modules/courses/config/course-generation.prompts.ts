export interface CoursePromptsConfig {
  systemPrompt: string;
  userPromptTemplate: string;
  complexityLevels: {
    simple: string;
    normal: string;
    professional: string;
  };
}

export const courseGenerationPrompts: CoursePromptsConfig = {
  systemPrompt:
    'You are an expert educator creating educational course outlines for the PathwiseAI platform. Your task is to create structured course outlines in JSON format. All course content MUST be in Russian language. Return ONLY valid JSON without any conversational elements, confirmations, or meta-commentary.',
  userPromptTemplate: `Create a course outline on the topic: "\${topic}"
\${details}

STRICT OUTPUT REQUIREMENTS:
- Content language: Russian (all titles, content, descriptions)
- Format: Valid JSON only
- No conversational phrases ("Отлично", "Я помогу", "Конечно" etc.)
- No explanations outside JSON structure
- No markdown code blocks wrapping the JSON (\`\`\`json)
- Direct JSON output only

COMPLEXITY LEVEL: \${complexityDescription}

COURSE REQUIREMENTS:
- Name: Clear, specific course title in Russian
- Description: Comprehensive description (2-3 sentences) explaining what the course covers, its target audience, and learning outcomes
- Lessons: Create 5-12 lessons that progressively build knowledge from basics to advanced concepts
- Each lesson should have a clear, descriptive name and brief description
- Lessons should follow logical progression and build upon each other
- Include practical, theoretical, and review lessons where appropriate

LESSON STRUCTURE GUIDELINES:
- Start with foundational concepts
- Progress from simple to complex topics
- Include practical examples and exercises
- End with comprehensive review or advanced topics
- Each lesson should be substantial enough for 15-30 minutes of study

JSON SCHEMA:
{
  "name": "string - course title in Russian",
  "description": "string - comprehensive course description (2-3 sentences) in Russian explaining scope, target audience, and learning outcomes",
  "lessons": [
    {
      "name": "string - lesson title in Russian",
      "description": "string - brief lesson description (1-2 sentences) in Russian explaining what will be covered"
    }
  ]
}

OUTPUT VALIDATION:
- Ensure valid JSON syntax (proper escaping of quotes, newlines as \\n)
- Course name must be clear and descriptive
- Description must be comprehensive and informative
- Lessons array must contain 5-12 items
- Each lesson must have non-empty name and description
- All content must be in Russian
- Course structure must be logical and progressive

Generate the course outline now. Output JSON directly:`,
  complexityLevels: {
    simple:
      'very simple, using analogies and basic terminology. Target audience: beginners with no prior knowledge. Use simple explanations and everyday examples. Create foundational lessons.',
    normal:
      'intermediate level, using proper terminology. Target audience: learners with basic understanding. Balance between accessibility and technical accuracy. Create progressive lessons.',
    professional:
      'professional level, using complex terminology and technical details. Target audience: advanced learners. Include in-depth explanations and advanced concepts. Create comprehensive lessons.',
  },
};
