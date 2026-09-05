import { registerAs } from '@nestjs/config';

export default registerAs('openrouter', () => ({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
  baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  appName: process.env.OPENROUTER_APP_NAME || 'PathwiseAI',
  siteUrl: process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
}));
