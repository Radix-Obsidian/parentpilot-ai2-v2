# ParentPilot.AI - Agent System Architecture

## Overview

ParentPilot.AI features a sophisticated multi-agent system designed to provide comprehensive parenting and educational support. The system consists of specialized sub-agents that work together to deliver personalized guidance, insights, and recommendations.

## Agent System Architecture

### Core Components

1. **Sub-Agent Service Core** - Central orchestration service for managing all sub-agents
2. **BaseAgent** - Abstract base class providing common functionality for all agents
3. **AgentManager** - Handles agent lifecycle and basic operations
4. **AgentFactory** - Creates and manages agent instances
5. **Specialized Agents** - Domain-specific agents for different aspects of child development

### Sub-Agent Service Core

The Sub-Agent Service Core (`server/agents/sub-agent-service.ts`) is the central nervous system of the agent architecture, providing:

- **Agent Lifecycle Management**: Creation, initialization, updates, and deactivation
- **Inter-Agent Communication**: Message routing and direct agent-to-agent communication
- **Multi-Agent Collaboration**: Coordinated responses from multiple agents
- **Task Management**: Creating, executing, and monitoring agent tasks
- **Performance Monitoring**: Metrics collection and capability management
- **Insights & Recommendations**: Generating and managing agent outputs

#### Key Features:
- **Unified API**: Single interface for all agent operations
- **Agent Communication**: Inter-agent messaging system
- **Collaboration Engine**: Multi-agent task coordination
- **Performance Tracking**: Comprehensive metrics and monitoring
- **Capability Management**: Dynamic agent capability adjustment
- **Resource Management**: Active agent caching and cleanup

#### API Endpoints:
- `/api/sub-agents` - Agent management
- `/api/sub-agents/:agentId/process` - Message processing
- `/api/sub-agents/collaborate` - Multi-agent collaboration
- `/api/sub-agents/:agentId/capabilities` - Capability management
- `/api/sub-agents/:agentId/performance` - Performance metrics

### Specialized Agents

#### 1. Learning Coach Agent (`server/agents/learning-coach.ts`)
**Purpose**: Educational guidance and homework assistance
**Capabilities**:
- Homework help and study strategies
- Subject-specific tutoring
- Learning style adaptation
- Motivation and engagement techniques
- Progress tracking and assessment

#### 2. Development Tracker Agent (`server/agents/development-tracker.ts`)
**Purpose**: Child development monitoring and milestone tracking
**Capabilities**:
- Developmental milestone assessment
- Progress tracking across domains
- Early intervention identification
- Growth pattern analysis
- Development recommendations

#### 3. Base Agent (`server/agents/base-agent.ts`)
**Purpose**: Common functionality and abstract base class
**Capabilities**:
- AI communication interface
- Database operations
- Task and insight creation
- Context management
- Learning data logging

## Agent Communication System

### Inter-Agent Messaging
Agents can communicate directly with each other using the messaging system:

```typescript
// Send message between agents
await subAgentService.sendAgentMessage(
  'learning-coach-agent',
  'development-tracker-agent',
  'request',
  { requestType: 'get_development_data', childId: 'child-123' },
  'high'
);
```

### Multi-Agent Collaboration
Complex tasks can be handled by multiple agents working together:

```typescript
// Collaborate with multiple agents
const collaboration = await subAgentService.collaborateWithMultipleAgents(
  userId,
  childId,
  'Create comprehensive learning plan',
  ['learning-coach-agent', 'development-tracker-agent']
);
```

## Agent Lifecycle Management

### Creation and Initialization
```typescript
// Create a new agent
const agent = await subAgentService.createSubAgent(
  userId,
  agentTypeId,
  'Learning Coach Agent',
  'Specialized in educational guidance',
  { learningStyle: 'visual', subjects: ['math', 'science'] }
);
```

### Capability Management
```typescript
// Get agent capabilities
const capabilities = await subAgentService.getAgentCapabilities(agentId, userId);

// Update capability
await subAgentService.updateAgentCapability(agentId, 'homework_help', true);
```

### Performance Monitoring
```typescript
// Get performance metrics
const metrics = await subAgentService.getAgentPerformanceMetrics(agentId);
console.log(`Completion rate: ${metrics.completionRate}%`);
```

