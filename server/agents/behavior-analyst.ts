import { BaseAgent, AgentContext, AgentResponse, AgentCapability } from './base-agent';
import { SubAgent, AgentTask, AgentInsight, AgentRecommendation } from '../database/types';

export class BehaviorAnalystAgent extends BaseAgent {
  constructor(agent: SubAgent, context: AgentContext) {
    super(agent, context);
  }

  initializeCapabilities(): AgentCapability[] {
    return [
      {
        name: 'behavior_pattern_analysis',
        description: 'Analyze child behavior patterns and identify triggers',
        enabled: true
      },
      {
        name: 'behavior_management_strategies',
        description: 'Provide evidence-based behavior management strategies',
        enabled: true
      },
      {
        name: 'positive_reinforcement_planning',
        description: 'Design positive reinforcement and reward systems',
        enabled: true
      }
    ];
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return {
        success: false,
        message: 'No child data available for behavior analysis.'
      };
    }

    const systemMessage = `You are a Behavior Analyst AI agent specializing in child behavior analysis and management.
    Your role is to help parents understand their child's behavior patterns and provide effective management strategies.
    
    Context: ${this.getAgentContext()}
    
    Focus on:
    1. Understanding behavior patterns and triggers
    2. Evidence-based behavior management strategies
    3. Positive reinforcement techniques
    4. Age-appropriate behavior expectations
    5. Creating supportive behavior environments
    
    Keep responses practical, supportive, and focused on positive approaches to behavior management.`;

