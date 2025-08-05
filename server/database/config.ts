import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';
import { env, features } from '../config/env';

// Create Supabase client with validated environment variables
export const supabase: SupabaseClient<Database> = createClient<Database>(
  env.SUPABASE_URL || 'https://placeholder.supabase.co',
  env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Database utility functions
export class DatabaseService {
  private client: SupabaseClient<Database>;

  constructor() {
    this.client = supabase;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // If we don't have proper credentials, return false
      if (!features.supabase) {
        return false;
      }
      
      const { data, error } = await this.client
        .from('users')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Get user by ID
  async getUserById(userId: string) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data;
  }

  // Get children by user ID
  async getChildrenByUserId(userId: string) {
    const { data, error } = await this.client
      .from('children')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to get children: ${error.message}`);
    }

    return data;
  }

  // Get child by ID
  async getChildById(childId: string) {
    const { data, error } = await this.client
      .from('children')
      .select('*')
      .eq('id', childId)
      .single();

    if (error) {
      throw new Error(`Failed to get child: ${error.message}`);
    }

    return data;
  }

  // Get sub-agents by user ID
  async getSubAgentsByUserId(userId: string) {
    const { data, error } = await this.client
      .from('sub_agents')
      .select(`
        *,
        agent_types (
          name,
          description,
          capabilities
        )
      `)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to get sub-agents: ${error.message}`);
    }

    return data;
  }

  // Get agent types
  async getAgentTypes() {
    const { data, error } = await this.client
      .from('agent_types')
      .select('*')
      .eq('is_active', true);

    if (error) {
      throw new Error(`Failed to get agent types: ${error.message}`);
    }

    return data;
  }

  // Create sub-agent
  async createSubAgent(userId: string, agentTypeId: string, name: string, description?: string, configuration?: any) {
    const { data, error } = await this.client
      .from('sub_agents')
      .insert({
        user_id: userId,
        agent_type_id: agentTypeId,
        name,
        description,
        configuration,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create sub-agent: ${error.message}`);
    }

    return data;
  }

  // Update sub-agent
  async updateSubAgent(agentId: string, updates: Partial<Database['public']['Tables']['sub_agents']['Update']>) {
    const { data, error } = await this.client
      .from('sub_agents')
      .update(updates)
      .eq('id', agentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update sub-agent: ${error.message}`);
    }

    return data;
  }

  // Get agent conversations
  async getAgentConversations(agentId: string, limit = 50) {
    const { data, error } = await this.client
      .from('agent_conversations')
      .select('*')
      .eq('sub_agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get agent conversations: ${error.message}`);
    }

    return data;
  }

  // Create agent conversation
  async createAgentConversation(agentId: string, userId: string, messages: any[], context?: any) {
    const { data, error } = await this.client
      .from('agent_conversations')
      .insert({
        sub_agent_id: agentId,
        user_id: userId,
        messages,
        context
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create agent conversation: ${error.message}`);
    }

    return data;
  }

  // Get agent tasks
  async getAgentTasks(agentId: string, status?: string) {
    let query = this.client
      .from('agent_tasks')
      .select('*')
      .eq('sub_agent_id', agentId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get agent tasks: ${error.message}`);
    }

    return data;
  }

  // Create agent task
  async createAgentTask(agentId: string, childId: string, taskData: {
    task_type: string;
    title: string;
    description?: string;
    priority?: string;
    due_date?: string;
  }) {
    const { data, error } = await this.client
      .from('agent_tasks')
      .insert({
        sub_agent_id: agentId,
        child_id: childId,
        ...taskData,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create agent task: ${error.message}`);
    }

    return data;
  }

  // Update agent task
  async updateAgentTask(taskId: string, updates: Partial<Database['public']['Tables']['agent_tasks']['Update']>) {
    const { data, error } = await this.client
      .from('agent_tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update agent task: ${error.message}`);
    }

    return data;
  }

  // Get agent insights
  async getAgentInsights(agentId: string, childId?: string, limit = 20) {
    let query = this.client
      .from('agent_insights')
      .select('*')
      .eq('sub_agent_id', agentId);

    if (childId) {
      query = query.eq('child_id', childId);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to get agent insights: ${error.message}`);
    }

    return data;
  }

  // Create agent insight
  async createAgentInsight(agentId: string, childId: string, insightData: {
    insight_type: string;
    title: string;
    content: string;
    confidence_score?: number;
    data_sources?: any;
  }) {
    const { data, error } = await this.client
      .from('agent_insights')
      .insert({
        sub_agent_id: agentId,
        child_id: childId,
        ...insightData
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create agent insight: ${error.message}`);
    }

    return data;
  }

  // Get agent recommendations
  async getAgentRecommendations(agentId: string, childId?: string, status?: string) {
    let query = this.client
      .from('agent_recommendations')
      .select('*')
      .eq('sub_agent_id', agentId);

    if (childId) {
      query = query.eq('child_id', childId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get agent recommendations: ${error.message}`);
    }

    return data;
  }

  // Create agent recommendation
  async createAgentRecommendation(agentId: string, childId: string, recommendationData: {
    recommendation_type: string;
    title: string;
    description: string;
    action_items?: any;
    priority?: string;
  }) {
    const { data, error } = await this.client
      .from('agent_recommendations')
      .insert({
        sub_agent_id: agentId,
        child_id: childId,
        ...recommendationData,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create agent recommendation: ${error.message}`);
    }

    return data;
  }

  // Update agent recommendation
  async updateAgentRecommendation(recommendationId: string, updates: Partial<Database['public']['Tables']['agent_recommendations']['Update']>) {
    const { data, error } = await this.client
      .from('agent_recommendations')
      .update(updates)
      .eq('id', recommendationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update agent recommendation: ${error.message}`);
    }

    return data;
  }
}

// Export singleton instance
export const dbService = new DatabaseService(); 