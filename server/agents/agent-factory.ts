import { SubAgent, AgentType } from '../database/types';
import { AgentContext } from './base-agent';
import { DevelopmentTrackerAgent } from './development-tracker';
import { LearningCoachAgent } from './learning-coach';
import { BehaviorAnalystAgent } from './behavior-analyst';
import { SocialSkillsMentorAgent } from './social-skills-mentor';
import { AcademicAdvisorAgent } from './academic-advisor';
import { DispatcherAgent } from './dispatcher-agent';
import { AnalystAgent } from './analyst-agent';
import { SchedulerAgent } from './scheduler-agent';

export interface AgentFactory {
  createAgent(agent: SubAgent, context: AgentContext): any;
}

export class SubAgentFactory implements AgentFactory {
  async createAgent(agent: SubAgent, context: AgentContext): Promise<any> {
    // Get agent type information
    const agentType = await this.getAgentType(agent.agent_type_id);
    
    if (!agentType) {
      throw new Error(`Agent type not found for agent ${agent.id}`);
    }

    // Create agent based on type
    switch (agentType.name.toLowerCase()) {
      case 'development tracker':
        return new DevelopmentTrackerAgent(agent, context);
      
      case 'learning coach':
        return new LearningCoachAgent(agent, context);
      
      case 'behavior analyst':
        return new BehaviorAnalystAgent(agent, context);
      
      case 'social skills mentor':
        return new SocialSkillsMentorAgent(agent, context);
      
      case 'academic advisor':
        return new AcademicAdvisorAgent(agent, context);
      
      case 'dispatcher':
        return new DispatcherAgent(context);
      
      case 'analyst':
        return new AnalystAgent(context);
      
      case 'scheduler':
        return new SchedulerAgent(context);
      
      // Add more agent types as they are implemented
      // case 'health monitor':
      //   return new HealthMonitorAgent(agent, context);
      // case 'creative catalyst':
      //   return new CreativeCatalystAgent(agent, context);
      // case 'technology guide':
      //   return new TechnologyGuideAgent(agent, context);
      
      default:
        throw new Error(`Unknown agent type: ${agentType.name}`);
    }
  }

  private async getAgentType(agentTypeId: string): Promise<AgentType | null> {
    try {
      const { dbService } = await import('../database/config');
      const agentTypes = await dbService.getAgentTypes();
      return agentTypes.find(type => type.id === agentTypeId) || null;
    } catch (error) {
      console.error('Error getting agent type:', error);
      return null;
    }
  }
}

// Export singleton instance
export const agentFactory = new SubAgentFactory(); 