    try {
      const response = await this.callAI(message, systemMessage);
      
      // Log the conversation
      await this.logConversation([
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      ]);

      return {
        success: true,
        message: response
      };
    } catch (error) {
      console.error('Error processing behavior analyst message:', error);
      return {
        success: false,
        message: 'Failed to process behavior analysis request.'
      };
    }
  }

  async generateInsights(): Promise<AgentInsight[]> {
    const child = await this.getChildData();
    if (!child) return [];

    const insights: AgentInsight[] = [];

    try {
      // Analyze behavior patterns
      const behaviorPatternAnalysis = await this.analyzeBehaviorPatterns(child);
      if (behaviorPatternAnalysis) {
        insights.push(behaviorPatternAnalysis);
      }

      // Assess behavior triggers
      const triggerAnalysis = await this.analyzeBehaviorTriggers(child);
      if (triggerAnalysis) {
        insights.push(triggerAnalysis);
      }

      // Analyze environmental factors
      const environmentalAnalysis = await this.analyzeEnvironmentalFactors(child);
      if (environmentalAnalysis) {
        insights.push(environmentalAnalysis);
      }

      // Save insights to database
      for (const insight of insights) {
        await this.createInsight({
          insight_type: insight.insight_type || 'behavior_analysis',
          title: insight.title,
          content: insight.content || '',
          confidence_score: insight.confidence_score || 0.8,
          data_sources: insight.data_sources
        });
      }

    } catch (error) {
      console.error('Error generating behavior insights:', error);
    }

    return insights;
  }

  async generateRecommendations(): Promise<AgentRecommendation[]> {
    const child = await this.getChildData();
    if (!child) return [];

    const recommendations: AgentRecommendation[] = [];

    try {
      // Generate behavior management strategies
      const managementStrategies = await this.generateManagementStrategies(child);
      recommendations.push(...managementStrategies);

      // Generate positive reinforcement plans
      const reinforcementPlans = await this.generateReinforcementPlans(child);
      recommendations.push(...reinforcementPlans);

      // Generate environmental optimization recommendations
      const environmentalRecommendations = await this.generateEnvironmentalRecommendations(child);
      recommendations.push(...environmentalRecommendations);

      // Save recommendations to database
      for (const recommendation of recommendations) {
        await this.createRecommendation({
          recommendation_type: recommendation.recommendation_type || 'behavior_guidance',
          title: recommendation.title,
          description: recommendation.description || '',
          action_items: recommendation.action_items,
          priority: recommendation.priority || 'medium'
        });
      }

    } catch (error) {
      console.error('Error generating behavior recommendations:', error);
    }

    return recommendations;
  }

  async executeTask(taskId: string): Promise<AgentResponse> {
    try {
      const tasks = await this.getTasks();
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        return {
          success: false,
          message: 'Task not found.'
        };
      }

      // Execute task based on type
      switch (task.task_type) {
        case 'behavior_assessment':
          return await this.executeBehaviorAssessment(task);
        case 'trigger_analysis':
          return await this.executeTriggerAnalysis(task);
        case 'strategy_development':
          return await this.executeStrategyDevelopment(task);
        default:
          return {
            success: false,
            message: 'Unknown task type.'
          };
      }
    } catch (error) {
      console.error('Error executing behavior task:', error);
      return {
        success: false,
        message: 'Failed to execute behavior task.'
      };
    }
  }

  private async analyzeBehaviorPatterns(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze behavior patterns for ${child.name} (${child.age} years old).
    
    Consider:
    - Age-appropriate behavior expectations
    - Common behavior patterns for this age
    - Child's personality and temperament
    - Family dynamics and environment
    - Previous behavior observations
    
    Provide insights on:
    1. Typical behavior patterns for this age
    2. Individual behavior characteristics
    3. Potential behavior challenges
    4. Positive behavior indicators
    5. Behavior development trajectory
    
    Focus on understanding and supporting healthy behavior development.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'behavior_pattern_analysis',
        title: `Behavior Pattern Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.8,
        data_sources: { 
          child_age: child.age,
          analysis_date: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing behavior patterns:', error);
      return null;
    }
  }

  private async analyzeBehaviorTriggers(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze potential behavior triggers for ${child.name} (${child.age} years old).
    
    Consider common triggers for this age:
    1. Environmental factors (noise, crowds, changes)
    2. Emotional factors (frustration, tiredness, hunger)
    3. Social factors (peer interactions, transitions)
    4. Physical factors (discomfort, illness)
    5. Cognitive factors (boredom, overstimulation)
    
    Provide insights on:
    1. Likely trigger identification
    2. Early warning signs
    3. Prevention strategies
    4. Response planning
    5. Support mechanisms
    
    Focus on proactive trigger management.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'trigger_analysis',
        title: `Behavior Trigger Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.75,
        data_sources: { 
          child_age: child.age,
          analysis_date: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing behavior triggers:', error);
      return null;
    }
  }

  private async analyzeEnvironmentalFactors(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze environmental factors affecting ${child.name}'s behavior (${child.age} years old).
    
    Consider:
    1. Physical environment (home, school, public spaces)
    2. Social environment (family, peers, adults)
    3. Temporal factors (routines, schedules, transitions)
    4. Sensory factors (noise, lighting, textures)
    5. Emotional climate (stress, conflict, support)
    
    Provide insights on:
    1. Environmental influences on behavior
    2. Optimal behavior-supporting environments
    3. Environmental modifications needed
    4. Routine and structure recommendations
    5. Support system optimization
    
    Focus on creating behavior-supportive environments.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'environmental_analysis',
        title: `Environmental Factor Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.8,
        data_sources: { 
          child_age: child.age,
          analysis_date: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing environmental factors:', error);
      return null;
    }
  }

  private async generateManagementStrategies(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate behavior management strategies for ${child.name} (${child.age} years old).
    
    Consider:
    - Age-appropriate management approaches
    - Child's personality and temperament
    - Family values and parenting style
    - Specific behavior challenges
    
    Provide strategies for:
    1. Positive reinforcement techniques
    2. Setting clear expectations
    3. Consistent consequences
    4. Communication strategies
    5. Prevention techniques
    6. Crisis management
    
    Make strategies practical, consistent, and age-appropriate.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'behavior_management',
        title: `Behavior Management Strategies for ${child.name}`,
        description: response,
        action_items: { strategies: [], implementation_timeline: 'ongoing' },
        priority: 'high',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating management strategies:', error);
      return [];
    }
  }

  private async generateReinforcementPlans(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate positive reinforcement plans for ${child.name} (${child.age} years old).
    
    Consider:
    - Child's interests and motivations
    - Age-appropriate rewards
    - Family resources and values
    - Specific behaviors to reinforce
    
    Provide plans for:
    1. Immediate reinforcement strategies
    2. Long-term reward systems
    3. Social reinforcement techniques
    4. Natural consequences
    5. Token economy systems (if appropriate)
    6. Celebration of progress
    
    Focus on intrinsic motivation and natural rewards.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'positive_reinforcement',
        title: `Positive Reinforcement Plan for ${child.name}`,
        description: response,
        action_items: { reinforcement_methods: [], timeline: 'ongoing' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating reinforcement plans:', error);
      return [];
    }
  }

  private async generateEnvironmentalRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate environmental optimization recommendations for ${child.name} (${child.age} years old).
    
    Focus on:
    1. Physical environment modifications
    2. Routine and structure improvements
    3. Social environment optimization
    4. Sensory environment considerations
    5. Emotional climate enhancement
    
    Consider:
    - Child's specific needs and preferences
    - Family lifestyle and resources
    - Behavior support requirements
    - Developmental appropriateness
    
    Provide practical, implementable recommendations.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'environmental_optimization',
        title: `Environmental Optimization for ${child.name}`,
        description: response,
        action_items: { modifications: [], timeline: 'flexible' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating environmental recommendations:', error);
      return [];
    }
  }

  private async executeBehaviorAssessment(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeBehaviorPatterns(child);
      const recommendations = await this.generateManagementStrategies(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Behavior assessment completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete behavior assessment.' };
    }
  }

  private async executeTriggerAnalysis(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeBehaviorTriggers(child);
      const recommendations = await this.generateEnvironmentalRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Trigger analysis completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete trigger analysis.' };
    }
  }

  private async executeStrategyDevelopment(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeEnvironmentalFactors(child);
      const recommendations = await this.generateReinforcementPlans(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Strategy development completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete strategy development.' };
    }
  }
} 