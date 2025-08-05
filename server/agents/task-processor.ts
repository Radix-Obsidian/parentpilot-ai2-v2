import { v4 as uuidv4 } from 'uuid';
import { DispatcherAgent } from './dispatcher-agent';
import { AnalystAgent } from './analyst-agent';
import { SchedulerAgent } from './scheduler-agent';
import { ITaskProcessor, TaskInput, MultiAgentTask, CostTracking } from './interfaces';
import { AgentContext } from './base-agent';
import { dbService } from '../database/config';

export class TaskProcessor implements ITaskProcessor {
  private dispatcherAgent: DispatcherAgent;
  private analystAgent: AnalystAgent;
  private schedulerAgent: SchedulerAgent;

  constructor(context: AgentContext) {
    this.dispatcherAgent = new DispatcherAgent(context);
    this.analystAgent = new AnalystAgent(context);
    this.schedulerAgent = new SchedulerAgent(context);
  }

  async processTask(input: TaskInput): Promise<MultiAgentTask> {
    const taskId = uuidv4();
    const startTime = Date.now();
    let totalCostCents = 0;

    try {
      // Create initial task record
      const task: MultiAgentTask = {
        id: taskId,
        userId: input.userId,
        childId: input.childId,
        rawInput: input.rawInput,
        category: input.category,
        priority: input.priority || 'medium',
        status: 'processing',
        totalCostCents: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Step 1: Dispatcher Agent
      console.log(`[TaskProcessor] Starting dispatcher processing for task ${taskId}`);
      const dispatcherStartTime = Date.now();
      const dispatcherResult = await this.dispatcherAgent.processTask(input);
      const dispatcherTime = Date.now() - dispatcherStartTime;
      
      // Track dispatcher cost
      const dispatcherCost = this.calculateCost(dispatcherTime, 'dispatcher');
      totalCostCents += dispatcherCost;
      await this.trackCost(taskId, 'dispatcher', {
        tokensUsed: this.estimateTokens(input.rawInput),
        costCents: dispatcherCost,
        executionTimeMs: dispatcherTime
      });

      task.dispatcherResult = dispatcherResult;
      task.category = dispatcherResult.category;
      task.priority = dispatcherResult.priority;

      // Step 2: Analyst Agent (if required)
      let analystResult = null;
      if (dispatcherResult.requiresAnalysis) {
        console.log(`[TaskProcessor] Starting analyst processing for task ${taskId}`);
        const analystStartTime = Date.now();
        analystResult = await this.analystAgent.analyzeInput(input, dispatcherResult);
        const analystTime = Date.now() - analystStartTime;
        
        // Track analyst cost
        const analystCost = this.calculateCost(analystTime, 'analyst');
        totalCostCents += analystCost;
        await this.trackCost(taskId, 'analyst', {
          tokensUsed: this.estimateTokens(input.rawInput) * 2, // Analyst uses more tokens
          costCents: analystCost,
          executionTimeMs: analystTime
        });

        task.analystResult = analystResult;
      }

      // Step 3: Scheduler Agent (if required)
      let schedulerResult = null;
      if (dispatcherResult.requiresScheduling) {
        console.log(`[TaskProcessor] Starting scheduler processing for task ${taskId}`);
        const schedulerStartTime = Date.now();
        schedulerResult = await this.schedulerAgent.scheduleActions(input, dispatcherResult, analystResult || {
          insights: [],
          patterns: [],
          recommendations: [],
          confidenceScore: 0.5,
          dataSources: []
        });
        const schedulerTime = Date.now() - schedulerStartTime;
        
        // Track scheduler cost
        const schedulerCost = this.calculateCost(schedulerTime, 'scheduler');
        totalCostCents += schedulerCost;
        await this.trackCost(taskId, 'scheduler', {
          tokensUsed: this.estimateTokens(input.rawInput) * 1.5,
          costCents: schedulerCost,
          executionTimeMs: schedulerTime
        });

        task.schedulerResult = schedulerResult;
      }

      // Update task with final results
      task.status = 'completed';
      task.processingTimeMs = Date.now() - startTime;
      task.totalCostCents = totalCostCents;
      task.updatedAt = new Date();

      // Save task to database
      await this.saveTaskToDatabase(task);

      console.log(`[TaskProcessor] Completed task ${taskId} in ${task.processingTimeMs}ms with cost ${totalCostCents} cents`);

      return task;

    } catch (error) {
      console.error(`[TaskProcessor] Error processing task ${taskId}:`, error);
      
      // Update task with error status
      const failedTask: MultiAgentTask = {
        id: taskId,
        userId: input.userId,
        childId: input.childId,
        rawInput: input.rawInput,
        category: input.category,
        priority: input.priority || 'medium',
        status: 'failed',
        totalCostCents,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.saveTaskToDatabase(failedTask);
      throw error;
    }
  }

  async trackCost(taskId: string, agentName: string, costData: Omit<CostTracking, 'taskId' | 'agentName' | 'timestamp'>): Promise<void> {
    try {
      await dbService.supabase
        .from('subagent_logs')
        .insert({
          task_id: taskId,
          agent_name: agentName,
          input_data: {},
          output_data: {},
          execution_time_ms: costData.executionTimeMs,
          tokens_used: costData.tokensUsed,
          cost_cents: costData.costCents,
          status: 'completed',
          created_at: new Date()
        });
    } catch (error) {
      console.error('Error tracking cost:', error);
    }
  }

  async getTaskStatus(taskId: string): Promise<MultiAgentTask | null> {
    try {
      const { data, error } = await dbService.supabase
        .from('subagent_tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) {
        console.error('Error getting task status:', error);
        return null;
      }

      return this.mapDatabaseTaskToMultiAgentTask(data);
    } catch (error) {
      console.error('Error getting task status:', error);
      return null;
    }
  }

  async getTaskHistory(userId: string, limit: number = 20): Promise<MultiAgentTask[]> {
    try {
      const { data, error } = await dbService.supabase
        .from('subagent_tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting task history:', error);
        return [];
      }

      return data.map(task => this.mapDatabaseTaskToMultiAgentTask(task));
    } catch (error) {
      console.error('Error getting task history:', error);
      return [];
    }
  }

  private async saveTaskToDatabase(task: MultiAgentTask): Promise<void> {
    try {
      await dbService.supabase
        .from('subagent_tasks')
        .insert({
          id: task.id,
          user_id: task.userId,
          child_id: task.childId,
          raw_input: task.rawInput,
          category: task.category,
          priority: task.priority,
          status: task.status,
          dispatcher_result: task.dispatcherResult,
          analyst_result: task.analystResult,
          scheduler_result: task.schedulerResult,
          processing_time_ms: task.processingTimeMs,
          total_cost_cents: task.totalCostCents,
          created_at: task.createdAt,
          updated_at: task.updatedAt
        });
    } catch (error) {
      console.error('Error saving task to database:', error);
      throw error;
    }
  }

  private calculateCost(executionTimeMs: number, agentType: string): number {
    // Simple cost calculation based on execution time and agent type
    const baseCostPerMinute = 0.1; // 10 cents per minute
    const agentMultipliers = {
      dispatcher: 1.0,
      analyst: 1.5,
      scheduler: 1.2
    };

    const multiplier = agentMultipliers[agentType as keyof typeof agentMultipliers] || 1.0;
    const minutes = executionTimeMs / 60000;
    const cost = Math.round(minutes * baseCostPerMinute * multiplier * 100); // Convert to cents

    return Math.max(cost, 1); // Minimum 1 cent
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  private mapDatabaseTaskToMultiAgentTask(dbTask: any): MultiAgentTask {
    return {
      id: dbTask.id,
      userId: dbTask.user_id,
      childId: dbTask.child_id,
      rawInput: dbTask.raw_input,
      category: dbTask.category,
      priority: dbTask.priority,
      status: dbTask.status,
      dispatcherResult: dbTask.dispatcher_result,
      analystResult: dbTask.analyst_result,
      schedulerResult: dbTask.scheduler_result,
      processingTimeMs: dbTask.processing_time_ms,
      totalCostCents: dbTask.total_cost_cents,
      createdAt: new Date(dbTask.created_at),
      updatedAt: new Date(dbTask.updated_at)
    };
  }
} 