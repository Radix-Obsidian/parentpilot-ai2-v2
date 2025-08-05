import { dbService } from '../database/config';
import { SubAgent, AgentType, AgentTask, AgentInsight, AgentRecommendation } from '../database/types';
import { AgentContext, AgentResponse } from './base-agent';
import { agentFactory } from './agent-factory';

export class AgentManager {
  private static instance: AgentManager;

  private constructor() {}

  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  // Get all sub-agents for a user
  async getUserAgents(userId: string): Promise<SubAgent[]> {
    try {
      return await dbService.getSubAgentsByUserId(userId);
    } catch (error) {
      console.error('Error getting user agents:', error);
      return [];
    }
  }

  // Get available agent types
  async getAvailableAgentTypes(): Promise<AgentType[]> {
    try {
      return await dbService.getAgentTypes();
    } catch (error) {
      console.error('Error getting agent types:', error);
      return [];
    }
  }

  // Create a new sub-agent
  async createSubAgent(
    userId: string,
    agentTypeId: string,
    name: string,
    description?: string,
    configuration?: any
  ): Promise<SubAgent | null> {
    try {
      return await dbService.createSubAgent(userId, agentTypeId, name, description, configuration);
    } catch (error) {
      console.error('Error creating sub-agent:', error);
      return null;
    }
  }

  // Update a sub-agent
  async updateSubAgent(agentId: string, updates: any): Promise<SubAgent | null> {
    try {
      return await dbService.updateSubAgent(agentId, updates);
    } catch (error) {
      console.error('Error updating sub-agent:', error);
      return null;
    }
  }

  // Process a message with a specific sub-agent
  async processMessageWithAgent(
    agentId: string,
    userId: string,
    childId: string,
    message: string
  ): Promise<AgentResponse> {
    try {
      // Get the agent
      const userAgents = await this.getUserAgents(userId);
      const agent = userAgents.find(a => a.id === agentId);
      
      if (!agent) {
        return {
          success: false,
          message: 'Agent not found or not accessible.'
        };
      }

      // Get child data
      const child = await dbService.getChildById(childId);
      if (!child) {
        return {
          success: false,
          message: 'Child not found.'
        };
      }

      // Get user data
      const user = await dbService.getUserById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found.'
        };
      }

      // Create agent context
      const context: AgentContext = {
        userId,
        childId,
        child,
        user,
        conversationHistory: []
      };

      // Create agent instance
      const agentInstance = await agentFactory.createAgent(agent, context);

