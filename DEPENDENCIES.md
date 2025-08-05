# ParentPilot.AI2 Dependencies

This document outlines all the dependencies installed for the ParentPilot.AI2 project and their purposes.

## Core Dependencies

### AI/ML Libraries
- **@anthropic-ai/sdk**: Official Anthropic SDK for Claude AI integration
- **openai**: OpenAI API client for GPT models
- **langchain**: Framework for building LLM applications
- **@langchain/anthropic**: LangChain integration with Anthropic
- **@langchain/openai**: LangChain integration with OpenAI
- **@langchain/core**: Core LangChain functionality
- **@langchain/community**: Community LangChain integrations

### Authentication & Security
- **bcryptjs**: Password hashing and verification
- **jsonwebtoken**: JWT token generation and verification
- **uuid**: Unique identifier generation
- **@types/bcryptjs**: TypeScript types for bcryptjs
- **@types/jsonwebtoken**: TypeScript types for jsonwebtoken
- **@types/uuid**: TypeScript types for uuid

### File Upload & Middleware
- **multer**: File upload middleware for Express
- **@types/multer**: TypeScript types for multer
- **helmet**: Security middleware for Express
- **compression**: Response compression middleware
- **morgan**: HTTP request logger middleware
- **@types/morgan**: TypeScript types for morgan

### Validation & Error Handling
- **joi**: Schema validation library
- **@types/joi**: TypeScript types for joi
- **winston**: Logging library
- **rate-limiter-flexible**: Rate limiting library
- **express-rate-limit**: Express rate limiting middleware

## Development Dependencies

### Testing
- **supertest**: HTTP assertion library for testing
- **@types/supertest**: TypeScript types for supertest
- **jest**: JavaScript testing framework
- **@types/jest**: TypeScript types for jest
- **ts-jest**: TypeScript preprocessor for Jest

### TypeScript & Build Tools
- **@types/compression**: TypeScript types for compression

## Existing Dependencies (Already Present)

### Frontend
- **React 18**: UI framework
- **React Router 6**: Client-side routing
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **React Hook Form**: Form handling
- **React Query**: Data fetching and caching

### Backend
- **Express**: Web framework
- **CORS**: Cross-origin resource sharing
- **Supabase**: Database and authentication
- **Zod**: Schema validation
- **Node-fetch**: HTTP client

### Development Tools
- **Vitest**: Unit testing
- **Prettier**: Code formatting
- **ESLint**: Code linting

## Usage Examples

### AI Integration
```typescript
import Anthropic from '@anthropic-ai/sdk';
import { ChatAnthropic } from '@langchain/anthropic';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});
```

### Authentication
```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);

// Generate JWT
const token = jwt.sign({ userId }, process.env.JWT_SECRET);
```

### File Upload
```typescript
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
```

### Validation
```typescript
import Joi from 'joi';

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
```

### Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## Security Considerations

1. **Environment Variables**: Store sensitive data in `.env` files
2. **Input Validation**: Use Joi for request validation
3. **Password Hashing**: Use bcryptjs for secure password storage
4. **JWT Tokens**: Use jsonwebtoken for stateless authentication
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **Security Headers**: Use helmet for security headers
7. **File Upload Limits**: Set appropriate file size and type limits

## Performance Considerations

1. **Response Compression**: Use compression middleware
2. **Caching**: Implement appropriate caching strategies
3. **Database Optimization**: Use efficient queries and indexing
4. **Image Optimization**: Compress and resize uploaded images
5. **Bundle Optimization**: Use Vite's build optimization features

## Next Steps

1. Configure environment variables in `.env` file
2. Set up database schema and migrations
3. Implement authentication middleware
4. Create API rate limiting
5. Set up logging configuration
6. Configure file upload handling
7. Implement error handling middleware
8. Set up testing framework 