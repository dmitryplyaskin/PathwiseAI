// Simple test to verify default user creation functionality
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a test .env file
const envContent = `# OpenRouter API Configuration
OPENROUTER_API_KEY=test_key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# OpenRouter Base URL
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Application name for OpenRouter (optional)
OPENROUTER_APP_NAME=PathwiseAI
OPENROUTER_SITE_URL=http://localhost:3000

# Feature flags
CREATE_DEFAULT_USER=true`;

const envPath = path.join(__dirname, '.env.test');
fs.writeFileSync(envPath, envContent);

console.log('Test environment file created at:', envPath);
console.log('To test default user creation:');
console.log('1. Set CREATE_DEFAULT_USER=true in your .env file');
console.log('2. Run the application');
console.log(
  '3. Check the console logs for "Default user created successfully" message',
);
console.log('4. Verify the user exists in the database');
