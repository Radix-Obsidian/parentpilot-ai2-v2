export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokens_used?: number;
  execution_time_ms: number;
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

export interface DispatcherResult {
  category: 'School Form' | 'Activity Registration' | 'Appointment' | 'Bill Payment' | 'General Info';
  urgency: 'Low' | 'Medium' | 'High';
  deadline: string | null;
  organization: string | null;
  confidence: number;
  key_points: string[];
}

export interface AnalystResult {
  child_name: string | null;
  activity_name: string | null;
  cost: string | null;
  deadline: string | null;
  start_date: string | null;
  location: string | null;
  required_fields: string[];
  contact_info: string | null;
  registration_url: string | null;
  special_notes: string | null;
}

export interface SchedulerResult {
  events_created: number;
  events: CalendarEvent[];
  calendar_summary: string;
}

export interface CalendarEvent {
  title: string;
  date: string;
  type: 'activity' | 'reminder';
  location?: string;
  notes?: string;
} 