import { BaseAgent } from './base-agent';
import { IDispatcherAgent, TaskInput, DispatcherResult } from './interfaces';
import { AgentContext } from './base-agent';

export class DispatcherAgent extends BaseAgent implements IDispatcherAgent {
  constructor(context: AgentContext) {
    // Create a mock agent for the dispatcher
    const mockAgent = {
      id: 'dispatcher-agent',
      name: 'Task Dispatcher',
      description: 'Categorizes and prioritizes incoming tasks',
      agent_type_id: 'dispatcher',
      user_id: context.userId,
      configuration: {},
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    super(mockAgent, context);
  }

  protected initializeCapabilities() {
    return [
      {
        name: 'task_categorization',
        description: 'Categorize incoming tasks into appropriate domains',
        enabled: true
      },
      {
        name: 'priority_assessment',
        description: 'Determine task priority based on urgency and importance',
        enabled: true
      },
      {
        name: 'processing_estimation',
        description: 'Estimate processing time for different task types',
        enabled: true
      }
    ];
  }

  async processMessage(message: string): Promise<any> {
    const taskInput: TaskInput = {
      rawInput: message,
      userId: this.context.userId,
      childId: this.context.childId,
      context: this.context
    };

    return await this.processTask(taskInput);
  }

  async generateInsights(): Promise<any[]> {
    return [];
  }

  async generateRecommendations(): Promise<any[]> {
    return [];
  }

  async executeTask(taskId: string): Promise<any> {
    return { success: false, message: 'Dispatcher does not execute tasks directly' };
  }

  async processTask(input: TaskInput): Promise<DispatcherResult> {
    const startTime = Date.now();
    
    try {
      const category = await this.categorizeInput(input.rawInput);
      const priority = await this.determinePriority(input.rawInput, category);
      const estimatedProcessingTime = await this.estimateProcessingTime(category, priority);
      
      const requiresAnalysis = this.shouldRequireAnalysis(category, priority);
      const requiresScheduling = this.shouldRequireScheduling(category, priority);
      
      const suggestedActions = await this.generateSuggestedActions(input.rawInput, category, priority);
      
      const result: DispatcherResult = {
        category,
        priority,
        requiresAnalysis,
        requiresScheduling,
        estimatedProcessingTime,
        suggestedActions
      };

      // Track cost
      const processingTime = Date.now() - startTime;
      await this.logLearningData('dispatcher_processing', {
        input: input.rawInput,
        result,
        processingTime
      });

      return result;
    } catch (error) {
      console.error('Error in dispatcher processing:', error);
      throw error;
    }
  }

  async categorizeInput(input: string): Promise<string> {
    const prompt = `
You are a task categorization expert for a parenting AI system. 
Categorize the following input into one of these categories:

- development_tracking (milestones, progress, growth)
- learning_activities (educational activities, homework, skills)
- behavior_analysis (behavior patterns, discipline, social skills)
- health_wellness (nutrition, exercise, medical concerns)
- scheduling_planning (routines, appointments, time management)
- emotional_support (feelings, stress, mental health)
- social_skills (friendships, communication, group activities)
- academic_planning (school performance, curriculum, goals)
- creative_activities (arts, crafts, imagination)
- technology_management (screen time, digital learning)

Input: "${input}"

Respond with only the category name.
`;

    const response = await this.callAI(prompt, 'You are a task categorization expert. Respond with only the category name.');
    return response.trim().toLowerCase();
  }

  async determinePriority(input: string, category: string): Promise<'low' | 'medium' | 'high'> {
    const prompt = `
You are a priority assessment expert for a parenting AI system.
Determine the priority level (low, medium, high) for this task:

Category: ${category}
Input: "${input}"

Consider:
- Urgency (immediate vs. long-term)
- Impact on child's development
- Parent's stress level
- Time sensitivity

Respond with only: low, medium, or high
`;

    const response = await this.callAI(prompt, 'You are a priority assessment expert. Respond with only: low, medium, or high.');
    const priority = response.trim().toLowerCase();
    
    if (['low', 'medium', 'high'].includes(priority)) {
      return priority as 'low' | 'medium' | 'high';
    }
    
    return 'medium'; // Default fallback
  }

  async estimateProcessingTime(category: string, priority: string): Promise<number> {
    // Base processing times in milliseconds
    const baseTimes: Record<string, number> = {
      development_tracking: 2000,
      learning_activities: 3000,
      behavior_analysis: 4000,
      health_wellness: 2500,
      scheduling_planning: 1500,
      emotional_support: 3500,
      social_skills: 3000,
      academic_planning: 3500,
      creative_activities: 2000,
      technology_management: 2500
    };

    const priorityMultipliers: Record<string, number> = {
      low: 0.7,
      medium: 1.0,
      high: 1.5
    };

    const baseTime = baseTimes[category] || 2500;
    const multiplier = priorityMultipliers[priority] || 1.0;
    
    return Math.round(baseTime * multiplier);
  }

  private shouldRequireAnalysis(category: string, priority: string): boolean {
    const analysisCategories = ['behavior_analysis', 'development_tracking', 'emotional_support'];
    return analysisCategories.includes(category) || priority === 'high';
  }

  private shouldRequireScheduling(category: string, priority: string): boolean {
    const schedulingCategories = ['scheduling_planning', 'learning_activities', 'academic_planning'];
    return schedulingCategories.includes(category) || priority === 'high';
  }

  private async generateSuggestedActions(input: string, category: string, priority: string): Promise<string[]> {
    const prompt = `
Based on this parenting task, suggest 2-3 immediate actions the parent could take:

Category: ${category}
Priority: ${priority}
Input: "${input}"

Provide practical, actionable suggestions that are specific and helpful.
`;

    const response = await this.callAI(prompt, 'You are a parenting expert. Provide 2-3 specific, actionable suggestions.');
    
    // Parse the response into an array of actions
    const actions = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+\./))
      .slice(0, 3);
    
    return actions;
  }
} 