# SubAgent Orchestrator

The SubAgent Orchestrator is a specialized system that processes parenting tasks through a three-stage pipeline: Dispatcher, Analyst, and Scheduler.

## Overview

The orchestrator takes raw parenting task input (like emails, forms, or text) and processes it through three specialized AI agents:

1. **Dispatcher**: Classifies the task type and urgency
2. **Analyst**: Extracts structured data from the task
3. **Scheduler**: Creates calendar events and reminders

## Architecture

### Components

- **SubAgentOrchestrator**: Main orchestrator class
- **AgentResponse**: Interface for agent responses
- **TaskResult**: Interface for complete task results
- **Routes**: Express.js endpoints for API access

### Database Integration

The orchestrator integrates with the existing agent system using:
- `agent_tasks` table for task tracking
- `agent_learning_data` table for execution logs
- Existing `dbService` for database operations

## API Endpoints

### Process Complete Task
```http
POST /api/subagent-orchestrator/process-task
Content-Type: application/json

{
  "userId": "user123",
  "rawInput": "Soccer registration for my 8-year-old son is due next Friday. Cost is $150.",
  "childId": "child456"
}
```

### Execute Individual Agents

#### Dispatcher Only
```http
POST /api/subagent-orchestrator/dispatcher
Content-Type: application/json

{
  "rawInput": "Soccer registration for my 8-year-old son is due next Friday."
}
```

#### Analyst Only
```http
POST /api/subagent-orchestrator/analyst
Content-Type: application/json

{
  "rawInput": "Soccer registration for my 8-year-old son is due next Friday.",
  "category": "Activity Registration"
}
```

#### Scheduler Only
```http
POST /api/subagent-orchestrator/scheduler
Content-Type: application/json

{
  "extractedData": {
    "activity_name": "Soccer Registration",
    "deadline": "2024-01-15",
    "start_date": "2024-02-01",
    "location": "Community Center"
  },
  "childName": "Alex"
}
```

## Response Formats

### Task Result
```json
{
  "success": true,
  "data": {
    "task_id": "task123",
    "status": "completed",
    "summary": "Activity Registration processed ($150) - Due 2024-01-15 - 2 calendar events created",
    "dispatcher_result": {
      "category": "Activity Registration",
      "urgency": "High",
      "deadline": "2024-01-15",
      "confidence": 0.95
    },
    "analyst_result": {
      "child_name": "Alex",
      "activity_name": "Soccer Registration",
      "cost": "$150",
      "deadline": "2024-01-15",
      "location": "Community Center"
    },
    "scheduler_result": {
      "events_created": 2,
      "events": [
        {
          "title": "Alex - Soccer Registration",
          "date": "2024-02-01",
          "type": "activity",
          "location": "Community Center"
        },
        {
          "title": "Reminder: Soccer Registration Due Soon",
          "date": "2024-01-12",
          "type": "reminder",
          "notes": "Deadline: 2024-01-15"
        }
      ]
    },
    "total_cost_cents": 325,
    "processing_time_ms": 2450
  }
}
```

## Environment Variables

Add these to your `.env` file:

```env
# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Supabase (if not already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Usage Examples

### Basic Task Processing
```javascript
import { SubAgentOrchestrator } from './agents/subagent-orchestrator';

const orchestrator = new SubAgentOrchestrator();

const result = await orchestrator.processTask(
  'user123',
  'Soccer registration for my 8-year-old son is due next Friday. Cost is $150.',
  'child456'
);

console.log(result.summary);
// Output: "Activity Registration processed ($150) - Due 2024-01-15 - 2 calendar events created"
```

### Individual Agent Execution
```javascript
// Execute dispatcher only
const dispatcherResult = await orchestrator.executeDispatcher(
  'Soccer registration for my 8-year-old son is due next Friday.'
);

// Execute analyst with category
const analystResult = await orchestrator.executeAnalyst(
  'Soccer registration for my 8-year-old son is due next Friday.',
  'Activity Registration'
);

// Execute scheduler with extracted data
const schedulerResult = await orchestrator.executeScheduler(
  {
    activity_name: 'Soccer Registration',
    deadline: '2024-01-15',
    start_date: '2024-02-01',
    location: 'Community Center'
  },
  'Alex'
);
```

## Testing

Run the test file to verify integration:

```bash
node server/test-subagent-orchestrator.js
```

## Cost Tracking

The orchestrator tracks costs for each AI model used:
- **Haiku** (Dispatcher): $0.25 per 1K tokens
- **Sonnet** (Analyst): $3.00 per 1K tokens
- **Scheduler**: No cost (local processing)

Total costs are logged in the database and returned in task results.

## Error Handling

The orchestrator includes comprehensive error handling:
- Individual agent failures are caught and logged
- Task status is updated to 'failed' on errors
- Detailed error messages are returned to clients
- Execution time is tracked even for failed operations

## Integration with Existing System

The SubAgent Orchestrator integrates seamlessly with the existing ParentPilot.AI2 system:
- Uses existing database schema and services
- Follows the same agent patterns and conventions
- Logs to existing agent tables
- Compatible with existing authentication and authorization 