# ParentPilot.AI API Documentation

## Overview

ParentPilot.AI provides a comprehensive API for AI-powered parenting assistance, including chat functionality, agent management, and specialized processing endpoints.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Most endpoints require user authentication. Include user ID in request body where applicable.

## Main Processing Endpoint

### POST /api/process

The main processing endpoint that handles various types of requests and routes them to appropriate handlers.

**Request Body:**
```typescript
{
  type: "chat" | "agent" | "analysis" | "recommendation" | "task" | "insight" | "auto-route";
  userId?: string;
  childId?: string;
  agentId?: string;
  message?: string;
  data?: any;
  context?: any;
  options?: {
    generateInsights?: boolean;
    generateRecommendations?: boolean;
    createTasks?: boolean;
    autoRoute?: boolean;
    priority?: "low" | "medium" | "high";
    responseFormat?: "text" | "structured" | "both";
  };
}
```

**Response:**
```typescript
{
  success: boolean;
  type: string;
  response: any;
  insights?: any[];
  recommendations?: any[];
  tasks?: any[];
  metadata?: {
    processingTime: number;
    agentUsed?: string;
    confidence?: number;
    context?: any;
  };
}
```

### Request Types

#### 1. Chat Request
General AI chat with parenting assistant.

**Example:**
```json
{
  "type": "chat",
  "userId": "user123",
  "childId": "child456",
  "message": "My 3-year-old is having trouble sleeping. What can I do?",
  "options": {
    "responseFormat": "text"
  }
}
```

#### 2. Agent Request
Process message with a specific sub-agent.

**Example:**
```json
{
  "type": "agent",
  "userId": "user123",
  "childId": "child456",
  "agentId": "agent789",
  "message": "Help me create a learning plan for my child",
  "options": {
    "generateInsights": true,
    "generateRecommendations": true
  }
}
```

#### 3. Analysis Request
Analyze data and provide insights.

**Example:**
```json
{
  "type": "analysis",
  "userId": "user123",
  "childId": "child456",
  "data": {
    "activities": ["reading", "puzzles", "outdoor play"],
    "progress": {
      "reading": 85,
      "puzzles": 70,
      "outdoor": 90
    },
    "observations": "Child shows strong interest in reading but struggles with complex puzzles"
  }
}
```

#### 4. Recommendation Request
Generate personalized recommendations.

**Example:**
```json
{
  "type": "recommendation",
  "userId": "user123",
  "childId": "child456",
  "data": {
    "age": 4,
    "interests": ["dinosaurs", "space", "art"],
    "strengths": ["creativity", "curiosity"],
    "challenges": ["focus", "patience"]
  }
}
```

#### 5. Task Request
Create tasks for agents.

**Example:**
```json
{
  "type": "task",
  "userId": "user123",
  "childId": "child456",
  "agentId": "agent789",
  "data": {
    "taskType": "learning",
    "title": "Create reading schedule",
    "description": "Develop a daily reading routine for 30 minutes",
    "priority": "high",
    "dueDate": "2024-01-15"
  }
}
```

#### 6. Insight Request
Generate insights from agent data.

**Example:**
```json
{
  "type": "insight",
  "userId": "user123",
  "childId": "child456",
  "agentId": "agent789",
  "data": {
    "timeframe": "last_30_days",
    "focus": "learning_progress"
  }
}
```

#### 7. Auto-Route Request
Automatically determine the best agent for a message.

**Example:**
```json
{
  "type": "auto-route",
  "userId": "user123",
  "childId": "child456",
  "message": "My child is struggling with math homework",
  "options": {
    "generateInsights": true,
    "generateRecommendations": true
  }
}
```

## Chat Endpoint

### POST /api/chat

Direct chat with AI assistant.

**Request Body:**
```typescript
{
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  userId?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  response: string;
}
```

## Agent Management Endpoints

### GET /api/agents/types
Get available agent types.

### GET /api/users/:userId/agents
Get all sub-agents for a user.

### POST /api/agents
Create a new sub-agent.

