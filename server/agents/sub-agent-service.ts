import { dbService } from '../database/config';
import { 
  SubAgent, 
  AgentType, 
  AgentTask, 
  AgentInsight, 
  AgentRecommendation, 
  AgentConversation,
  Child,
  User
} from '../database/types';
import { AgentContext, AgentResponse, AgentCapability } from './base-agent';
import { AgentManager } from './agent-manager';
import { agentFactory } from './agent-factory';

export interface SubAgentServiceConfig {
  maxConcurrentAgents?: number;
  enableAgentCommunication?: boolean;
  enableCrossAgentLearning?: boolean;
  defaultAgentTimeout?: number;
}

export interface AgentCommunicationMessage {
  fromAgentId: string;
  toAgentId: string;
  messageType: 'request' | 'response' | 'notification';
  content: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
}

export interface AgentCollaborationResult {
  success: boolean;
  participatingAgents: string[];
  combinedResponse: AgentResponse;
  individualResponses: Map<string, AgentResponse>;
}

export class SubAgentService {
  private static instance: SubAgentService;
  private agentManager: AgentManager;
  private config: SubAgentServiceConfig;
  private activeAgents: Map<string, any> = new Map();
  private agentCommunications: AgentCommunicationMessage[] = [];

  private constructor(config: SubAgentServiceConfig = {}) {
    this.agentManager = AgentManager.getInstance();
    this.config = {
      maxConcurrentAgents: 10,
      enableAgentCommunication: true,
      enableCrossAgentLearning: true,
      defaultAgentTimeout: 30000,
      ...config
    };
  }

  static getInstance(config?: SubAgentServiceConfig): SubAgentService {
    if (!SubAgentService.instance) {
      SubAgentService.instance = new SubAgentService(config);
    }
    return SubAgentService.instance;
  }

  // Core Agent Management
  async createSubAgent(
    userId: string,
    agentTypeId: string,
    name: string,
    description?: string,
    configuration?: any
  ): Promise<SubAgent | null> {
    try {
      const agent = await this.agentManager.createSubAgent(
        userId,
        agentTypeId,
        name,
        description,
        configuration
      );

      if (agent) {
        await this.initializeAgent(agent.id, userId);
      }

      return agent;
    } catch (error) {
      console.error('Error creating sub-agent:', error);
      return null;
    }
  }

  async initializeAgent(agentId: string, userId: string): Promise<boolean> {
    try {
      const agent = await this.getSubAgent(agentId, userId);
      if (!agent) return false;

      const agentInstance = agentFactory.createAgent(agent, { userId });
      this.activeAgents.set(agentId, agentInstance);

      return true;
    } catch (error) {
      console.error('Error initializing agent:', error);
      return false;
    }
  }

  async getSubAgent(agentId: string, userId: string): Promise<SubAgent | null> {
    try {
      const userAgents = await this.agentManager.getUserAgents(userId);
      return userAgents.find(agent => agent.id === agentId) || null;
    } catch (error) {
      console.error('Error getting sub-agent:', error);
      return null;
    }
  }

  async getUserAgents(userId: string): Promise<SubAgent[]> {
    return await this.agentManager.getUserAgents(userId);
  }

  async updateSubAgent(agentId: string, updates: any): Promise<SubAgent | null> {
    try {
      const agent = await this.agentManager.updateSubAgent(agentId, updates);
      
      if (agent && this.activeAgents.has(agentId)) {
        // Reinitialize the agent with updated configuration
        await this.initializeAgent(agentId, agent.user_id);
      }

      return agent;
    } catch (error) {
      console.error('Error updating sub-agent:', error);
      return null;
    }
  }

  async deactivateAgent(agentId: string): Promise<boolean> {
    try {
      this.activeAgents.delete(agentId);
      await this.agentManager.updateSubAgent(agentId, { status: 'inactive' });
      return true;
    } catch (error) {
      console.error('Error deactivating agent:', error);
      return false;
    }
  }

  // Agent Communication and Processing
  async processMessageWithAgent(
    agentId: string,
    userId: string,
    childId: string,
    message: string,
    context?: any
  ): Promise<AgentResponse> {
    try {
      // Ensure agent is active
      if (!this.activeAgents.has(agentId)) {
        await this.initializeAgent(agentId, userId);
      }

      const response = await this.agentManager.processMessageWithAgent(
        agentId,
        userId,
        childId,
        message
      );

      // Log communication if enabled
      if (this.config.enableAgentCommunication) {
        await this.logAgentCommunication(agentId, 'user_message', {
          message,
          response,
          context
        });
      }

      return response;
    } catch (error) {
      console.error('Error processing message with agent:', error);
      return {
        success: false,
        message: 'Error processing message with agent.'
      };
    }
  }

