# Multi-Agent System Interfaces

This document describes the new multi-agent system interfaces that extend the existing agent architecture to support more sophisticated task processing with specialized sub-agents.

## Overview

The new interfaces support a three-tier agent system:
1. **Dispatcher** - Routes and categorizes incoming tasks
2. **Analyst** - Analyzes and processes task content
3. **Scheduler** - Manages task execution and timing

## Interface Definitions

### AgentResponse
Standard response format for all agent operations with cost and performance tracking.

```typescript
export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokens_used?: number;
  execution_time_ms?: number;
  cost_cents?: number;
}
```

### TaskResult
Complete result from a processed task including all sub-agent outputs.

```typescript
export interface TaskResult {
  task_id: string;
  status: 'completed' | 'failed';
  summary: string;
  dispatcher_result: any;
  analyst_result: any;
  scheduler_result: any;
  total_cost_cents: number;
  processing_time_ms: number;
}
```

### SubAgentTask
Individual task data structure for the multi-agent system.

```typescript
export interface SubAgentTask {
  id: string;
  user_id: string;
  child_id?: string;
  raw_input: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'processing' | 'completed' | 'failed';
  dispatcher_result?: any;
  analyst_result?: any;
  scheduler_result?: any;
  processing_time_ms?: number;
  total_cost_cents?: number;
  created_at: string;
  updated_at: string;
}
```

### ProcessTaskRequest
Request format for processing new tasks.

```typescript
export interface ProcessTaskRequest {
  raw_input: string;
  child_id?: string;
  priority?: 'low' | 'medium' | 'high';
}
```

## Integration with Existing System

### Current vs New Architecture

**Current System:**
- Single agent per task type (Learning Coach, Development Tracker)
- Direct agent-to-task mapping
- Simple AgentResponse with success/message/data

**New Multi-Agent System:**
- Three specialized sub-agents per task
- Dispatcher → Analyst → Scheduler pipeline
- Enhanced tracking with cost and performance metrics

### Migration Strategy

1. **Phase 1**: Implement new interfaces alongside existing system
2. **Phase 2**: Create adapter layer to bridge old and new systems
3. **Phase 3**: Gradually migrate tasks to new multi-agent system
4. **Phase 4**: Deprecate old single-agent approach

### Database Schema Considerations

The new system may require additional database tables:

```sql
-- New table for multi-agent tasks
CREATE TABLE multi_agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  child_id UUID REFERENCES children(id),
  raw_input TEXT NOT NULL,
  category VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'processing',
  dispatcher_result JSONB,
  analyst_result JSONB,
  scheduler_result JSONB,
  processing_time_ms INTEGER,
  total_cost_cents INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Usage Examples

### Processing a New Task

```typescript
import { ProcessTaskRequest, TaskResult } from '../types/agent-interfaces';

const request: ProcessTaskRequest = {
  raw_input: "My child is struggling with math homework",
  child_id: "child-uuid",
  priority: "high"
};

// Process through multi-agent system
const result: TaskResult = await processTask(request);
```

### Handling Agent Responses

```typescript
import { AgentResponse } from '../types/agent-interfaces';

const response: AgentResponse = await dispatcherAgent.process(input);

if (response.success) {
  console.log(`Processed in ${response.execution_time_ms}ms`);
  console.log(`Cost: $${response.cost_cents / 100}`);
} else {
  console.error(`Error: ${response.error}`);
}
```

## Cost Tracking

The new system includes comprehensive cost tracking:

- **tokens_used**: Number of AI tokens consumed
- **execution_time_ms**: Processing time in milliseconds
- **cost_cents**: Cost in cents (1/100th of a dollar)

This enables better resource management and billing integration.

## Performance Monitoring

Key metrics to track:

1. **Processing Time**: Total time from request to completion
2. **Cost per Task**: Average cost across different task types
3. **Success Rate**: Percentage of successful task completions
4. **Sub-agent Performance**: Individual performance of dispatcher, analyst, scheduler

## Next Steps

1. Implement the three sub-agent classes (DispatcherAgent, AnalystAgent, SchedulerAgent)
2. Create the task processing pipeline
3. Add database migrations for new tables
4. Implement cost tracking and billing integration
5. Add monitoring and analytics dashboard 