## Task Management System

### Creating Tasks
```typescript
// Create a task for an agent
const task = await subAgentService.createAgentTask(
  agentId,
  childId,
  {
    task_type: 'homework_assistance',
    title: 'Create fraction practice exercises',
    description: 'Generate age-appropriate exercises',
    priority: 'high',
    due_date: new Date().toISOString()
  }
);
```

### Task Execution
```typescript
// Execute a task
const response = await subAgentService.executeAgentTask(
  agentId,
  taskId,
  userId,
  childId
);
```

## Insights and Recommendations

### Generating Insights
```typescript
// Generate insights
const insights = await subAgentService.generateAgentInsights(
  agentId,
  userId,
  childId
);
```

### Creating Recommendations
```typescript
// Generate recommendations
const recommendations = await subAgentService.generateAgentRecommendations(
  agentId,
  userId,
  childId
);
```

## Configuration and Customization

### Service Configuration
```typescript
interface SubAgentServiceConfig {
  maxConcurrentAgents?: number;        // Default: 10
  enableAgentCommunication?: boolean;   // Default: true
  enableCrossAgentLearning?: boolean;   // Default: true
  defaultAgentTimeout?: number;         // Default: 30000ms
}
```

### Agent Configuration
Each agent can be configured with specific parameters:
- Learning styles and preferences
- Subject expertise areas
- Communication styles
- Response priorities
- Specialization domains

## Security and Performance

### Security Features
- User authentication and authorization
- Agent isolation and data privacy
- Input validation and sanitization
- Resource limits and rate limiting
- Secure inter-agent communication

### Performance Optimizations
- Agent caching in memory
- Database connection pooling
- Async processing for all operations
- Batch operations support
- Automatic resource cleanup

## Monitoring and Logging

### Performance Metrics
- Task completion rates
- Response times
- Success/failure ratios
- Resource usage
- Agent activity levels

### Communication Logging
- Inter-agent message tracking
- User interaction logs
- Error tracking and debugging
- Audit trails for compliance

## Integration with ParentPilot.AI

The agent system integrates seamlessly with the broader ParentPilot.AI platform:

- **Database Integration**: Uses existing schema and services
- **User Management**: Integrates with authentication system
- **Child Profiles**: Accesses child data and learning history
- **Activity Logs**: Tracks all agent activities
- **Recommendations**: Feeds into the recommendation engine

## Future Enhancements

### Planned Features
1. **Advanced Learning**: Cross-agent learning capabilities
2. **AI-Powered Routing**: Intelligent message routing
3. **Dynamic Specialization**: Adaptive agent capabilities
4. **Real-time Communication**: WebSocket support
5. **Scalability**: Horizontal scaling support

### Research Areas
- Agent personality development
- Emotional intelligence integration
- Predictive analytics
- Personalized learning paths
- Collaborative problem-solving

## Documentation

For detailed API documentation and usage examples, see:
- `server/SUB_AGENT_SERVICE_CORE.md` - Comprehensive service documentation
- `server/test-sub-agent-service.ts` - Usage examples and demonstrations
- `server/routes/sub-agents.ts` - API endpoint implementations

## Development

### Running the Agent System
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm test          # Run tests
```

### Testing the Agent System
```bash
# Run the demonstration
node server/test-sub-agent-service.ts
```

The agent system provides a robust, scalable foundation for delivering personalized parenting and educational support through intelligent, coordinated AI agents.

## Tech Stack

- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

#### Example API Routes
- `GET /api/ping` - Simple ping api
- `GET /api/demo` - Demo endpoint  

### Shared Types
Import consistent types in both client and server:
```typescript
import { DemoResponse } from '@shared/api';
```

Path aliases:
- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test          # Run Vitest tests
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route
1. **Optional**: Create a shared interface in `shared/api.ts`:
```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `server/routes/my-route.ts`:
```typescript
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: 'Hello from my endpoint!'
  };
  res.json(response);
};
```

3. Register the route in `server/index.ts`:
```typescript
import { handleMyRoute } from "./routes/my-route";

// Add to the createServer function:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Use in React components with type safety:
```typescript
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
```

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `npm run build` + `npm start`
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces
