# Main Processing Endpoint

## Overview

The main processing endpoint (`/api/process`) is a unified interface that handles various types of AI-powered requests and routes them to appropriate handlers. It serves as the primary entry point for all AI processing in the ParentPilot.AI system.

## Features

### 🎯 **Unified Interface**
- Single endpoint for multiple request types
- Consistent response format
- Built-in error handling and validation

### 🔄 **Request Routing**
- Automatic routing based on request type
- Context-aware processing
- User and child data integration

### 🤖 **AI Integration**
- Claude AI API integration
- Contextual system messages
- Personalized responses

### 📊 **Rich Outputs**
- Text responses
- Structured insights
- Recommendations
- Task creation
- Processing metadata

## Request Types

### 1. Chat (`type: "chat"`)
General AI chat with parenting assistant.

**Required Fields:**
- `message`: User's message

**Optional Fields:**
- `userId`: User ID for personalization
- `childId`: Child ID for child-specific context
- `options.responseFormat`: Response format preference

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

### 2. Agent (`type: "agent"`)
Process message with a specific sub-agent.

**Required Fields:**
- `agentId`: Specific agent to use
- `message`: User's message
- `childId`: Child ID

**Optional Fields:**
- `userId`: User ID
- `options.generateInsights`: Generate insights
- `options.generateRecommendations`: Generate recommendations

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

### 3. Analysis (`type: "analysis"`)
Analyze data and provide insights.

**Required Fields:**
- `data`: Data to analyze

**Optional Fields:**
- `userId`: User ID
- `childId`: Child ID for context

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

### 4. Recommendation (`type: "recommendation"`)
Generate personalized recommendations.

**Required Fields:**
- `data`: Input data for recommendations

**Optional Fields:**
- `userId`: User ID
- `childId`: Child ID for context

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

### 5. Task (`type: "task"`)
Create tasks for agents.

**Required Fields:**
- `agentId`: Agent to create task for
- `childId`: Child ID
- `data`: Task data

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

### 6. Insight (`type: "insight"`)
Generate insights from agent data.

**Required Fields:**
- `agentId`: Agent to generate insights for
- `childId`: Child ID
- `data`: Insight parameters

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

### 7. Auto-Route (`type: "auto-route"`)
Automatically determine the best agent for a message.

**Required Fields:**
- `message`: User's message
- `childId`: Child ID

**Optional Fields:**
- `userId`: User ID
- `options.generateInsights`: Generate insights
- `options.generateRecommendations`: Generate recommendations

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

## Response Format

All responses follow a consistent format:

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

### Response Fields

- **success**: Boolean indicating if the request was successful
- **type**: The request type that was processed
- **response**: Main response content (varies by type)
- **insights**: Array of generated insights (if requested)
- **recommendations**: Array of generated recommendations (if requested)
- **tasks**: Array of created tasks (if applicable)
- **metadata**: Processing metadata including timing and confidence

## Error Handling

The endpoint provides comprehensive error handling:

### Validation Errors (400)
- Missing required fields
- Invalid request types
- Malformed data

### Configuration Errors (500)
- Missing API keys
- Database connection issues
- AI service unavailability

### Processing Errors (500)
- AI API errors
- Database operation failures
- Agent processing errors

## Implementation Details

### File Structure
```
server/
├── routes/
│   └── process.ts          # Main processing endpoint
├── agents/
│   ├── agent-manager.ts    # Agent management
│   └── base-agent.ts       # Base agent class
├── config/
│   └── env.ts             # Environment configuration
└── database/
    └── config.ts          # Database configuration
```

### Key Components

1. **Request Handler** (`handleProcess`)
   - Validates incoming requests
   - Routes to appropriate handlers
   - Manages error responses

2. **Type-Specific Handlers**
   - `handleChatRequest`: General AI chat
   - `handleAgentRequest`: Agent-specific processing
   - `handleAnalysisRequest`: Data analysis
   - `handleRecommendationRequest`: Recommendation generation
   - `handleTaskRequest`: Task creation
   - `handleInsightRequest`: Insight generation
   - `handleAutoRouteRequest`: Automatic agent routing

3. **Context Management**
   - User data retrieval
   - Child data integration
   - Supabase integration

4. **AI Integration**
   - Claude API calls
   - System message generation
   - Response processing

## Usage Examples

### JavaScript/TypeScript
```javascript
// Basic chat
const response = await fetch('/api/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'chat',
    userId: 'user123',
    message: 'How can I help my child with reading?'
  })
});

// Agent processing with insights
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

### cURL
```bash
# Chat request
curl -X POST http://localhost:3001/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "type": "chat",
    "userId": "user123",
    "message": "How can I help my child with reading?"
  }'

# Analysis request
curl -X POST http://localhost:3001/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "type": "analysis",
    "userId": "user123",
    "childId": "child456",
    "data": {
      "activities": ["reading", "puzzles"],
      "progress": {"reading": 85, "puzzles": 70}
    }
  }'
```

## Testing

Run the test script to verify the endpoint:

```bash
node test-process-endpoint.js
```

The test script includes:
- All request type tests
- Error handling tests
- Response validation
- Performance timing

## Performance Considerations

1. **Response Time**: Most requests complete within 1-3 seconds
2. **Caching**: Consider caching responses for repeated requests
3. **Rate Limiting**: Default 100 requests per 15 minutes
4. **Concurrent Requests**: Handle multiple requests efficiently

## Security

1. **Input Validation**: All inputs are validated
2. **Error Sanitization**: Errors don't expose sensitive information
3. **User Context**: User data is properly isolated
4. **API Key Protection**: Keys are stored securely

## Monitoring

The endpoint provides metadata for monitoring:
- Processing time
- Confidence scores
- Agent usage
- Error rates

## Best Practices

1. **Always include userId** when available
2. **Use childId** for child-specific requests
3. **Handle errors gracefully** in client applications
4. **Cache responses** when appropriate
5. **Monitor processing times** for performance
6. **Use appropriate request types** for specific needs
7. **Enable insights/recommendations** for richer responses

## Future Enhancements

1. **Streaming Responses**: Real-time response streaming
2. **Batch Processing**: Handle multiple requests
3. **Advanced Routing**: ML-based request routing
4. **Response Caching**: Intelligent response caching
5. **Webhook Support**: Real-time notifications
6. **Analytics Integration**: Usage analytics
7. **Multi-language Support**: Internationalization

## Support

For issues or questions:
1. Check the API documentation
2. Review error messages
3. Test with the provided test script
4. Check server logs for detailed errors 