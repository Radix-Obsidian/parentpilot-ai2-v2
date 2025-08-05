import { z } from 'zod';

// Environment variable schema for validation
const envSchema = z.object({
  // Supabase Configuration
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),

  // AI API Configuration
  CLAUDE_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),

  // Server Configuration
  PORT: z.string().transform(Number).default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PING_MESSAGE: z.string().default('ping'),

  // Database Configuration
  DATABASE_URL: z.string().optional(),

  // Optional: Monitoring and Analytics
  SENTRY_DSN: z.string().optional(),
  ANALYTICS_KEY: z.string().optional(),

  // Optional: Email Service
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // Optional: File Storage
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().optional(),

  // Optional: Redis
  REDIS_URL: z.string().optional(),

  // Optional: JWT Secret
  JWT_SECRET: z.string().optional(),

  // Optional: Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

  // Stripe Configuration
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_STARTER_PRICE_ID: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),
  STRIPE_ENTERPRISE_PRICE_ID: z.string().optional(),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
};

// Export validated environment variables
export const env = parseEnv();

// Environment validation helpers
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Configuration validation
export const validateConfig = () => {
  const errors: string[] = [];

  // Required for production
  if (isProduction) {
    if (!env.SUPABASE_URL) errors.push('SUPABASE_URL is required in production');
    if (!env.SUPABASE_SERVICE_ROLE_KEY) errors.push('SUPABASE_SERVICE_ROLE_KEY is required in production');
    if (!env.CLAUDE_API_KEY) errors.push('CLAUDE_API_KEY is required in production');
  }

  // Optional but recommended
  if (!env.SUPABASE_URL && isDevelopment) {
    console.warn('⚠️  SUPABASE_URL not set - using placeholder values');
  }

  if (!env.CLAUDE_API_KEY && isDevelopment) {
    console.warn('⚠️  CLAUDE_API_KEY not set - AI features may not work');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:', errors);
    process.exit(1);
  }
};

// Feature flags based on environment variables
export const features = {
  supabase: !!env.SUPABASE_URL && !!env.SUPABASE_SERVICE_ROLE_KEY,
  claude: !!env.CLAUDE_API_KEY,
  openai: !!env.OPENAI_API_KEY,
  googleAI: !!env.GOOGLE_AI_API_KEY,
  email: !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
  fileStorage: !!(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET),
  stripe: !!(env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY),
  redis: !!env.REDIS_URL,
  jwt: !!env.JWT_SECRET,
  monitoring: !!(env.SENTRY_DSN || env.ANALYTICS_KEY),
} as const;

// Configuration getters with proper typing
export const getConfig = () => ({
  server: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    pingMessage: env.PING_MESSAGE,
  },
  database: {
    supabaseUrl: env.SUPABASE_URL,
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    databaseUrl: env.DATABASE_URL,
  },
  ai: {
    claudeApiKey: env.CLAUDE_API_KEY,
    openaiApiKey: env.OPENAI_API_KEY,
    googleAiApiKey: env.GOOGLE_AI_API_KEY,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  storage: {
    awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    awsRegion: env.AWS_REGION,
    awsS3Bucket: env.AWS_S3_BUCKET,
  },
  security: {
    jwtSecret: env.JWT_SECRET,
    redisUrl: env.REDIS_URL,
  },
  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    analyticsKey: env.ANALYTICS_KEY,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  features,
}); 