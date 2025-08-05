import { BaseAgent } from './base-agent';
import { IAnalystAgent, TaskInput, DispatcherResult, AnalystResult } from './interfaces';
import { AgentContext } from './base-agent';

export class AnalystAgent extends BaseAgent implements IAnalystAgent {
  constructor(context: AgentContext) {
    // Create a mock agent for the analyst
    const mockAgent = {
      id: 'analyst-agent',
      name: 'Data Analyst',
      description: 'Analyzes patterns and provides insights',
      agent_type_id: 'analyst',
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
        name: 'pattern_recognition',
        description: 'Identify patterns in behavior and development',
        enabled: true
      },
      {
        name: 'insight_generation',
        description: 'Generate actionable insights from data',
        enabled: true
      },
      {
        name: 'recommendation_engine',
        description: 'Provide personalized recommendations',
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
      category: 'development_tracking',
      priority: 'medium',
      requiresAnalysis: true,
      requiresScheduling: false,
      estimatedProcessingTime: 3000,
      suggestedActions: []
    };

    return await this.analyzeInput(taskInput, mockDispatcherResult);
  }

  async generateInsights(): Promise<any[]> {
    return [];
  }



  async executeTask(taskId: string): Promise<any> {
    return { success: false, message: 'Analyst does not execute tasks directly' };
  }

  async analyzeInput(input: TaskInput, dispatcherResult: DispatcherResult): Promise<AnalystResult> {
    const startTime = Date.now();
    
    try {
      const insights = await this.extractInsights(input.rawInput, this.context);
      const patterns = await this.identifyPatterns(input.rawInput, []);
      const recommendations = await this.generateRecommendations(insights, patterns);
      
      // Calculate confidence score based on data quality and pattern strength
      const confidenceScore = this.calculateConfidenceScore(insights, patterns, input.rawInput);
      
      const dataSources = await this.identifyDataSources(input.rawInput, this.context);
      
      const result: AnalystResult = {
        insights,
        patterns,
        recommendations,
        confidenceScore,
        dataSources
      };

      // Track cost
      const processingTime = Date.now() - startTime;
      await this.logLearningData('analyst_processing', {
        input: input.rawInput,
        dispatcherResult,
        result,
        processingTime
      });

      return result;
    } catch (error) {
      console.error('Error in analyst processing:', error);
      throw error;
    }
  }

  async extractInsights(input: string, context: AgentContext): Promise<string[]> {
    const childContext = await this.getChildData();
    const userContext = await this.getUserData();
    
    const prompt = `
You are a child development analyst. Analyze this parenting situation and extract key insights:

Input: "${input}"
Category: ${context.child ? `Child: ${context.child.name} (${context.child.age} years old)` : 'No child data'}
${childContext ? `Child Interests: ${childContext.interests?.join(', ') || 'None'}` : ''}
${childContext ? `Child Strengths: ${childContext.strengths?.join(', ') || 'None'}` : ''}

Provide 3-5 specific insights about:
1. Child development patterns
2. Parent-child interaction dynamics
3. Potential areas for growth
4. Immediate concerns or opportunities

Format as a list of insights.
`;

    const response = await this.callAI(prompt, 'You are a child development analyst. Provide specific, actionable insights.');
    
    return response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+\./))
      .slice(0, 5);
  }

  async identifyPatterns(input: string, historicalData: any[]): Promise<string[]> {
    const prompt = `
You are a pattern recognition expert for child development. 
Identify recurring patterns in this parenting situation:

Input: "${input}"

Look for patterns related to:
- Behavioral patterns
- Developmental milestones
- Learning patterns
- Social interaction patterns
- Emotional response patterns

Provide 2-3 specific patterns you can identify.
`;

    const response = await this.callAI(prompt, 'You are a pattern recognition expert. Identify specific, observable patterns.');
    
    return response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+\./))
      .slice(0, 3);
  }

  async generateRecommendations(insights: string[], patterns: string[]): Promise<string[]> {
    const prompt = `
Based on these insights and patterns, generate 3-4 specific recommendations for the parent:

Insights:
${insights.map(insight => `- ${insight}`).join('\n')}

Patterns:
${patterns.map(pattern => `- ${pattern}`).join('\n')}

Provide actionable, specific recommendations that the parent can implement immediately or in the near future.
`;

    const response = await this.callAI(prompt, 'You are a parenting expert. Provide specific, actionable recommendations.');
    
    return response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^\d+\./))
      .slice(0, 4);
  }

  private calculateConfidenceScore(insights: string[], patterns: string[], input: string): number {
    // Simple confidence calculation based on data quality
    let score = 0.5; // Base score
    
    // Increase score for more insights
    score += Math.min(insights.length * 0.1, 0.3);
    
    // Increase score for more patterns
    score += Math.min(patterns.length * 0.1, 0.2);
    
    // Increase score for longer, more detailed input
    if (input.length > 100) score += 0.1;
    if (input.length > 200) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private async identifyDataSources(input: string, context: AgentContext): Promise<string[]> {
    const sources = [];
    
    if (context.child) sources.push('child_profile');
    if (context.user) sources.push('parent_profile');
    if (input.length > 50) sources.push('detailed_input');
    
    // Add more sophisticated data source identification
    if (input.toLowerCase().includes('behavior') || input.toLowerCase().includes('acting')) {
      sources.push('behavioral_observation');
    }
    
    if (input.toLowerCase().includes('learning') || input.toLowerCase().includes('school')) {
      sources.push('academic_data');
    }
    
    if (input.toLowerCase().includes('social') || input.toLowerCase().includes('friend')) {
      sources.push('social_interaction_data');
    }
    
    return sources;
  }
} 