**Request Body:**
```typescript
{
  userId: string;
  agentTypeId: string;
  name: string;
  description?: string;
  configuration?: any;
}
```

### PUT /api/agents/:agentId
Update a sub-agent.

### POST /api/agents/:agentId/message
Process message with specific agent.

### POST /api/agents/route-message
Route message to best agent.

### POST /api/agents/:agentId/insights
Generate agent insights.

### POST /api/agents/:agentId/recommendations
Generate agent recommendations.

### GET /api/agents/:agentId/insights
Get agent insights.

### GET /api/agents/:agentId/recommendations
Get agent recommendations.

### GET /api/agents/:agentId/tasks
Get agent tasks.

### POST /api/agents/:agentId/tasks
Create agent task.

### PUT /api/agents/:agentId/tasks/:taskId
Update agent task.

### POST /api/agents/:agentId/tasks/:taskId/execute
Execute agent task.

### GET /api/agents/:agentId/conversations
Get agent conversations.

## Specialized Endpoints

### POST /api/generate-dream-plan
Generate AI-powered development roadmap.

### POST /api/generate-weekly-digest
Generate AI-powered weekly digest.

### POST /api/recommend-enrichment
Generate enrichment recommendations.

## SubAgent Orchestrator Endpoints

### POST /api/subagent-orchestrator/process-task
Process a parenting task through the complete orchestrator pipeline.

**Request Body:**
```typescript
{
  userId: string;
  rawInput: string;
  childId?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    task_id: string;
    status: "completed" | "failed";
    summary: string;
    dispatcher_result: any;
    analyst_result: any;
    scheduler_result: any;
    total_cost_cents: number;
    processing_time_ms: number;
  };
}
```

### POST /api/subagent-orchestrator/dispatcher
Execute only the dispatcher agent to classify a task.

**Request Body:**
```typescript
{
  rawInput: string;
}
```

### POST /api/subagent-orchestrator/analyst
Execute only the analyst agent to extract structured data.

**Request Body:**
```typescript
{
  rawInput: string;
  category: string;
}
```

### POST /api/subagent-orchestrator/scheduler
Execute only the scheduler agent to create calendar events.

**Request Body:**
```typescript
{
  extractedData: any;
  childName?: string;
}
```

## Error Responses

All endpoints return consistent error responses:

```typescript
{
  success: false;
  error: string;
  message: string;
}
```

## Rate Limiting

- Default: 100 requests per 15 minutes
- Configurable via environment variables

## Environment Variables

Required for production:
- `CLAUDE_API_KEY`: Claude AI API key
- `ANTHROPIC_API_KEY`: Anthropic API key (for SubAgent Orchestrator)
- `SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (for client access)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `SUPABASE_SERVICE_KEY`: Supabase service key (alias for service role key)

Optional:
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window

## Usage Examples

### Basic Chat
```javascript
const response = await fetch('/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'chat',
    userId: 'user123',
    message: 'How can I help my child with reading?'
  })
});
```

### Agent Processing
```javascript
const response = await fetch('/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'agent',
    userId: 'user123',
    childId: 'child456',
    agentId: 'agent789',
    message: 'Create a learning plan',
    options: {
      generateInsights: true,
      generateRecommendations: true
    }
  })
});
```

### Auto-Routing
```javascript
const response = await fetch('/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'auto-route',
    userId: 'user123',
    childId: 'child456',
    message: 'My child needs help with math',
    options: {
      generateRecommendations: true
    }
  })
});
```

## Best Practices

1. **Always include userId** when available for personalized responses
2. **Use childId** for child-specific recommendations and insights
3. **Specify agentId** when you know which agent to use
4. **Use auto-route** when unsure which agent is best
5. **Enable insights/recommendations** for richer responses
6. **Handle errors gracefully** and provide fallback responses
7. **Cache responses** when appropriate to reduce API calls
8. **Monitor processing times** for performance optimization

## SDK Support

The API is designed to work with the ParentPilot.AI client SDK for seamless integration. 