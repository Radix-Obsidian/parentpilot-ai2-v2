import express from 'express';
import { TaskProcessor } from '../agents/task-processor';
import { TaskInput } from '../agents/interfaces';
import { AgentContext } from '../agents/base-agent';
import { dbService } from '../database/config';

const router = express.Router();

// Middleware to validate user authentication
const authenticateUser = async (req: any, res: any, next: any) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }
  req.userId = userId;
  next();
};

// Process a task through the multi-agent system
router.post('/process', authenticateUser, async (req, res) => {
  try {
    const { rawInput, category, priority, childId } = req.body;
    
    if (!rawInput) {
      return res.status(400).json({ 
        success: false, 
        error: 'Raw input is required' 
      });
    }

    const context: AgentContext = {
      userId: req.userId,
      childId,
      child: childId ? await dbService.getChildById(childId) : undefined,
      user: await dbService.getUserById(req.userId)
    };

    const taskProcessor = new TaskProcessor(context);
    
    const taskInput: TaskInput = {
      rawInput,
      category,
      priority,
      userId: req.userId,
      childId,
      context
    };

    const result = await taskProcessor.processTask(taskInput);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error processing multi-agent task:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process task' 
    });
  }
});

// Get task status by ID
router.get('/tasks/:taskId', authenticateUser, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const context: AgentContext = {
      userId: req.userId
    };

    const taskProcessor = new TaskProcessor(context);
    const task = await taskProcessor.getTaskStatus(taskId);

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task not found' 
      });
    }

    // Verify user owns this task
    if (task.userId !== req.userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    res.json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Error getting task status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get task status' 
    });
  }
});

// Get task history for a user
router.get('/tasks', authenticateUser, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const context: AgentContext = {
      userId: req.userId
    };

    const taskProcessor = new TaskProcessor(context);
    const tasks = await taskProcessor.getTaskHistory(req.userId, Number(limit));

    res.json({
      success: true,
      data: tasks
    });

  } catch (error) {
    console.error('Error getting task history:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get task history' 
    });
  }
});

// Get cost analytics for a user
router.get('/costs', authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = dbService.supabase
      .from('subagent_logs')
      .select('*')
      .eq('task_id', dbService.supabase
        .from('subagent_tasks')
        .select('id')
        .eq('user_id', req.userId)
      );

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate cost analytics
    const totalCost = data.reduce((sum, log) => sum + (log.cost_cents || 0), 0);
    const totalTokens = data.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
    const totalExecutionTime = data.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0);
    
    const costByAgent = data.reduce((acc, log) => {
      const agent = log.agent_name;
      acc[agent] = (acc[agent] || 0) + (log.cost_cents || 0);
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        totalCostCents: totalCost,
        totalTokens,
        totalExecutionTimeMs: totalExecutionTime,
        costByAgent,
        taskCount: data.length
      }
    });

  } catch (error) {
    console.error('Error getting cost analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get cost analytics' 
    });
  }
});

// Get agent performance metrics
router.get('/performance', authenticateUser, async (req, res) => {
  try {
    const { agentName } = req.query;
    
    let query = dbService.supabase
      .from('subagent_logs')
      .select('*')
      .eq('task_id', dbService.supabase
        .from('subagent_tasks')
        .select('id')
        .eq('user_id', req.userId)
      );

    if (agentName) {
      query = query.eq('agent_name', agentName);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Calculate performance metrics
    const successfulTasks = data.filter(log => log.status === 'completed').length;
    const failedTasks = data.filter(log => log.status === 'failed').length;
    const successRate = data.length > 0 ? (successfulTasks / data.length) * 100 : 0;
    
    const avgExecutionTime = data.length > 0 
      ? data.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / data.length 
      : 0;
    
    const avgCost = data.length > 0 
      ? data.reduce((sum, log) => sum + (log.cost_cents || 0), 0) / data.length 
      : 0;

    res.json({
      success: true,
      data: {
        totalTasks: data.length,
        successfulTasks,
        failedTasks,
        successRate,
        avgExecutionTimeMs: avgExecutionTime,
        avgCostCents: avgCost,
        agentName: agentName || 'all'
      }
    });

  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get performance metrics' 
    });
  }
});

export { router as multiAgentRouter }; 