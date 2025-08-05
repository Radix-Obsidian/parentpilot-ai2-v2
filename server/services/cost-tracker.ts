import { dbService } from '../database/config';
import { CostTracking } from '../agents/interfaces';

export interface BillingPlan {
  id: string;
  name: string;
  monthlyLimit: number; // in cents
  costPerToken: number; // in cents
  costPerMinute: number; // in cents
}

export interface UserBilling {
  userId: string;
  planId: string;
  currentUsage: number; // in cents
  monthlyLimit: number; // in cents
  resetDate: Date;
}

export class CostTracker {
  private billingPlans: Record<string, BillingPlan> = {
    'starter': {
      id: 'starter',
      name: 'Starter Plan',
      monthlyLimit: 1000, // $10
      costPerToken: 0.001, // $0.001 per token
      costPerMinute: 0.1 // $0.1 per minute
    },
    'pro': {
      id: 'pro',
      name: 'Pro Plan',
      monthlyLimit: 5000, // $50
      costPerToken: 0.0005, // $0.0005 per token
      costPerMinute: 0.05 // $0.05 per minute
    },
    'enterprise': {
      id: 'enterprise',
      name: 'Enterprise Plan',
      monthlyLimit: 50000, // $500
      costPerToken: 0.0002, // $0.0002 per token
      costPerMinute: 0.02 // $0.02 per minute
    }
  };

  async trackCost(costData: Omit<CostTracking, 'taskId' | 'agentName' | 'timestamp'>): Promise<void> {
    try {
      // Calculate cost based on tokens and execution time
      const cost = this.calculateCost(costData.tokensUsed, costData.executionTimeMs);
      
      // Update user billing
      await this.updateUserBilling(costData.userId, cost);
      
      // Log the cost
      await this.logCost(costData.userId, cost, costData);
      
    } catch (error) {
      console.error('Error tracking cost:', error);
    }
  }

  async getUserBilling(userId: string): Promise<UserBilling | null> {
    try {
      const user = await dbService.getUserById(userId);
      if (!user) return null;

      const plan = this.billingPlans[user.subscription_plan || 'starter'];
      const currentUsage = await this.getCurrentMonthUsage(userId);
      
      return {
        userId,
        planId: user.subscription_plan || 'starter',
        currentUsage,
        monthlyLimit: plan.monthlyLimit,
        resetDate: this.getNextResetDate()
      };
    } catch (error) {
      console.error('Error getting user billing:', error);
      return null;
    }
  }

  async checkUsageLimit(userId: string, estimatedCost: number): Promise<boolean> {
    try {
      const billing = await this.getUserBilling(userId);
      if (!billing) return false;

      const totalCost = billing.currentUsage + estimatedCost;
      return totalCost <= billing.monthlyLimit;
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return false;
    }
  }

  async getCostAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<any> {
    try {
      let query = dbService.supabase
        .from('subagent_logs')
        .select('*')
        .eq('task_id', dbService.supabase
          .from('subagent_tasks')
          .select('id')
          .eq('user_id', userId)
        );

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Calculate analytics
      const totalCost = data.reduce((sum, log) => sum + (log.cost_cents || 0), 0);
      const totalTokens = data.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const totalExecutionTime = data.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0);
      
      const costByAgent = data.reduce((acc, log) => {
        const agent = log.agent_name;
        acc[agent] = (acc[agent] || 0) + (log.cost_cents || 0);
        return acc;
      }, {} as Record<string, number>);

      const costByDay = data.reduce((acc, log) => {
        const date = new Date(log.created_at).toDateString();
        acc[date] = (acc[date] || 0) + (log.cost_cents || 0);
        return acc;
      }, {} as Record<string, number>);

      return {
        totalCostCents: totalCost,
        totalTokens,
        totalExecutionTimeMs: totalExecutionTime,
        costByAgent,
        costByDay,
        taskCount: data.length,
        averageCostPerTask: data.length > 0 ? totalCost / data.length : 0
      };
    } catch (error) {
      console.error('Error getting cost analytics:', error);
      throw error;
    }
  }

  async getBillingPlans(): Promise<BillingPlan[]> {
    return Object.values(this.billingPlans);
  }

  async upgradePlan(userId: string, planId: string): Promise<boolean> {
    try {
      const plan = this.billingPlans[planId];
      if (!plan) {
        throw new Error(`Invalid plan: ${planId}`);
      }

      await dbService.supabase
        .from('users')
        .update({ 
          subscription_plan: planId,
          updated_at: new Date()
        })
        .eq('id', userId);

      return true;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      return false;
    }
  }

  private calculateCost(tokensUsed: number, executionTimeMs: number): number {
    // Default to starter plan pricing
    const plan = this.billingPlans.starter;
    
    const tokenCost = tokensUsed * plan.costPerToken;
    const timeCost = (executionTimeMs / 60000) * plan.costPerMinute; // Convert ms to minutes
    
    return Math.round((tokenCost + timeCost) * 100); // Convert to cents
  }

  private async updateUserBilling(userId: string, costCents: number): Promise<void> {
    try {
      // This would typically update a billing table
      // For now, we'll just log the cost
      console.log(`User ${userId} incurred cost: ${costCents} cents`);
    } catch (error) {
      console.error('Error updating user billing:', error);
    }
  }

  private async getCurrentMonthUsage(userId: string): Promise<number> {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await dbService.supabase
        .from('subagent_logs')
        .select('cost_cents')
        .eq('task_id', dbService.supabase
          .from('subagent_tasks')
          .select('id')
          .eq('user_id', userId)
        )
        .gte('created_at', startOfMonth.toISOString());

      if (error) {
        throw error;
      }

      return data.reduce((sum, log) => sum + (log.cost_cents || 0), 0);
    } catch (error) {
      console.error('Error getting current month usage:', error);
      return 0;
    }
  }

  private async logCost(userId: string, costCents: number, costData: any): Promise<void> {
    try {
      // This would typically log to a billing/audit table
      console.log(`Cost logged for user ${userId}: ${costCents} cents`, costData);
    } catch (error) {
      console.error('Error logging cost:', error);
    }
  }

  private getNextResetDate(): Date {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  }
}

// Export singleton instance
export const costTracker = new CostTracker(); 