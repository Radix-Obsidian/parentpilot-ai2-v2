import { BaseAgent, AgentContext, AgentResponse, AgentCapability } from './base-agent';
import { SubAgent, AgentTask, AgentInsight, AgentRecommendation } from '../database/types';

export class DevelopmentTrackerAgent extends BaseAgent {
  constructor(agent: SubAgent, context: AgentContext) {
    super(agent, context);
  }

  initializeCapabilities(): AgentCapability[] {
    return [
      {
        name: 'milestone_tracking',
        description: 'Track developmental milestones and progress',
        enabled: true
      },
      {
        name: 'progress_analysis',
        description: 'Analyze development progress and identify areas of concern',
        enabled: true
      },
      {
        name: 'development_alerts',
        description: 'Generate alerts for potential developmental delays',
        enabled: true
      }
    ];
  }

  async processMessage(message: string): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return {
        success: false,
        message: 'No child data available for development tracking.'
      };
    }

    const systemMessage = `You are a Development Tracker AI agent specializing in child development monitoring. 
    Your role is to help parents track their child's developmental milestones and identify potential areas of concern.
    
    Context: ${this.getAgentContext()}
    
    Focus on:
    1. Age-appropriate developmental milestones
    2. Progress tracking and analysis
    3. Early identification of potential delays
    4. Evidence-based developmental guidance
    5. Creating actionable development plans
    
    Keep responses practical, supportive, and evidence-based.`;

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
      console.error('Error processing message:', error);
      return {
        success: false,
        message: 'Failed to process development tracking request.'
      };
    }
  }

  async generateInsights(): Promise<AgentInsight[]> {
    const child = await this.getChildData();
    if (!child) return [];

    const insights: AgentInsight[] = [];

    try {
      // Analyze age-appropriate milestones
      const milestoneAnalysis = await this.analyzeMilestones(child);
      if (milestoneAnalysis) {
        insights.push(milestoneAnalysis);
      }

      // Analyze progress patterns
      const progressAnalysis = await this.analyzeProgress(child);
      if (progressAnalysis) {
        insights.push(progressAnalysis);
      }

      // Check for potential delays
      const delayAnalysis = await this.analyzePotentialDelays(child);
      if (delayAnalysis) {
        insights.push(delayAnalysis);
      }

      // Save insights to database
      for (const insight of insights) {
        await this.createInsight({
          insight_type: insight.insight_type || 'development_analysis',
          title: insight.title,
          content: insight.content || '',
          confidence_score: insight.confidence_score || 0.8,
          data_sources: insight.data_sources
        });
      }

    } catch (error) {
      console.error('Error generating development insights:', error);
    }

    return insights;
  }

  async generateRecommendations(): Promise<AgentRecommendation[]> {
    const child = await this.getChildData();
    if (!child) return [];

    const recommendations: AgentRecommendation[] = [];

    try {
      // Generate milestone-based recommendations
      const milestoneRecommendations = await this.generateMilestoneRecommendations(child);
      recommendations.push(...milestoneRecommendations);

      // Generate intervention recommendations if needed
      const interventionRecommendations = await this.generateInterventionRecommendations(child);
      recommendations.push(...interventionRecommendations);

      // Generate enrichment recommendations
      const enrichmentRecommendations = await this.generateEnrichmentRecommendations(child);
      recommendations.push(...enrichmentRecommendations);

      // Save recommendations to database
      for (const recommendation of recommendations) {
        await this.createRecommendation({
          recommendation_type: recommendation.recommendation_type || 'development_guidance',
          title: recommendation.title,
          description: recommendation.description || '',
          action_items: recommendation.action_items,
          priority: recommendation.priority || 'medium'
        });
      }

    } catch (error) {
      console.error('Error generating development recommendations:', error);
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
        case 'milestone_assessment':
          return await this.executeMilestoneAssessment(task);
        case 'progress_review':
          return await this.executeProgressReview(task);
        case 'delay_screening':
          return await this.executeDelayScreening(task);
        default:
          return {
            success: false,
            message: 'Unknown task type.'
          };
      }
    } catch (error) {
      console.error('Error executing development task:', error);
      return {
        success: false,
        message: 'Failed to execute development task.'
      };
    }
  }

  private async analyzeMilestones(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze the developmental milestones for a ${child.age}-year-old child named ${child.name}.
    
    Consider:
    - Age-appropriate developmental expectations
    - Current strengths and interests: ${child.strengths?.join(', ') || 'various areas'}
    - Potential areas for development
    
    Provide a structured analysis of:
    1. Current developmental status
    2. Expected milestones for this age
    3. Areas of strength
    4. Areas needing attention
    5. Recommended focus areas
    
    Format as a clear, actionable insight.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'milestone_analysis',
        title: `Developmental Milestone Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.85,
        data_sources: { child_age: child.age, child_interests: child.interests, child_strengths: child.strengths },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing milestones:', error);
      return null;
    }
  }

  private async analyzeProgress(child: any): Promise<AgentInsight | null> {
    const prompt = `Analyze the development progress for ${child.name} (${child.age} years old).
    
    Consider the child's:
    - Current age and developmental stage
    - Interests: ${child.interests?.join(', ') || 'various areas'}
    - Strengths: ${child.strengths?.join(', ') || 'various areas'}
    - Learning style: ${child.learning_style || 'not specified'}
    
    Provide insights on:
    1. Progress patterns
    2. Developmental trajectory
    3. Areas of accelerated development
    4. Areas needing additional support
    5. Predictions for upcoming milestones
    
    Focus on evidence-based analysis and practical insights.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'progress_analysis',
        title: `Development Progress Analysis for ${child.name}`,
        content: analysis,
        confidence_score: 0.8,
        data_sources: { child_profile: child },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing progress:', error);
      return null;
    }
  }

  private async analyzePotentialDelays(child: any): Promise<AgentInsight | null> {
    const prompt = `Conduct a developmental screening for ${child.name} (${child.age} years old).
    
    Assess for potential delays in:
    1. Physical development
    2. Cognitive development
    3. Language development
    4. Social-emotional development
    5. Adaptive skills
    
    Consider the child's:
    - Age-appropriate expectations
    - Current abilities and interests
    - Family context and support
    
    Provide a structured assessment with:
    - Areas of concern (if any)
    - Risk factors
    - Recommended monitoring
    - When to seek professional evaluation
    
    Be supportive and evidence-based in your analysis.`;

    try {
      const analysis = await this.callAI(prompt);
      
      return {
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        insight_type: 'delay_screening',
        title: `Developmental Screening for ${child.name}`,
        content: analysis,
        confidence_score: 0.75,
        data_sources: { child_age: child.age, screening_date: new Date().toISOString() },
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error analyzing potential delays:', error);
      return null;
    }
  }

  private async generateMilestoneRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate milestone-based recommendations for ${child.name} (${child.age} years old).
    
    Consider:
    - Age-appropriate developmental goals
    - Child's interests: ${child.interests?.join(', ') || 'various areas'}
    - Child's strengths: ${child.strengths?.join(', ') || 'various areas'}
    
    Provide 3-5 specific, actionable recommendations for:
    1. Supporting current developmental stage
    2. Preparing for upcoming milestones
    3. Building on existing strengths
    4. Addressing any areas of concern
    
    Format each recommendation with:
    - Clear title
    - Specific description
    - Actionable steps
    - Expected outcomes
    - Timeline for implementation`;

    try {
      const response = await this.callAI(prompt);
      const recommendations: AgentRecommendation[] = [];
      
      // Parse the AI response and create recommendation objects
      // This is a simplified version - in practice, you'd parse the response more carefully
      recommendations.push({
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'milestone_support',
        title: `Developmental Milestone Support for ${child.name}`,
        description: response,
        action_items: { activities: [], timeline: 'ongoing' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return recommendations;
    } catch (error) {
      console.error('Error generating milestone recommendations:', error);
      return [];
    }
  }

  private async generateInterventionRecommendations(child: any): Promise<AgentRecommendation[]> {
    // Only generate if there are specific concerns
    const prompt = `Assess if ${child.name} (${child.age} years old) needs any developmental interventions.
    
    Consider:
    - Age-appropriate expectations
    - Current developmental status
    - Any areas of concern
    - Family resources and support
    
    If interventions are needed, provide specific recommendations for:
    1. Early intervention strategies
    2. Professional evaluation needs
    3. Home-based support activities
    4. Monitoring and follow-up
    
    If no interventions are needed, provide recommendations for:
    1. Continued developmental support
    2. Enrichment activities
    3. Monitoring progress`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'developmental_intervention',
        title: `Developmental Support Plan for ${child.name}`,
        description: response,
        action_items: { interventions: [], timeline: 'ongoing' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating intervention recommendations:', error);
      return [];
    }
  }

  private async generateEnrichmentRecommendations(child: any): Promise<AgentRecommendation[]> {
    const prompt = `Generate enrichment recommendations for ${child.name} (${child.age} years old).
    
    Focus on:
    - Age-appropriate activities
    - Child's interests: ${child.interests?.join(', ') || 'various areas'}
    - Child's strengths: ${child.strengths?.join(', ') || 'various areas'}
    - Developmental needs
    
    Provide recommendations for:
    1. Learning activities
    2. Social development opportunities
    3. Physical development activities
    4. Creative expression
    5. Cognitive development games
    
    Make recommendations specific, practical, and engaging.`;

    try {
      const response = await this.callAI(prompt);
      
      return [{
        id: '',
        sub_agent_id: this.agent.id,
        child_id: child.id,
        recommendation_type: 'enrichment_activities',
        title: `Enrichment Activities for ${child.name}`,
        description: response,
        action_items: { activities: [], schedule: 'flexible' },
        priority: 'medium',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    } catch (error) {
      console.error('Error generating enrichment recommendations:', error);
      return [];
    }
  }

  private async executeMilestoneAssessment(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeMilestones(child);
      const recommendations = await this.generateMilestoneRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Milestone assessment completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete milestone assessment.' };
    }
  }

  private async executeProgressReview(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzeProgress(child);
      const recommendations = await this.generateEnrichmentRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Progress review completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete progress review.' };
    }
  }

  private async executeDelayScreening(task: AgentTask): Promise<AgentResponse> {
    const child = await this.getChildData();
    if (!child) {
      return { success: false, message: 'Child data not available.' };
    }

    try {
      const insight = await this.analyzePotentialDelays(child);
      const recommendations = await this.generateInterventionRecommendations(child);
      
      await this.updateTask(task.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: { insight, recommendations }
      });

      return {
        success: true,
        message: 'Delay screening completed successfully.',
        data: { insight, recommendations }
      };
    } catch (error) {
      await this.updateTask(task.id, { status: 'failed' });
      return { success: false, message: 'Failed to complete delay screening.' };
    }
  }
} 