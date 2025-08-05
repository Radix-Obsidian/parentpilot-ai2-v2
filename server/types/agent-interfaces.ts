export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokens_used?: number;
  execution_time_ms?: number;
  cost_cents?: number;
}

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

export interface ProcessTaskRequest {
  raw_input: string;
  child_id?: string;
  priority?: 'low' | 'medium' | 'high';
} 