  async routeMessageToBestAgent(
    userId: string,
    childId: string,
    message: string
  ): Promise<{ agentId: string; response: AgentResponse } | null> {
    try {
      return await this.agentManager.routeMessageToBestAgent(userId, childId, message);
    } catch (error) {
      console.error('Error routing message to best agent:', error);
      return null;
    }
  }

  // Multi-Agent Collaboration
  async collaborateWithMultipleAgents(
    userId: string,
    childId: string,
    message: string,
    agentIds: string[]
  ): Promise<AgentCollaborationResult> {
    try {
      const individualResponses = new Map<string, AgentResponse>();
      const participatingAgents: string[] = [];

      // Process message with each agent
      for (const agentId of agentIds) {
        try {
          const response = await this.processMessageWithAgent(
            agentId,
            userId,
            childId,
            message
          );
          
          individualResponses.set(agentId, response);
          participatingAgents.push(agentId);
        } catch (error) {
          console.error(`Error processing with agent ${agentId}:`, error);
        }
      }

      // Combine responses
      const combinedResponse = this.combineAgentResponses(individualResponses);

      return {
        success: true,
        participatingAgents,
        combinedResponse,
        individualResponses
      };
    } catch (error) {
      console.error('Error in multi-agent collaboration:', error);
      return {
        success: false,
        participatingAgents: [],
        combinedResponse: {
          success: false,
          message: 'Error in multi-agent collaboration.'
        },
        individualResponses: new Map()
      };
    }
  }

  private combineAgentResponses(
    responses: Map<string, AgentResponse>
  ): AgentResponse {
    const allTasks: AgentTask[] = [];
    const allInsights: AgentInsight[] = [];
    const allRecommendations: AgentRecommendation[] = [];
    const messages: string[] = [];

    for (const [agentId, response] of responses) {
      if (response.success) {
        if (response.tasks) allTasks.push(...response.tasks);
        if (response.insights) allInsights.push(...response.insights);
        if (response.recommendations) allRecommendations.push(...response.recommendations);
        if (response.message) messages.push(`[${agentId}]: ${response.message}`);
      }
    }

    return {
      success: allTasks.length > 0 || allInsights.length > 0 || allRecommendations.length > 0,
      message: messages.join('\n'),
      tasks: allTasks,
      insights: allInsights,
      recommendations: allRecommendations
    };
  }

