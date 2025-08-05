# Sub-Agent Service Core

## Overview

The Sub-Agent Service Core is a comprehensive system for managing, coordinating, and orchestrating multiple AI sub-agents within the ParentPilot.AI platform. It provides a unified interface for agent lifecycle management, inter-agent communication, collaboration, and performance monitoring.

## Architecture

### Core Components

1. **SubAgentService** - Main service class that orchestrates all sub-agent operations
2. **AgentManager** - Handles agent creation, updates, and basic operations
3. **BaseAgent** - Abstract base class for all agent implementations
4. **AgentFactory** - Creates and manages agent instances
5. **API Routes** - RESTful endpoints for external access

### Key Features

#### 1. Agent Lifecycle Management
- **Creation**: Create new sub-agents with specific types and configurations
- **Initialization**: Automatically initialize agents when created or accessed
- **Updates**: Modify agent configurations and capabilities
- **Deactivation**: Safely deactivate agents and clean up resources
- **Training**: Start and complete agent training phases

#### 2. Inter-Agent Communication
- **Message Routing**: Route messages to the most appropriate agent
- **Direct Communication**: Send messages between specific agents
- **Multi-Agent Collaboration**: Coordinate multiple agents on complex tasks
- **Communication Logging**: Track all inter-agent communications

#### 3. Task Management
- **Task Creation**: Create tasks for specific agents
- **Task Execution**: Execute tasks with proper context and data
- **Task Updates**: Modify task status and progress
- **Task Monitoring**: Track task completion and performance

#### 4. Insights and Recommendations
- **Insight Generation**: Generate insights based on agent analysis
- **Recommendation Creation**: Create actionable recommendations
- **Data Aggregation**: Combine insights from multiple agents
- **Confidence Scoring**: Rate the reliability of generated content

#### 5. Performance Monitoring
- **Metrics Collection**: Track agent performance metrics
- **Capability Management**: Enable/disable specific agent capabilities
- **Resource Management**: Monitor active agents and resource usage
- **Service Configuration**: Manage service-wide settings

## API Endpoints

### Agent Management

#### Get All User Agents
```
GET /api/sub-agents
Headers: user-id: <userId>
```

#### Create New Agent
```
POST /api/sub-agents
Headers: user-id: <userId>
Body: {
  "agentTypeId": "string",
  "name": "string",
  "description": "string",
  "configuration": {}
}
```

#### Get Specific Agent
```
GET /api/sub-agents/:agentId
Headers: user-id: <userId>
```

#### Update Agent
```
PUT /api/sub-agents/:agentId
Headers: user-id: <userId>
Body: {
  "name": "string",
  "description": "string",
  "configuration": {}
}
```

#### Deactivate Agent
```
DELETE /api/sub-agents/:agentId
Headers: user-id: <userId>
```

### Message Processing

#### Process Message with Specific Agent
```
POST /api/sub-agents/:agentId/process
Headers: user-id: <userId>
Body: {
  "message": "string",
  "childId": "string",
  "context": {}
}
```

#### Route Message to Best Agent
```
POST /api/sub-agents/route
Headers: user-id: <userId>
Body: {
  "message": "string",
  "childId": "string"
}
```

#### Multi-Agent Collaboration
```
POST /api/sub-agents/collaborate
Headers: user-id: <userId>
Body: {
  "message": "string",
  "childId": "string",
  "agentIds": ["agent1", "agent2", "agent3"]
}
```

### Inter-Agent Communication

#### Send Message Between Agents
```
POST /api/sub-agents/:agentId/send-message
Headers: user-id: <userId>
Body: {
  "toAgentId": "string",
  "messageType": "request|response|notification",
  "content": {},
  "priority": "low|medium|high|urgent"
}
```

#### Get Agent Communications
```
GET /api/sub-agents/:agentId/communications?limit=50
Headers: user-id: <userId>
```

### Agent Capabilities

#### Get Agent Capabilities
```
GET /api/sub-agents/:agentId/capabilities
Headers: user-id: <userId>
```

#### Update Agent Capability
```
PUT /api/sub-agents/:agentId/capabilities/:capabilityName
Headers: user-id: <userId>
Body: {
  "enabled": boolean
}
```

### Task Management

#### Get Agent Tasks
```
GET /api/sub-agents/:agentId/tasks?status=pending
Headers: user-id: <userId>
```

#### Create Agent Task
```
POST /api/sub-agents/:agentId/tasks
Headers: user-id: <userId>
Body: {
  "childId": "string",
  "taskData": {
    "task_type": "string",
    "title": "string",
    "description": "string",
    "priority": "low|medium|high|urgent",
    "due_date": "string"
  }
}
```

#### Update Agent Task
```
PUT /api/sub-agents/tasks/:taskId
Headers: user-id: <userId>
Body: {
  "status": "pending|in_progress|completed|failed",
  "priority": "low|medium|high|urgent"
}
```

#### Execute Agent Task
```
POST /api/sub-agents/:agentId/tasks/:taskId/execute
Headers: user-id: <userId>
Body: {
  "childId": "string"
}
```

### Insights and Recommendations

#### Get Agent Insights
```
GET /api/sub-agents/:agentId/insights?childId=string&limit=20
Headers: user-id: <userId>
```

#### Generate Agent Insights
```
POST /api/sub-agents/:agentId/insights/generate
Headers: user-id: <userId>
Body: {
  "childId": "string"
}
```

