import { BaseAgent } from './base-agent';
import { ISchedulerAgent, TaskInput, DispatcherResult, AnalystResult, SchedulerResult } from './interfaces';
import { AgentContext } from './base-agent';

export class SchedulerAgent extends BaseAgent implements ISchedulerAgent {
  constructor(context: AgentContext) {
    // Create a mock agent for the scheduler
    const mockAgent = {
      id: 'scheduler-agent',
      name: 'Task Scheduler',
      description: 'Schedules actions and creates timelines',
      agent_type_id: 'scheduler',
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
        name: 'timeline_creation',
        description: 'Create structured timelines for activities',
        enabled: true
      },
      {
        name: 'action_scheduling',
        description: 'Schedule specific actions with timeframes',
        enabled: true
      },
      {
        name: 'reminder_generation',
        description: 'Generate appropriate reminders for tasks',
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

    const mockDispatcherResult: DispatcherResult = {
      category: 'scheduling_planning',
      priority: 'medium',
      requiresAnalysis: false,
      requiresScheduling: true,
      estimatedProcessingTime: 2000,
      suggestedActions: []
    };

    const mockAnalystResult: AnalystResult = {
      insights: ['Sample insight'],
      patterns: ['Sample pattern'],
      recommendations: ['Sample recommendation'],
      confidenceScore: 0.8,
      dataSources: ['input_data']
    };

    return await this.scheduleActions(taskInput, mockDispatcherResult, mockAnalystResult);
  }

  async generateInsights(): Promise<any[]> {
    return [];
  }

  async generateRecommendations(): Promise<any[]> {
    return [];
  }

  async executeTask(taskId: string): Promise<any> {
    return { success: false, message: 'Scheduler does not execute tasks directly' };
  }

  async scheduleActions(
    input: TaskInput, 
    dispatcherResult: DispatcherResult, 
    analystResult: AnalystResult
  ): Promise<SchedulerResult> {
    const startTime = Date.now();
    
    try {
      // Combine all actions from different sources
      const allActions = [
        ...dispatcherResult.suggestedActions,
        ...analystResult.recommendations
      ];

      const scheduledActions = await this.createScheduledActions(allActions, dispatcherResult.priority);
      const timeline = await this.createTimeline(allActions, this.determineTimeframe(dispatcherResult.category));
      const reminders = await this.generateReminders(allActions, timeline);

      const result: SchedulerResult = {
        scheduledActions,
        timeline,
        reminders
      };

      // Track cost
      const processingTime = Date.now() - startTime;
      await this.logLearningData('scheduler_processing', {
        input: input.rawInput,
        dispatcherResult,
        analystResult,
        result,
        processingTime
      });

      return result;
    } catch (error) {
      console.error('Error in scheduler processing:', error);
      throw error;
    }
  }

  async createTimeline(actions: string[], timeframe: string): Promise<Array<{date: string, activities: string[]}>> {
    const prompt = `
You are a scheduling expert for parenting activities. Create a timeline for these actions:

Actions:
${actions.map(action => `- ${action}`).join('\n')}

Timeframe: ${timeframe}

Create a structured timeline with specific dates and activities. Consider:
- Child's age and development level
- Parent's availability
- Activity complexity and duration
- Logical progression of activities

Format as a timeline with dates and activities.
`;

    const response = await this.callAI(prompt, 'You are a scheduling expert. Create a structured timeline with dates and activities.');
    
    // Parse the response into timeline format
    const timeline = this.parseTimelineResponse(response);
    return timeline;
  }

  async generateReminders(actions: string[], timeline: any[]): Promise<Array<{type: string, message: string, dueDate: string}>> {
    const prompt = `
Based on these actions and timeline, generate appropriate reminders:

Actions:
${actions.map(action => `- ${action}`).join('\n')}

Timeline:
${timeline.map(item => `- ${item.date}: ${item.activities.join(', ')}`).join('\n')}

Generate 2-3 specific reminders that would help the parent stay on track.
Include the type of reminder, message, and due date.
`;

    const response = await this.callAI(prompt, 'You are a reminder generation expert. Create specific, helpful reminders.');
    
    return this.parseRemindersResponse(response);
  }

  private async createScheduledActions(actions: string[], priority: string): Promise<Array<{
    action: string;
    timeframe: string;
    priority: 'low' | 'medium' | 'high';
    estimatedDuration: number;
  }>> {
    const scheduledActions = [];
    
    for (const action of actions) {
      const timeframe = this.determineTimeframeForAction(action);
      const estimatedDuration = this.estimateDuration(action);
      
      scheduledActions.push({
        action,
        timeframe,
        priority: priority as 'low' | 'medium' | 'high',
        estimatedDuration
      });
    }
    
    return scheduledActions;
  }

  private determineTimeframe(category: string): string {
    const timeframes: Record<string, string> = {
      'development_tracking': '1-2 weeks',
      'learning_activities': '1 week',
      'behavior_analysis': '2-3 weeks',
      'health_wellness': '1 week',
      'scheduling_planning': '1-2 weeks',
      'emotional_support': '1 week',
      'social_skills': '2-3 weeks',
      'academic_planning': '1 month',
      'creative_activities': '1 week',
      'technology_management': '1 week'
    };
    
    return timeframes[category] || '1 week';
  }

  private determineTimeframeForAction(action: string): string {
    // Simple logic to determine timeframe based on action content
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('immediate') || actionLower.includes('today')) {
      return 'today';
    }
    
    if (actionLower.includes('week') || actionLower.includes('daily')) {
      return 'this week';
    }
    
    if (actionLower.includes('month') || actionLower.includes('long-term')) {
      return 'this month';
    }
    
    return 'this week'; // Default
  }

  private estimateDuration(action: string): number {
    // Estimate duration in minutes based on action complexity
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('quick') || actionLower.includes('simple')) {
      return 15;
    }
    
    if (actionLower.includes('activity') || actionLower.includes('game')) {
      return 30;
    }
    
    if (actionLower.includes('session') || actionLower.includes('lesson')) {
      return 45;
    }
    
    if (actionLower.includes('project') || actionLower.includes('planning')) {
      return 60;
    }
    
    return 30; // Default 30 minutes
  }

  private parseTimelineResponse(response: string): Array<{date: string, activities: string[]}> {
    const timeline = [];
    const lines = response.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentDate = '';
    let currentActivities: string[] = [];
    
    for (const line of lines) {
      // Check if line contains a date
      if (line.match(/\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2}|today|tomorrow|next week|this week/i)) {
        // Save previous date if exists
        if (currentDate && currentActivities.length > 0) {
          timeline.push({ date: currentDate, activities: currentActivities });
        }
        
        // Start new date
        currentDate = line;
        currentActivities = [];
      } else if (line.startsWith('-') || line.startsWith('•')) {
        // This is an activity
        const activity = line.replace(/^[-•]\s*/, '').trim();
        if (activity) {
          currentActivities.push(activity);
        }
      }
    }
    
    // Add the last date
    if (currentDate && currentActivities.length > 0) {
      timeline.push({ date: currentDate, activities: currentActivities });
    }
    
    return timeline;
  }

  private parseRemindersResponse(response: string): Array<{type: string, message: string, dueDate: string}> {
    const reminders = [];
    const lines = response.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    for (const line of lines) {
      // Simple parsing - look for reminder patterns
      const match = line.match(/(.+?):\s*(.+?)\s*-\s*(.+)/i);
      if (match) {
        reminders.push({
          type: match[1].trim(),
          message: match[2].trim(),
          dueDate: match[3].trim()
        });
      }
    }
    
    return reminders;
  }
} 