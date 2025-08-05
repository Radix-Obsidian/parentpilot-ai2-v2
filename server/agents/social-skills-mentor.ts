import { BaseAgent, AgentContext, AgentResponse, AgentCapability } from './base-agent';
import { SubAgent, AgentTask, AgentInsight, AgentRecommendation } from '../database/types';

export class SocialSkillsMentorAgent extends BaseAgent {
  constructor(agent: SubAgent, context: AgentContext) {
    super(agent, context);
  }

  initializeCapabilities(): AgentCapability[] {
    return [
      {
        name: 'social_skills_assessment',
        description: 'Assess and track social skills development',
        enabled: true
      },
      {
        name: 'peer_interaction_guidance',
        description: 'Provide guidance for peer interactions and friendships',
        enabled: true
      },
      {
        name: 'emotional_intelligence_development',
        description: 'Support emotional intelligence and empathy development',
        enabled: true
      }
    ];
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return {
        success: false,
        message: 'No child data available for social skills mentoring.'
      };
    }

    const systemMessage = `You are a Social Skills Mentor AI agent specializing in child social development and emotional intelligence.
    Your role is to help parents support their child's social skills, peer relationships, and emotional development.
    
    Context: ${this.getAgentContext()}
    
    Focus on:
    1. Age-appropriate social skills development
    2. Peer interaction strategies and friendship building
    3. Emotional intelligence and empathy development
    4. Conflict resolution and communication skills
    5. Social confidence and self-esteem building
    
    Keep responses supportive, practical, and focused on positive social development.`;

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
      console.error('Error processing social skills mentor message:', error);
      return {
        success: false,
        message: 'Failed to process social skills mentoring request.'
      };
    }
  }

  async generateInsights(): Promise<AgentInsight[]> {
    const child = await this.getChildData();
    if (!child) return [];

    const insights: AgentInsight[] = [];

    try {
      // Analyze social skills development
      const socialSkillsAnalysis = await this.analyzeSocialSkills(child);
      if (socialSkillsAnalysis) {
        insights.push(socialSkillsAnalysis);
      }

      // Assess peer interaction patterns
      const peerInteractionAnalysis = await this.analyzePeerInteractions(child);
      if (peerInteractionAnalysis) {
        insights.push(peerInteractionAnalysis);
      }

      // Analyze emotional intelligence
      const emotionalIntelligenceAnalysis = await this.analyzeEmotionalIntelligence(child);
      if (emotionalIntelligenceAnalysis) {
        insights.push(emotionalIntelligenceAnalysis);
      }

      // Save insights to database
      for (const insight of insights) {
        await this.createInsight({
          insight_type: insight.insight_type || 'social_development',
          title: insight.title,
          content: insight.content || '',
          confidence_score: insight.confidence_score || 0.8,
          data_sources: insight.data_sources
        });
      }

    } catch (error) {
      console.error('Error generating social skills insights:', error);
    }

    return insights;
  }

  async generateRecommendations(): Promise<AgentRecommendation[]> {
    const child = await this.getChildData();
    if (!child) return [];

    const recommendations: AgentRecommendation[] = [];

    try {
      // Generate social skills development recommendations
      const socialSkillsRecommendations = await this.generateSocialSkillsRecommendations(child);
      recommendations.push(...socialSkillsRecommendations);

      // Generate peer interaction recommendations
      const peerInteractionRecommendations = await this.generatePeerInteractionRecommendations(child);
      recommendations.push(...peerInteractionRecommendations);

      // Generate emotional intelligence recommendations
      const emotionalIntelligenceRecommendations = await this.generateEmotionalIntelligenceRecommendations(child);
      recommendations.push(...emotionalIntelligenceRecommendations);

      // Save recommendations to database
      for (const recommendation of recommendations) {
        await this.createRecommendation({
          recommendation_type: recommendation.recommendation_type || 'social_guidance',
          title: recommendation.title,
          description: recommendation.description || '',
          action_items: recommendation.action_items,
          priority: recommendation.priority || 'medium'
        });
      }

    } catch (error) {
      console.error('Error generating social skills recommendations:', error);
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
        case 'social_skills_assessment':
          return await this.executeSocialSkillsAssessment(task);
        case 'peer_interaction_planning':
          return await this.executePeerInteractionPlanning(task);
        case 'emotional_development_evaluation':
          return await this.executeEmotionalDevelopmentEvaluation(task);
        default:
          return {
            success: false,
            message: 'Unknown task type.'
          };
      }
    } catch (error) {
      console.error('Error executing social skills task:', error);
      return {
        success: false,
        message: 'Failed to execute social skills task.'
      };
    }
  }

  private async analyzeSocialSkills(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze social skills development for ${child.name} (${child.age} years old).
    
    Consider age-appropriate social skills:
    1. Communication skills (listening, speaking, expressing needs)
    2. Cooperation and sharing
    3. Conflict resolution
    4. Empathy and understanding others
    5. Social confidence and self-esteem
    6. Group participation and leadership
    
    Provide insights on:
    1. Current social skill strengths
    2. Areas needing development
    3. Age-appropriate social expectations
    4. Social development trajectory
    5. Support strategies needed
    
    Focus on positive social development and building confidence.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'social_skills_analysis',
        title: `Social Skills Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.8,
        data_sources: { 
          child_age: child.age,
          analysis_date: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing social skills:', error);
      return null;
    }
  }

  private async analyzePeerInteractions(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze peer interaction patterns for ${child.name} (${child.age} years old).
    
    Consider:
    1. Friendship formation and maintenance
    2. Group dynamics and participation
    3. Conflict resolution with peers
    4. Social inclusion and exclusion
    5. Peer influence and social learning
    6. Social anxiety or confidence issues
    
    Provide insights on:
    1. Current peer interaction patterns
    2. Social strengths and challenges
    3. Friendship opportunities and challenges
    4. Social environment optimization
    5. Peer relationship support strategies
    
    Focus on building positive peer relationships.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'peer_interaction_analysis',
        title: `Peer Interaction Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.75,
        data_sources: { 
          child_age: child.age,
          analysis_date: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing peer interactions:', error);
      return null;
    }
  }

  private async analyzeEmotionalIntelligence(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze emotional intelligence development for ${child.name} (${child.age} years old).
    
    Consider emotional intelligence components:
    1. Self-awareness (recognizing emotions)
    2. Self-regulation (managing emotions)
    3. Social awareness (understanding others' emotions)
    4. Relationship skills (managing relationships)
    5. Empathy and compassion
    6. Emotional expression and communication
    
    Provide insights on:
    1. Current emotional intelligence strengths
    2. Areas for emotional development
    3. Age-appropriate emotional expectations
    4. Emotional regulation strategies
    5. Empathy development opportunities
    
    Focus on building emotional resilience and understanding.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'emotional_intelligence_analysis',
        title: `Emotional Intelligence Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.8,
        data_sources: { 
          child_age: child.age,
          analysis_date: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing emotional intelligence:', error);
      return null;
    }
  }

  private async generateSocialSkillsRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate social skills development recommendations for ${child.name} (${child.age} years old).
    
    Consider:
    - Age-appropriate social skill expectations
    - Child's current social abilities
    - Individual personality and temperament
    - Family and cultural values
    
    Provide recommendations for:
    1. Communication skill development
    2. Cooperation and sharing activities
    3. Conflict resolution strategies
    4. Social confidence building
    5. Group participation skills
    6. Leadership and initiative development
    
    Make recommendations practical, engaging, and age-appropriate.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'social_skills_development',
        title: `Social Skills Development Plan for ${child.name}`,
        description: response,
        action_items: { skills: [], activities: [], timeline: 'ongoing' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating social skills recommendations:', error);
      return [];
    }
  }

  private async generatePeerInteractionRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate peer interaction recommendations for ${child.name} (${child.age} years old).
    
    Focus on:
    1. Friendship building strategies
    2. Social inclusion activities
    3. Group participation opportunities
    4. Conflict resolution skills
    5. Social confidence building
    6. Peer relationship maintenance
    
    Consider:
    - Child's social preferences and comfort level
    - Available social opportunities
    - Family support and involvement
    - Age-appropriate social expectations
    
    Provide practical strategies for positive peer relationships.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'peer_interaction_support',
        title: `Peer Interaction Support for ${child.name}`,
        description: response,
        action_items: { strategies: [], activities: [], timeline: 'ongoing' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating peer interaction recommendations:', error);
      return [];
    }
  }

  private async generateEmotionalIntelligenceRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate emotional intelligence development recommendations for ${child.name} (${child.age} years old).
    
    Focus on developing:
    1. Emotional awareness and recognition
    2. Emotional regulation strategies
    3. Empathy and understanding others
    4. Emotional expression skills
    5. Stress and anxiety management
    6. Resilience and coping skills
    
    Consider:
    - Age-appropriate emotional development
    - Child's emotional temperament
    - Family emotional climate
    - Available support resources
    
    Provide practical strategies for emotional growth.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'emotional_intelligence_development',
        title: `Emotional Intelligence Development for ${child.name}`,
        description: response,
        action_items: { strategies: [], activities: [], timeline: 'ongoing' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating emotional intelligence recommendations:', error);
      return [];
    }
  }

  private async executeSocialSkillsAssessment(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeSocialSkills(child);
      const recommendations = await this.generateSocialSkillsRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Social skills assessment completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete social skills assessment.' };
    }
  }

  private async executePeerInteractionPlanning(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzePeerInteractions(child);
      const recommendations = await this.generatePeerInteractionRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Peer interaction planning completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete peer interaction planning.' };
    }
  }

  private async executeEmotionalDevelopmentEvaluation(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeEmotionalIntelligence(child);
      const recommendations = await this.generateEmotionalIntelligenceRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Emotional development evaluation completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete emotional development evaluation.' };
    }
  }
} 