import { dbService } from '../database/config';
import { env, features } from '../config/env';
import { SubAgent, AgentTask, AgentInsight, AgentRecommendation, Child } from '../database/types';

export interface AgentContext {
  userId: string;
  childId?: string;
  child?: Child;
  user?: any;
  conversationHistory?: any[];
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  tasks?: AgentTask[];
  insights?: AgentInsight[];
  recommendations?: AgentRecommendation[];
}

export interface AgentCapability {
  name: string;
  description: string;
  enabled: boolean;
}

export abstract class BaseAgent {
  protected agent: SubAgent;
  protected context: AgentContext;
  protected capabilities: AgentCapability[];

  constructor(agent: SubAgent, context: AgentContext) {
    this.agent = agent;
    this.context = context;
    this.capabilities = this.initializeCapabilities();
  }

  abstract initializeCapabilities(): AgentCapability[];
  abstract processMessage(message: string): Promise<AgentResponse>;
  abstract generateInsights(): Promise<AgentInsight[]>;
  abstract generateRecommendations(): Promise<AgentRecommendation[]>;
  abstract executeTask(taskId: string): Promise<AgentResponse>;

  // Common methods for all agents
  async getChildData(): Promise<Child | null> {
    if (!this.context.childId) return null;
    
    try {
      return await dbService.getChildById(this.context.childId);
    } catch (error) {
      console.error('Error getting child data:', error);
      return null;
    }
  }

  async getUserData(): Promise<any | null> {
    try {
      return await dbService.getUserById(this.context.userId);
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async createTask(taskData: {
    task_type: string;
    title: string;
    description?: string;
    priority?: string;
    due_date?: string;
  }): Promise<AgentTask | null> {
    if (!this.context.childId) return null;

    try {
      return await dbService.createAgentTask(
        this.agent.id,
        this.context.childId,
        taskData
      );
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  async createInsight(insightData: {
    insight_type: string;
    title: string;
    content: string;
    confidence_score?: number;
    data_sources?: any;
  }): Promise<AgentInsight | null> {
    if (!this.context.childId) return null;

    try {
      return await dbService.createAgentInsight(
        this.agent.id,
        this.context.childId,
        insightData
      );
    } catch (error) {
      console.error('Error creating insight:', error);
      return null;
    }
  }

  async createRecommendation(recommendationData: {
    recommendation_type: string;
    title: string;
    description: string;
    action_items?: any;
    priority?: string;
  }): Promise<AgentRecommendation | null> {
    if (!this.context.childId) return null;

    try {
      return await dbService.createAgentRecommendation(
        this.agent.id,
        this.context.childId,
        recommendationData
      );
    } catch (error) {
      console.error('Error creating recommendation:', error);
      return null;
    }
  }

  async updateTask(taskId: string, updates: any): Promise<AgentTask | null> {
    try {
      return await dbService.updateAgentTask(taskId, updates);
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  async getTasks(status?: string): Promise<AgentTask[]> {
    try {
      return await dbService.getAgentTasks(this.agent.id, status);
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async getInsights(limit = 20): Promise<AgentInsight[]> {
    try {
      return await dbService.getAgentInsights(this.agent.id, this.context.childId, limit);
    } catch (error) {
      console.error('Error getting insights:', error);
      return [];
    }
  }

  async getRecommendations(status?: string): Promise<AgentRecommendation[]> {
    try {
      return await dbService.getAgentRecommendations(this.agent.id, this.context.childId, status);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  async logConversation(messages: any[], context?: any): Promise<void> {
    try {
      await dbService.createAgentConversation(
        this.agent.id,
        this.context.userId,
        messages,
        context
      );
    } catch (error) {
      console.error('Error logging conversation:', error);
    }
  }

  async logLearningData(dataType: string, dataContent: any, metadata?: any): Promise<void> {
    try {
      await dbService.supabase
        .from('agent_learning_data')
        .insert({
          sub_agent_id: this.agent.id,
          data_type: dataType,
          data_content: dataContent,
          metadata
        });
    } catch (error) {
      console.error('Error logging learning data:', error);
    }
  }

  getCapabilities(): AgentCapability[] {
    return this.capabilities;
  }

  isCapabilityEnabled(capabilityName: string): boolean {
    const capability = this.capabilities.find(c => c.name === capabilityName);
    return capability?.enabled || false;
  }

  protected async callAI(prompt: string, systemMessage?: string): Promise<string> {
    const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

    if (!features.claude) {
      throw new Error('Claude API key not configured');
    }

    const messages = [];
    
    if (systemMessage) {
      messages.push({ role: 'system', content: systemMessage });
    }

    messages.push({ role: 'user', content: prompt });

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.CLAUDE_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`AI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  protected getAgentContext(): string {
    const context = [];
    
    if (this.context.child) {
      context.push(`Child: ${this.context.child.name} (${this.context.child.age} years old)`);
      if (this.context.child.interests?.length) {
        context.push(`Interests: ${this.context.child.interests.join(', ')}`);
      }
      if (this.context.child.strengths?.length) {
        context.push(`Strengths: ${this.context.child.strengths.join(', ')}`);
      }
    }

    if (this.context.user) {
      context.push(`Parent: ${this.context.user.name}`);
    }

    return context.join('. ');
  }
} 