  // Agent Communication System
  async sendAgentMessage(
    fromAgentId: string,
    toAgentId: string,
    messageType: 'request' | 'response' | 'notification',
    content: any,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<void> {
    if (!this.config.enableAgentCommunication) return;

    const message: AgentCommunicationMessage = {
      fromAgentId,
      toAgentId,
      messageType,
      content,
      priority,
      timestamp: new Date()
    };

    this.agentCommunications.push(message);

    // Process the message if the target agent is active
    if (this.activeAgents.has(toAgentId)) {
      await this.processAgentMessage(message);
    }
  }

  private async processAgentMessage(message: AgentCommunicationMessage): Promise<void> {
    try {
      const targetAgent = this.activeAgents.get(message.toAgentId);
      if (targetAgent && typeof targetAgent.handleAgentMessage === 'function') {
        await targetAgent.handleAgentMessage(message);
      }
    } catch (error) {
      console.error('Error processing agent message:', error);
    }
  }

  async getAgentCommunications(
    agentId: string,
    limit: number = 50
  ): Promise<AgentCommunicationMessage[]> {
    return this.agentCommunications
      .filter(msg => msg.fromAgentId === agentId || msg.toAgentId === agentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Agent Learning and Insights
  async generateAgentInsights(
    agentId: string,
    userId: string,
    childId: string
  ): Promise<AgentInsight[]> {
    try {
      return await this.agentManager.generateAgentInsights(agentId, userId, childId);
    } catch (error) {
      console.error('Error generating agent insights:', error);
      return [];
    }
  }

  async generateAgentRecommendations(
    agentId: string,
    userId: string,
    childId: string
  ): Promise<AgentRecommendation[]> {
    try {
      return await this.agentManager.generateAgentRecommendations(agentId, userId, childId);
    } catch (error) {
      console.error('Error generating agent recommendations:', error);
      return [];
    }
  }

  async executeAgentTask(
    agentId: string,
    taskId: string,
    userId: string,
    childId: string
  ): Promise<AgentResponse> {
    try {
      return await this.agentManager.executeAgentTask(agentId, taskId, userId, childId);
    } catch (error) {
      console.error('Error executing agent task:', error);
      return {
        success: false,
        message: 'Error executing agent task.'
      };
    }
  }

  // Agent Task Management
  async createAgentTask(
    agentId: string,
    childId: string,
    taskData: {
      task_type: string;
      title: string;
      description?: string;
      priority?: string;
      due_date?: string;
    }
  ): Promise<AgentTask | null> {
    try {
      return await this.agentManager.createAgentTask(agentId, childId, taskData);
    } catch (error) {
      console.error('Error creating agent task:', error);
      return null;
    }
  }

  async getAgentTasks(agentId: string, status?: string): Promise<AgentTask[]> {
    try {
      return await this.agentManager.getAgentTasks(agentId, status);
    } catch (error) {
      console.error('Error getting agent tasks:', error);
      return [];
    }
  }

  async updateAgentTask(taskId: string, updates: any): Promise<AgentTask | null> {
    try {
      return await this.agentManager.updateAgentTask(taskId, updates);
    } catch (error) {
      console.error('Error updating agent task:', error);
      return null;
    }
  }

  // Agent Insights and Recommendations
  async getAgentInsights(
    agentId: string,
    childId?: string,
    limit = 20
  ): Promise<AgentInsight[]> {
    try {
      return await this.agentManager.getAgentInsights(agentId, childId, limit);
    } catch (error) {
      console.error('Error getting agent insights:', error);
      return [];
    }
  }

  async getAgentRecommendations(
    agentId: string,
    childId?: string,
    status?: string
  ): Promise<AgentRecommendation[]> {
    try {
      return await this.agentManager.getAgentRecommendations(agentId, childId, status);
    } catch (error) {
      console.error('Error getting agent recommendations:', error);
      return [];
    }
  }

  // Agent Capabilities and Configuration
  async getAgentCapabilities(agentId: string, userId: string): Promise<AgentCapability[]> {
    try {
      const agent = await this.getSubAgent(agentId, userId);
      if (!agent) return [];

      const agentInstance = this.activeAgents.get(agentId);
      if (agentInstance && typeof agentInstance.getCapabilities === 'function') {
        return agentInstance.getCapabilities();
      }

      return [];
    } catch (error) {
      console.error('Error getting agent capabilities:', error);
      return [];
    }
  }

  async updateAgentCapability(
    agentId: string,
    capabilityName: string,
    enabled: boolean
  ): Promise<boolean> {
    try {
      const agentInstance = this.activeAgents.get(agentId);
      if (agentInstance && typeof agentInstance.updateCapability === 'function') {
        return await agentInstance.updateCapability(capabilityName, enabled);
      }
      return false;
    } catch (error) {
      console.error('Error updating agent capability:', error);
      return false;
    }
  }

  // Agent Performance and Monitoring
  async getAgentPerformanceMetrics(agentId: string): Promise<any> {
    try {
      const tasks = await this.getAgentTasks(agentId);
      const insights = await this.getAgentInsights(agentId);
      const recommendations = await this.getAgentRecommendations(agentId);

      const completedTasks = tasks.filter(task => task.status === 'completed');
      const pendingTasks = tasks.filter(task => task.status === 'pending');

      return {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
        totalInsights: insights.length,
        totalRecommendations: recommendations.length,
        lastActivity: tasks.length > 0 ? Math.max(...tasks.map(t => new Date(t.updated_at).getTime())) : null
      };
    } catch (error) {
      console.error('Error getting agent performance metrics:', error);
      return {};
    }
  }

  // Agent Lifecycle Management
  async startAgentTraining(agentId: string, userId: string): Promise<boolean> {
    try {
      await this.agentManager.updateSubAgent(agentId, { status: 'training' });
      return true;
    } catch (error) {
      console.error('Error starting agent training:', error);
      return false;
    }
  }

  async completeAgentTraining(agentId: string, userId: string): Promise<boolean> {
    try {
      await this.agentManager.updateSubAgent(agentId, { status: 'active' });
      return true;
    } catch (error) {
      console.error('Error completing agent training:', error);
      return false;
    }
  }

  // Utility Methods
  private async logAgentCommunication(
    agentId: string,
    eventType: string,
    data: any
  ): Promise<void> {
    try {
      await dbService.supabase
        .from('agent_learning_data')
        .insert({
          sub_agent_id: agentId,
          data_type: eventType,
          data_content: data,
          metadata: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error logging agent communication:', error);
    }
  }

  async cleanup(): Promise<void> {
    this.activeAgents.clear();
    this.agentCommunications = [];
  }

  getActiveAgentsCount(): number {
    return this.activeAgents.size;
  }

  getServiceConfig(): SubAgentServiceConfig {
    return { ...this.config };
  }
}

// Export singleton instance
export const subAgentService = SubAgentService.getInstance(); 