#### Get Agent Recommendations
```
GET /api/sub-agents/:agentId/recommendations?childId=string&status=pending
Headers: user-id: <userId>
```

#### Generate Agent Recommendations
```
POST /api/sub-agents/:agentId/recommendations/generate
Headers: user-id: <userId>
Body: {
  "childId": "string"
}
```

### Performance and Monitoring

#### Get Agent Performance Metrics
```
GET /api/sub-agents/:agentId/performance
Headers: user-id: <userId>
```

#### Get Service Status
```
GET /api/sub-agents/service/status
Headers: user-id: <userId>
```

### Training Management

#### Start Agent Training
```
POST /api/sub-agents/:agentId/train/start
Headers: user-id: <userId>
```

#### Complete Agent Training
```
POST /api/sub-agents/:agentId/train/complete
Headers: user-id: <userId>
```

## Configuration

### Service Configuration

The Sub-Agent Service Core can be configured with the following options:

```typescript
interface SubAgentServiceConfig {
  maxConcurrentAgents?: number;        // Default: 10
  enableAgentCommunication?: boolean;   // Default: true
  enableCrossAgentLearning?: boolean;   // Default: true
  defaultAgentTimeout?: number;         // Default: 30000ms
}
```

### Agent Communication Message

```typescript
interface AgentCommunicationMessage {
  fromAgentId: string;
  toAgentId: string;
  messageType: 'request' | 'response' | 'notification';
  content: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
}
```

### Agent Collaboration Result

```typescript
interface AgentCollaborationResult {
  success: boolean;
  participatingAgents: string[];
  combinedResponse: AgentResponse;
  individualResponses: Map<string, AgentResponse>;
}
```

## Usage Examples

### Basic Agent Management

```typescript
import { subAgentService } from './agents/sub-agent-service';

// Create a new agent
const agent = await subAgentService.createSubAgent(
  userId,
  agentTypeId,
  'Learning Coach Agent',
  'Specialized in educational guidance',
  { learningStyle: 'visual', subjects: ['math', 'science'] }
);

// Process a message with the agent
const response = await subAgentService.processMessageWithAgent(
  agent.id,
  userId,
  childId,
  'My child is struggling with math homework'
);

// Get agent insights
const insights = await subAgentService.generateAgentInsights(
  agent.id,
  userId,
  childId
);
```

### Multi-Agent Collaboration

```typescript
// Collaborate with multiple agents
const collaboration = await subAgentService.collaborateWithMultipleAgents(
  userId,
  childId,
  'Create a comprehensive learning plan',
  ['learning-coach-agent', 'development-tracker-agent', 'enrichment-agent']
);

console.log('Combined response:', collaboration.combinedResponse);
console.log('Participating agents:', collaboration.participatingAgents);
```

### Inter-Agent Communication

```typescript
// Send a message from one agent to another
await subAgentService.sendAgentMessage(
  'learning-coach-agent',
  'development-tracker-agent',
  'request',
  {
    requestType: 'get_development_data',
    childId: childId,
    timeRange: 'last_30_days'
  },
  'high'
);
```

### Performance Monitoring

```typescript
// Get performance metrics for an agent
const metrics = await subAgentService.getAgentPerformanceMetrics(agentId);

console.log('Task completion rate:', metrics.completionRate);
console.log('Total insights generated:', metrics.totalInsights);
console.log('Active tasks:', metrics.pendingTasks);
```

## Error Handling

The service includes comprehensive error handling:

- **Agent not found**: Returns 404 with appropriate error message
- **Invalid configuration**: Returns 400 with validation details
- **Processing errors**: Returns 500 with error context
- **Authentication errors**: Returns 401 for missing user ID
- **Resource limits**: Returns 429 when concurrent agent limit exceeded

## Security Considerations

1. **User Authentication**: All endpoints require user ID in headers
2. **Agent Isolation**: Agents can only access data for their assigned user
3. **Input Validation**: All inputs are validated before processing
4. **Error Sanitization**: Error messages don't expose sensitive information
5. **Resource Limits**: Configurable limits prevent resource exhaustion

## Performance Optimizations

1. **Agent Caching**: Active agents are cached in memory
2. **Connection Pooling**: Database connections are reused
3. **Async Processing**: All operations are non-blocking
4. **Batch Operations**: Multiple operations can be batched
5. **Resource Cleanup**: Automatic cleanup of inactive agents

## Monitoring and Logging

1. **Performance Metrics**: Track agent response times and success rates
2. **Communication Logs**: Log all inter-agent communications
3. **Error Tracking**: Comprehensive error logging with context
4. **Resource Usage**: Monitor memory and CPU usage
5. **Service Health**: Health check endpoints for monitoring

## Future Enhancements

1. **Agent Learning**: Implement cross-agent learning capabilities
2. **Advanced Routing**: AI-powered message routing
3. **Agent Specialization**: Dynamic agent capability adjustment
4. **Scalability**: Horizontal scaling support
5. **Real-time Communication**: WebSocket support for real-time updates

## Integration with Existing System

The Sub-Agent Service Core integrates seamlessly with the existing ParentPilot.AI architecture:

- **Database Integration**: Uses existing database schema and services
- **Agent Types**: Compatible with existing agent type system
- **User Management**: Integrates with user authentication system
- **Child Data**: Accesses child profiles and learning data
- **Activity Logs**: Logs agent activities for audit trails

This service provides a robust foundation for managing complex multi-agent interactions while maintaining security, performance, and scalability. 