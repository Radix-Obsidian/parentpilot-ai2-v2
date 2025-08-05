import { AgentContext, AgentResponse } from './base-agent';

export interface TaskInput {
  rawInput: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  userId: string;
  childId?: string;
  context?: any;
}

export interface TaskResult {
  success: boolean;
  data: any;
  metadata?: {
    processingTimeMs: number;
    tokensUsed: number;
    costCents: number;
  };
}

export interface DispatcherResult {
  category: string;
  priority: 'low' | 'medium' | 'high';
  requiresAnalysis: boolean;
  requiresScheduling: boolean;
  estimatedProcessingTime: number;
  suggestedActions: string[];
}

export interface AnalystResult {
  insights: string[];
  patterns: string[];
  recommendations: string[];
  confidenceScore: number;
  dataSources: string[];
}

export interface SchedulerResult {
  scheduledActions: Array<{
    action: string;
    timeframe: string;
    priority: 'low' | 'medium' | 'high';
    estimatedDuration: number;
  }>;
  timeline: Array<{
    date: string;
    activities: string[];
  }>;
  reminders: Array<{
    type: string;
    message: string;
    dueDate: string;
  }>;
}

export interface MultiAgentTask {
  id: string;
  userId: string;
  childId?: string;
  rawInput: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'processing' | 'completed' | 'failed';
  dispatcherResult?: DispatcherResult;
  analystResult?: AnalystResult;
  schedulerResult?: SchedulerResult;
  processingTimeMs?: number;
  totalCostCents: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CostTracking {
  taskId: string;
  agentName: string;
  tokensUsed: number;
  costCents: number;
  executionTimeMs: number;
  timestamp: Date;
}

export interface IDispatcherAgent {
  processTask(input: TaskInput): Promise<DispatcherResult>;
  categorizeInput(input: string): Promise<string>;
  determinePriority(input: string, category: string): Promise<'low' | 'medium' | 'high'>;
  estimateProcessingTime(category: string, priority: string): Promise<number>;
}

export interface IAnalystAgent {
  analyzeInput(input: TaskInput, dispatcherResult: DispatcherResult): Promise<AnalystResult>;
  extractInsights(input: string, context: AgentContext): Promise<string[]>;
  identifyPatterns(input: string, historicalData: any[]): Promise<string[]>;
  generateRecommendations(insights: string[], patterns: string[]): Promise<string[]>;
}

export interface ISchedulerAgent {
  scheduleActions(
    input: TaskInput, 
    dispatcherResult: DispatcherResult, 
    analystResult: AnalystResult
  ): Promise<SchedulerResult>;
  createTimeline(actions: string[], timeframe: string): Promise<Array<{date: string, activities: string[]}>>;
  generateReminders(actions: string[], timeline: any[]): Promise<Array<{type: string, message: string, dueDate: string}>>;
}

export interface ITaskProcessor {
  processTask(input: TaskInput): Promise<MultiAgentTask>;
  trackCost(taskId: string, agentName: string, costData: Omit<CostTracking, 'taskId' | 'agentName' | 'timestamp'>): Promise<void>;
  getTaskStatus(taskId: string): Promise<MultiAgentTask | null>;
  getTaskHistory(userId: string, limit?: number): Promise<MultiAgentTask[]>;
} 