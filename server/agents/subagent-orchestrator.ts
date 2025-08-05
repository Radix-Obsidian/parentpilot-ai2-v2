import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { AgentResponse, TaskResult } from '../types/subagents';
import { dbService } from '../database/config';

export class SubAgentOrchestrator {
  private anthropic: Anthropic;
  private supabase: any;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || 'placeholder',
    });
    
    // Only create Supabase client if environment variables are available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );
    } else {
      this.supabase = null;
    }
  }

  async executeDispatcher(rawInput: string): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `You are a parenting task classifier. Analyze this content and respond ONLY in valid JSON:

{
  "category": "School Form|Activity Registration|Appointment|Bill Payment|General Info",
  "urgency": "Low|Medium|High", 
  "deadline": "YYYY-MM-DD or null",
  "organization": "Organization name or null",
  "confidence": 0.0-1.0,
  "key_points": ["array", "of", "main", "points"]
}

Content: ${rawInput}`
        }]
      });

      const executionTime = Date.now() - startTime;
      const result = JSON.parse(response.content[0].type === 'text' ? response.content[0].text : '');
      const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;
      const costCents = Math.ceil((tokensUsed / 1000) * 0.25);

      return {
        success: true,
        data: result,
        tokens_used: tokensUsed,
        execution_time_ms: executionTime,
        cost_cents: costCents,
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        execution_time_ms: Date.now() - startTime,
      };
    }
  }

  async executeAnalyst(rawInput: string, category: string): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Extract structured data from this ${category}. Respond ONLY in valid JSON:

{
  "child_name": "Name if mentioned or null",
  "activity_name": "Activity/event name",
  "cost": "Cost amount or null",
  "deadline": "YYYY-MM-DD or null",
  "start_date": "YYYY-MM-DD or null", 
  "location": "Address/location",
  "required_fields": ["form", "fields", "needed"],
  "contact_info": "Phone/email",
  "registration_url": "URL or null",
  "special_notes": "Requirements/notes"
}

Content: ${rawInput}`
        }]
      });

      const executionTime = Date.now() - startTime;
      const result = JSON.parse(response.content[0].type === 'text' ? response.content[0].text : '');
      const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;
      const costCents = Math.ceil((tokensUsed / 1000) * 3.0);

      return {
        success: true,
        data: result,
        tokens_used: tokensUsed,
        execution_time_ms: executionTime,
        cost_cents: costCents,
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        execution_time_ms: Date.now() - startTime,
      };
    }
  }

  async executeScheduler(extractedData: any, childName?: string): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const events = [];

      if (extractedData.start_date && extractedData.activity_name) {
        events.push({
          title: `${childName ? childName + ' - ' : ''}${extractedData.activity_name}`,
          date: extractedData.start_date,
          type: 'activity',
          location: extractedData.location,
        });
      }

      if (extractedData.deadline) {
        const deadlineDate = new Date(extractedData.deadline);
        const reminderDate = new Date(deadlineDate);
        reminderDate.setDate(deadlineDate.getDate() - 3);

        events.push({
          title: `Reminder: ${extractedData.activity_name || 'Task'} Due Soon`,
          date: reminderDate.toISOString().split('T')[0],
          type: 'reminder',
          notes: `Deadline: ${extractedData.deadline}`,
        });
      }

      const result = {
        events_created: events.length,
        events: events,
        calendar_summary: `Created ${events.length} calendar events`,
      };

      return {
        success: true,
        data: result,
        execution_time_ms: Date.now() - startTime,
        cost_cents: 0,
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        execution_time_ms: Date.now() - startTime,
      };
    }
  }

  async processTask(userId: string, rawInput: string, childId?: string): Promise<TaskResult> {
    const taskStartTime = Date.now();

    // Create task record using existing database service
    const taskData = {
      task_type: 'subagent_orchestration',
      title: 'Process Parenting Task',
      description: `Processing: ${rawInput.substring(0, 100)}...`,
      priority: 'medium' as const,
    };

    const task = await dbService.createAgentTask(
      'subagent-orchestrator', // Use a special agent ID for the orchestrator
      childId || 'system',
      taskData
    );

    if (!task) throw new Error('Task creation failed');

    let totalCost = 0;

    try {
      // Get child name if available
      let childName = null;
      if (childId) {
        const child = await dbService.getChildById(childId);
        childName = child?.name;
      }

      // Execute agents in sequence
      const dispatcherResult = await this.executeDispatcher(rawInput);
      if (!dispatcherResult.success) throw new Error(`Dispatcher failed: ${dispatcherResult.error}`);
      totalCost += dispatcherResult.cost_cents || 0;

      const analystResult = await this.executeAnalyst(rawInput, dispatcherResult.data.category);
      if (!analystResult.success) throw new Error(`Analyst failed: ${analystResult.error}`);
      totalCost += analystResult.cost_cents || 0;

      const schedulerResult = await this.executeScheduler(analystResult.data, childName);
      totalCost += schedulerResult.cost_cents || 0;

      // Update task with results
      const processingTime = Date.now() - taskStartTime;
      await dbService.updateAgentTask(task.id, {
        status: 'completed',
        result_data: {
          dispatcher_result: dispatcherResult.data,
          analyst_result: analystResult.data,
          scheduler_result: schedulerResult.data,
          processing_time_ms: processingTime,
          total_cost_cents: totalCost,
        },
        completed_at: new Date().toISOString(),
      });

      // Log agent executions
      await this.logAgentExecutions(task.id, [
        { agent_name: 'dispatcher', ...dispatcherResult },
        { agent_name: 'analyst', ...analystResult },
        { agent_name: 'scheduler', ...schedulerResult },
      ]);

      return {
        task_id: task.id,
        status: 'completed',
        summary: this.generateSummary(dispatcherResult.data, analystResult.data, schedulerResult.data),
        dispatcher_result: dispatcherResult.data,
        analyst_result: analystResult.data,
        scheduler_result: schedulerResult.data,
        total_cost_cents: totalCost,
        processing_time_ms: processingTime,
      };

    } catch (error) {
      await dbService.updateAgentTask(task.id, { 
        status: 'failed',
        result_data: { error: error.message }
      });
      
      throw error;
    }
  }

  private async logAgentExecutions(taskId: string, logs: any[]): Promise<void> {
    try {
      // Only log if Supabase is available
      if (this.supabase) {
        // Log to agent_learning_data table
        for (const log of logs) {
          await this.supabase
            .from('agent_learning_data')
            .insert({
              sub_agent_id: 'subagent-orchestrator',
              data_type: 'execution_log',
              data_content: log,
              metadata: { task_id: taskId }
            });
        }
      }
    } catch (error) {
      console.error('Error logging agent executions:', error);
    }
  }

  private generateSummary(dispatcher: any, analyst: any, scheduler: any): string {
    const category = dispatcher.category || 'Task';
    const cost = analyst.cost ? ` (${analyst.cost})` : '';
    const events = scheduler.events_created || 0;
    const deadline = analyst.deadline ? ` - Due ${analyst.deadline}` : '';
    
    return `${category} processed${cost}${deadline} - ${events} calendar events created`;
  }
} 