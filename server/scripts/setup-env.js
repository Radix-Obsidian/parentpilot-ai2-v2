#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 ParentPilot.AI Environment Setup');
console.log('=====================================\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupEnvironment();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  setupEnvironment();
}

function setupEnvironment() {
  console.log('\n📋 Setting up environment variables...\n');
  
  // Copy from env.example if it exists
  if (fs.existsSync(envExamplePath)) {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ Created .env file from env.example');
  } else {
    // Create basic .env file
    const basicEnv = `# ParentPilot.AI Environment Configuration

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI API Configuration
CLAUDE_API_KEY=your_claude_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
PING_MESSAGE=pong

# Optional: Additional AI Services
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Optional: Monitoring and Analytics
SENTRY_DSN=your_sentry_dsn_here
ANALYTICS_KEY=your_analytics_key_here

# Optional: Email Service
SMTP_HOST=your_smtp_host_here
SMTP_PORT=587
SMTP_USER=your_smtp_user_here
SMTP_PASS=your_smtp_password_here

# Optional: File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket_name_here

# Optional: Redis
REDIS_URL=your_redis_url_here

# Optional: JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Created basic .env file');
  }

  console.log('\n📝 Next steps:');
  console.log('1. Edit the .env file with your actual values');
  console.log('2. Required for basic functionality:');
  console.log('   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.log('   - CLAUDE_API_KEY');
  console.log('3. Optional but recommended:');
  console.log('   - SUPABASE_ANON_KEY (for client-side auth)');
  console.log('   - Additional AI API keys for enhanced features');
  console.log('\n🔗 Get your API keys from:');
  console.log('   - Supabase: https://supabase.com');
  console.log('   - Claude: https://console.anthropic.com');
  console.log('   - OpenAI: https://platform.openai.com');
  console.log('   - Google AI: https://makersuite.google.com/app/apikey');
  
  rl.close();
} 