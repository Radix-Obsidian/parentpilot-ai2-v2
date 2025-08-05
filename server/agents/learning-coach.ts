import { BaseAgent, AgentContext, AgentResponse, AgentCapability } from './base-agent';
import { SubAgent, AgentTask, AgentInsight, AgentRecommendation } from '../database/types';

export class LearningCoachAgent extends BaseAgent {
  constructor(agent: SubAgent, context: AgentContext) {
    super(agent, context);
  }

  initializeCapabilities(): AgentCapability[] {
    return [
      {
        name: 'activity_recommendations',
        description: 'Provide personalized learning activity recommendations',
        enabled: true
      },
      {
        name: 'learning_optimization',
        description: 'Optimize learning strategies based on child\'s style and needs',
        enabled: true
      },
      {
        name: 'skill_assessment',
        description: 'Assess and track learning skills and progress',
        enabled: true
      }
    ];
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return {
        success: false,
        message: 'No child data available for learning coaching.'
      };
    }

    const systemMessage = `You are a Learning Coach AI agent specializing in personalized learning strategies and educational activities.
    Your role is to help parents optimize their child's learning experience and provide engaging educational activities.
    
    Context: ${this.getAgentContext()}
    
    Focus on:
    1. Personalized learning strategies based on child's interests and learning style
    2. Age-appropriate educational activities
    3. Skill development and assessment
    4. Learning optimization and engagement
    5. Educational resource recommendations
    
    Keep responses practical, engaging, and tailored to the child's specific needs and interests.`;

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
      console.error('Error processing learning coach message:', error);
      return {
        success: false,
        message: 'Failed to process learning coaching request.'
      };
    }
  }

  async generateInsights(): Promise<AgentInsight[]> {
    const child = await this.getChildData();
    if (!child) return [];

    const insights: AgentInsight[] = [];

    try {
      // Analyze learning patterns
      const learningPatternAnalysis = await this.analyzeLearningPatterns(child);
      if (learningPatternAnalysis) {
        insights.push(learningPatternAnalysis);
      }

      // Assess learning skills
      const skillAssessment = await this.assessLearningSkills(child);
      if (skillAssessment) {
        insights.push(skillAssessment);
      }

      // Analyze engagement factors
      const engagementAnalysis = await this.analyzeEngagementFactors(child);
      if (engagementAnalysis) {
        insights.push(engagementAnalysis);
      }

      // Save insights to database
      for (const insight of insights) {
        await this.createInsight({
          insight_type: insight.insight_type || 'learning_analysis',
          title: insight.title,
          content: insight.content || '',
          confidence_score: insight.confidence_score || 0.8,
          data_sources: insight.data_sources
        });
      }

    } catch (error) {
      console.error('Error generating learning insights:', error);
    }

    return insights;
  }

  async generateRecommendations(): Promise<AgentRecommendation[]> {
    const child = await this.getChildData();
    if (!child) return [];

    const recommendations: AgentRecommendation[] = [];

    try {
      // Generate learning activity recommendations
      const activityRecommendations = await this.generateActivityRecommendations(child);
      recommendations.push(...activityRecommendations);

      // Generate learning strategy recommendations
      const strategyRecommendations = await this.generateStrategyRecommendations(child);
      recommendations.push(...strategyRecommendations);

      // Generate skill development recommendations
      const skillRecommendations = await this.generateSkillRecommendations(child);
      recommendations.push(...skillRecommendations);

      // Save recommendations to database
      for (const recommendation of recommendations) {
        await this.createRecommendation({
          recommendation_type: recommendation.recommendation_type || 'learning_guidance',
          title: recommendation.title,
          description: recommendation.description || '',
          action_items: recommendation.action_items,
          priority: recommendation.priority || 'medium'
        });
      }

    } catch (error) {
      console.error('Error generating learning recommendations:', error);
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
        case 'learning_assessment':
          return await this.executeLearningAssessment(task);
        case 'activity_planning':
          return await this.executeActivityPlanning(task);
        case 'skill_evaluation':
          return await this.executeSkillEvaluation(task);
        default:
          return {
            success: false,
            message: 'Unknown task type.'
          };
      }
    } catch (error) {
      console.error('Error executing learning task:', error);
      return {
        success: false,
        message: 'Failed to execute learning task.'
      };
    }
  }

  private async analyzeLearningPatterns(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze the learning patterns for ${child.name} (${child.age} years old).
    
    Consider:
    - Learning style: ${child.learning_style || 'not specified'}
    - Interests: ${child.interests?.join(', ') || 'various areas'}
    - Strengths: ${child.strengths?.join(', ') || 'various areas'}
    - Age-appropriate learning expectations
    
    Provide insights on:
    1. Preferred learning modalities
    2. Optimal learning environments
    3. Engagement patterns
    4. Learning challenges and opportunities
    5. Recommended learning approaches
    
    Focus on practical, actionable insights for optimizing learning.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'learning_pattern_analysis',
        title: `Learning Pattern Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.85,
        data_sources: { 
          child_age: child.age, 
          learning_style: child.learning_style,
          interests: child.interests,
          strengths: child.strengths 
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
      return null;
    }
  }

  private async assessLearningSkills(child: any): Promise<AgentInsight | null> {
    const prompt = `Assess the learning skills for ${child.name} (${child.age} years old).
    
    Evaluate skills in:
    1. Cognitive development
    2. Language and communication
    3. Problem-solving abilities
    4. Memory and retention
    5. Attention and focus
    6. Creative thinking
    7. Social learning skills
    
    Consider:
    - Age-appropriate skill expectations
    - Child's current abilities
    - Areas of strength and growth
    - Learning style preferences
    
    Provide a structured assessment with:
    - Current skill levels
    - Areas for development
    - Recommended focus areas
    - Skill-building strategies`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'learning_skill_assessment',
        title: `Learning Skill Assessment for ${child.name}`,
        content: analysis,
        confidence_score: 0.8,
        data_sources: { 
          child_age: child.age,
          assessment_date: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error assessing learning skills:', error);
      return null;
    }
  }

  private async analyzeEngagementFactors(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze engagement factors for ${child.name} (${child.age} years old).
    
    Consider:
    - What motivates and interests the child
    - Preferred learning environments
    - Attention span and focus patterns
    - Response to different teaching methods
    - Social learning preferences
    
    Provide insights on:
    1. Optimal engagement strategies
    2. Motivational factors
    3. Attention management techniques
    4. Learning environment optimization
    5. Engagement monitoring approaches
    
    Focus on practical strategies for maintaining learning engagement.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'engagement_analysis',
        title: `Learning Engagement Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.8,
        data_sources: { 
          child_interests: child.interests,
          child_age: child.age
        },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing engagement factors:', error);
      return null;
    }
  }

  private async generateActivityRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate personalized learning activity recommendations for ${child.name} (${child.age} years old).
    
    Consider:
    - Age-appropriate activities
    - Child's interests: ${child.interests?.join(', ') || 'various areas'}
    - Learning style: ${child.learning_style || 'not specified'}
    - Current skill levels
    - Engagement preferences
    
    Provide 5-7 specific activity recommendations covering:
    1. Cognitive development activities
    2. Language and literacy activities
    3. Math and problem-solving activities
    4. Creative and artistic activities
    5. Physical and motor skill activities
    6. Social and emotional learning activities
    
    For each activity include:
    - Clear learning objectives
    - Materials needed
    - Step-by-step instructions
    - Expected duration
    - Adaptations for different skill levels
    - Engagement tips`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'learning_activities',
        title: `Personalized Learning Activities for ${child.name}`,
        description: response,
        action_items: { activities: [], schedule: 'flexible' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating activity recommendations:', error);
      return [];
    }
  }

  private async generateStrategyRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate learning strategy recommendations for ${child.name} (${child.age} years old).
    
    Consider:
    - Learning style: ${child.learning_style || 'not specified'}
    - Current strengths and challenges
    - Age-appropriate learning approaches
    - Family schedule and resources
    
    Provide strategies for:
    1. Optimizing learning environment
    2. Managing attention and focus
    3. Supporting different learning styles
    4. Building study skills
    5. Encouraging independent learning
    6. Integrating learning into daily routines
    
    Make strategies practical and adaptable to family life.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'learning_strategies',
        title: `Learning Strategy Plan for ${child.name}`,
        description: response,
        action_items: { strategies: [], implementation_timeline: 'ongoing' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating strategy recommendations:', error);
      return [];
    }
  }

  private async generateSkillRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate skill development recommendations for ${child.name} (${child.age} years old).
    
    Focus on developing:
    1. Cognitive skills (memory, problem-solving, critical thinking)
    2. Language and communication skills
    3. Social and emotional skills
    4. Physical and motor skills
    5. Creative and artistic skills
    6. Academic readiness skills
    
    Consider:
    - Age-appropriate skill expectations
    - Child's current abilities
    - Areas needing development
    - Child's interests and strengths
    
    Provide specific, actionable recommendations for skill building.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'skill_development',
        title: `Skill Development Plan for ${child.name}`,
        description: response,
        action_items: { skills: [], timeline: 'ongoing' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating skill recommendations:', error);
      return [];
    }
  }

  private async executeLearningAssessment(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeLearningPatterns(child);
      const recommendations = await this.generateStrategyRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Learning assessment completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete learning assessment.' };
    }
  }

  private async executeActivityPlanning(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeEngagementFactors(child);
      const recommendations = await this.generateActivityRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Activity planning completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete activity planning.' };
    }
  }

  private async executeSkillEvaluation(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.assessLearningSkills(child);
      const recommendations = await this.generateSkillRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Skill evaluation completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete skill evaluation.' };
    }
  }
} 