      // Process message
      return await agentInstance.processMessage(message);

    } catch (error) {
      console.error('Error processing message with agent:', error);
      return {
        success: false,
        message: 'Failed to process message with agent.'
      };
    }
  }

  // Generate insights for a specific agent
  async generateAgentInsights(agentId: string, userId: string, childId: string): Promise<AgentInsight[]> {
    try {
      const userAgents = await this.getUserAgents(userId);
      const agent = userAgents.find(a => a.id === agentId);
      
      if (!agent) {
        throw new Error('Agent not found or not accessible.');
      }

      const child = await dbService.getChildById(childId);
      if (!child) {
        throw new Error('Child not found.');
      }

      const user = await dbService.getUserById(userId);
      if (!user) {
        throw new Error('User not found.');
      }

      const context: AgentContext = {
        userId,
        childId,
        child,
        user
      };

      const agentInstance = await agentFactory.createAgent(agent, context);
      return await agentInstance.generateInsights();

    } catch (error) {
      console.error('Error generating agent insights:', error);
      return [];
    }
  }

  // Generate recommendations for a specific agent
  async generateAgentRecommendations(agentId: string, userId: string, childId: string): Promise<AgentRecommendation[]> {
    try {
      const userAgents = await this.getUserAgents(userId);
      const agent = userAgents.find(a => a.id === agentId);
      
      if (!agent) {
        throw new Error('Agent not found or not accessible.');
      }

      const child = await dbService.getChildById(childId);
      if (!child) {
        throw new Error('Child not found.');
      }

      const user = await dbService.getUserById(userId);
      if (!user) {
        throw new Error('User not found.');
      }

      const context: AgentContext = {
        userId,
        childId,
        child,
        user
      };

      const agentInstance = await agentFactory.createAgent(agent, context);
      return await agentInstance.generateRecommendations();

    } catch (error) {
      console.error('Error generating agent recommendations:', error);
      return [];
    }
  }

  // Execute a task with a specific agent
  async executeAgentTask(agentId: string, taskId: string, userId: string, childId: string): Promise<AgentResponse> {
    try {
      const userAgents = await this.getUserAgents(userId);
      const agent = userAgents.find(a => a.id === agentId);
      
      if (!agent) {
        return {
          success: false,
          message: 'Agent not found or not accessible.'
        };
      }

      const child = await dbService.getChildById(childId);
      if (!child) {
        return {
          success: false,
          message: 'Child not found.'
        };
      }

      const user = await dbService.getUserById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found.'
        };
      }

      const context: AgentContext = {
        userId,
        childId,
        child,
        user
      };

      const agentInstance = await agentFactory.createAgent(agent, context);
      return await agentInstance.executeTask(taskId);

    } catch (error) {
      console.error('Error executing agent task:', error);
      return {
        success: false,
        message: 'Failed to execute agent task.'
      };
    }
  }

  // Get agent tasks
  async getAgentTasks(agentId: string, status?: string): Promise<AgentTask[]> {
    try {
      return await dbService.getAgentTasks(agentId, status);
    } catch (error) {
      console.error('Error getting agent tasks:', error);
      return [];
    }
  }

  // Get agent insights
  async getAgentInsights(agentId: string, childId?: string, limit = 20): Promise<AgentInsight[]> {
    try {
      return await dbService.getAgentInsights(agentId, childId, limit);
    } catch (error) {
      console.error('Error getting agent insights:', error);
      return [];
    }
  }

  // Get agent recommendations
  async getAgentRecommendations(agentId: string, childId?: string, status?: string): Promise<AgentRecommendation[]> {
    try {
      return await dbService.getAgentRecommendations(agentId, childId, status);
    } catch (error) {
      console.error('Error getting agent recommendations:', error);
      return [];
    }
  }

  // Create a task for a specific agent
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
      return await dbService.createAgentTask(agentId, childId, taskData);
    } catch (error) {
      console.error('Error creating agent task:', error);
      return null;
    }
  }

  // Update agent task
  async updateAgentTask(taskId: string, updates: any): Promise<AgentTask | null> {
    try {
      return await dbService.updateAgentTask(taskId, updates);
    } catch (error) {
      console.error('Error updating agent task:', error);
      return null;
    }
  }

  // Get agent conversations
  async getAgentConversations(agentId: string, limit = 50): Promise<any[]> {
    try {
      return await dbService.getAgentConversations(agentId, limit);
    } catch (error) {
      console.error('Error getting agent conversations:', error);
      return [];
    }
  }

  // Route message to appropriate agent based on content
  async routeMessageToBestAgent(
    userId: string,
    childId: string,
    message: string
  ): Promise<{ agentId: string; response: AgentResponse } | null> {
    try {
      const userAgents = await this.getUserAgents(userId);
      if (userAgents.length === 0) {
        return null;
      }

      // Simple routing logic - in a real implementation, you might use AI to determine the best agent
      const messageLower = message.toLowerCase();
      
      // Route to Development Tracker for milestone/development questions
      if (messageLower.includes('milestone') || messageLower.includes('development') || 
          messageLower.includes('progress') || messageLower.includes('delay')) {
        const devAgent = userAgents.find(a => 
          a.agent_type_id && a.status === 'active' && 
          a.name.toLowerCase().includes('development')
        );
        if (devAgent) {
          const response = await this.processMessageWithAgent(devAgent.id, userId, childId, message);
          return { agentId: devAgent.id, response };
        }
      }

      // Route to Learning Coach for learning/education questions
      if (messageLower.includes('learn') || messageLower.includes('activity') || 
          messageLower.includes('skill') || messageLower.includes('education') ||
          messageLower.includes('study') || messageLower.includes('homework')) {
        const learningAgent = userAgents.find(a => 
          a.agent_type_id && a.status === 'active' && 
          a.name.toLowerCase().includes('learning')
        );
        if (learningAgent) {
          const response = await this.processMessageWithAgent(learningAgent.id, userId, childId, message);
          return { agentId: learningAgent.id, response };
        }
      }

      // Default to first available agent
      const defaultAgent = userAgents.find(a => a.status === 'active');
      if (defaultAgent) {
        const response = await this.processMessageWithAgent(defaultAgent.id, userId, childId, message);
        return { agentId: defaultAgent.id, response };
      }

      return null;

    } catch (error) {
      console.error('Error routing message to agent:', error);
      return null;
    }
  }
}

// Export singleton instance
export const agentManager = AgentManager.getInstance(); 