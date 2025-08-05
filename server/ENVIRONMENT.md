# Environment Variables Configuration

This document describes all environment variables used in the ParentPilot.AI project.

## Quick Setup

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Or run the setup script:
   ```bash
   node scripts/setup-env.js
   ```

3. Edit the `.env` file with your actual values

## Required Environment Variables

### Supabase Configuration
These are required for database functionality.

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for server-side operations | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### AI API Configuration
Required for AI-powered features.

| Variable | Description | Example |
|----------|-------------|---------|
| `CLAUDE_API_KEY` | Anthropic Claude API key | `sk-ant-api03-...` |

## Optional Environment Variables

### Server Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `PING_MESSAGE` | Health check message | `ping` |

### Additional AI Services
| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for GPT models | `sk-...` |
| `GOOGLE_AI_API_KEY` | Google AI API key | `AIza...` |

### Database Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Alternative database URL | `postgresql://...` |

### Monitoring and Analytics
| Variable | Description | Example |
|----------|-------------|---------|
| `SENTRY_DSN` | Sentry error tracking DSN | `https://...@sentry.io/...` |
| `ANALYTICS_KEY` | Analytics service key | `G-XXXXXXXXXX` |

### Email Service
| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password | `your-app-password` |

### File Storage (AWS S3)
| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `...` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_S3_BUCKET` | S3 bucket name | `parentpilot-uploads` |

### Caching and Sessions
| Variable | Description | Example |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

### Security
| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing secret | `your-super-secret-key` |

### Rate Limiting
| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests per window | `100` |

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
PORT=3001
```

### Production
```bash
NODE_ENV=production
PORT=3001
# All required variables must be set
```

### Testing
```bash
NODE_ENV=test
PORT=3002
```

## Feature Flags

The application automatically detects available features based on environment variables:

- **Supabase**: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- **Claude AI**: `CLAUDE_API_KEY` is set
- **OpenAI**: `OPENAI_API_KEY` is set
- **Google AI**: `GOOGLE_AI_API_KEY` is set
- **Email**: `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are set
- **File Storage**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET` are set
- **Redis**: `REDIS_URL` is set
- **JWT**: `JWT_SECRET` is set
- **Monitoring**: `SENTRY_DSN` or `ANALYTICS_KEY` is set

## Getting API Keys

### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the URL and service role key

### Claude (Anthropic)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account
3. Generate an API key

### OpenAI
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account
3. Generate an API key

### Google AI
1. Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create an API key

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT_SECRET
3. **Rotate API keys** regularly
4. **Use environment-specific configurations**
5. **Validate environment variables** at startup

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
   - Check that the values are correct and not empty

2. **"AI service not configured"**
   - Ensure `CLAUDE_API_KEY` is set
   - Verify the API key is valid and has sufficient credits

3. **"Database connection failed"**
   - Check Supabase project status
   - Verify network connectivity
   - Ensure database schema is properly set up

### Validation

The application validates environment variables at startup. Check the console output for any validation errors.

## Environment Configuration in Code

The application uses a centralized environment configuration system:

```typescript
import { env, features, getConfig } from './config/env';

// Access validated environment variables
const port = env.PORT;
const isProduction = env.NODE_ENV === 'production';

// Check feature availability
if (features.supabase) {
  // Supabase is available
}

// Get organized configuration
const config = getConfig();
``` 