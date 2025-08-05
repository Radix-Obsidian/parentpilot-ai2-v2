#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 ParentPilot.AI Environment Validation');
console.log('========================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Run "npm run setup:env" to create one.');
  process.exit(1);
}

// Load environment variables
require('dotenv').config({ path: envPath });

// Define required variables
const required = {
  'SUPABASE_URL': 'Supabase project URL',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase service role key',
  'CLAUDE_API_KEY': 'Claude API key'
};

// Define optional but recommended variables
const recommended = {
  'SUPABASE_ANON_KEY': 'Supabase anonymous key (for client auth)',
  'OPENAI_API_KEY': 'OpenAI API key (for additional AI features)',
  'GOOGLE_AI_API_KEY': 'Google AI API key (for additional AI features)',
  'JWT_SECRET': 'JWT signing secret (for authentication)',
  'SMTP_HOST': 'SMTP host (for email notifications)',
  'SMTP_USER': 'SMTP username (for email notifications)',
  'SMTP_PASS': 'SMTP password (for email notifications)',
  'AWS_ACCESS_KEY_ID': 'AWS access key (for file storage)',
  'AWS_SECRET_ACCESS_KEY': 'AWS secret key (for file storage)',
  'AWS_S3_BUCKET': 'AWS S3 bucket (for file storage)',
  'REDIS_URL': 'Redis URL (for caching)',
  'SENTRY_DSN': 'Sentry DSN (for error tracking)',
  'ANALYTICS_KEY': 'Analytics key (for monitoring)'
};

// Check environment
const env = process.env;
const errors = [];
const warnings = [];
const features = {};

console.log('📋 Checking required environment variables...\n');

// Check required variables
for (const [key, description] of Object.entries(required)) {
  if (!env[key] || env[key].trim() === '') {
    errors.push(`❌ ${key}: ${description} is required`);
  } else {
    console.log(`✅ ${key}: Set`);
    features[key] = true;
  }
}

console.log('\n📋 Checking optional environment variables...\n');

// Check recommended variables
for (const [key, description] of Object.entries(recommended)) {
  if (!env[key] || env[key].trim() === '') {
    warnings.push(`⚠️  ${key}: ${description} is not set`);
  } else {
    console.log(`✅ ${key}: Set`);
    features[key] = true;
  }
}

// Check server configuration
console.log('\n📋 Checking server configuration...\n');

const serverConfig = {
  'PORT': env.PORT || '3001',
  'NODE_ENV': env.NODE_ENV || 'development',
  'PING_MESSAGE': env.PING_MESSAGE || 'ping'
};

for (const [key, value] of Object.entries(serverConfig)) {
  console.log(`✅ ${key}: ${value}`);
}

// Display results
console.log('\n📊 Environment Summary');
console.log('=====================\n');

if (errors.length > 0) {
  console.log('❌ ERRORS (must be fixed):');
  errors.forEach(error => console.log(`  ${error}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS (recommended to set):');
  warnings.forEach(warning => console.log(`  ${warning}`));
  console.log('');
}

// Feature availability
console.log('🚀 Feature Availability:');
console.log('=======================\n');

const featureStatus = {
  'Database (Supabase)': features.SUPABASE_URL && features.SUPABASE_SERVICE_ROLE_KEY,
  'AI Chat (Claude)': features.CLAUDE_API_KEY,
  'Additional AI (OpenAI)': features.OPENAI_API_KEY,
  'Additional AI (Google)': features.GOOGLE_AI_API_KEY,
  'Authentication (JWT)': features.JWT_SECRET,
  'Email Notifications': features.SMTP_HOST && features.SMTP_USER && features.SMTP_PASS,
  'File Storage (AWS)': features.AWS_ACCESS_KEY_ID && features.AWS_SECRET_ACCESS_KEY && features.AWS_S3_BUCKET,
  'Caching (Redis)': features.REDIS_URL,
  'Error Tracking (Sentry)': features.SENTRY_DSN,
  'Analytics': features.ANALYTICS_KEY
};

for (const [feature, available] of Object.entries(featureStatus)) {
  const status = available ? '✅ Available' : '❌ Not Available';
  console.log(`${feature}: ${status}`);
}

// Final result
console.log('\n' + '='.repeat(50));

if (errors.length > 0) {
  console.log('❌ Environment validation FAILED');
  console.log('Please fix the errors above before running the application.');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('⚠️  Environment validation PASSED with warnings');
  console.log('The application will run, but some features may not be available.');
} else {
  console.log('✅ Environment validation PASSED');
  console.log('All recommended variables are configured!');
}

console.log('\n💡 Tips:');
console.log('- Run "npm run setup:env" to create a new .env file');
console.log('- Check ENVIRONMENT.md for detailed configuration instructions');
console.log('- Visit the API provider websites to get your API keys'); 