import express from 'express';
import { subAgentService } from '../agents/sub-agent-service';
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

// Get all sub-agents for a user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const agents = await subAgentService.getUserAgents(req.userId);
    res.json({ success: true, data: agents });
  } catch (error) {
    console.error('Error getting user agents:', error);
    res.status(500).json({ success: false, error: 'Failed to get agents' });
  }
});

// Create a new sub-agent
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { agentTypeId, name, description, configuration } = req.body;
    
    if (!agentTypeId || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Agent type ID and name are required' 
      });
    }

    const agent = await subAgentService.createSubAgent(
      req.userId,
      agentTypeId,
      name,
      description,
      configuration
    );

    if (agent) {
      res.json({ success: true, data: agent });
    } else {
      res.status(400).json({ success: false, error: 'Failed to create agent' });
    }
  } catch (error) {
    console.error('Error creating sub-agent:', error);
    res.status(500).json({ success: false, error: 'Failed to create agent' });
  }
});

// Get a specific sub-agent
router.get('/:agentId', authenticateUser, async (req, res) => {
  try {
    const agent = await subAgentService.getSubAgent(req.params.agentId, req.userId);
    
    if (agent) {
      res.json({ success: true, data: agent });
    } else {
      res.status(404).json({ success: false, error: 'Agent not found' });
    }
  } catch (error) {
    console.error('Error getting sub-agent:', error);
    res.status(500).json({ success: false, error: 'Failed to get agent' });
  }
});

// Update a sub-agent
router.put('/:agentId', authenticateUser, async (req, res) => {
  try {
    const agent = await subAgentService.updateSubAgent(req.params.agentId, req.body);
    
    if (agent) {
      res.json({ success: true, data: agent });
    } else {
      res.status(404).json({ success: false, error: 'Agent not found' });
    }
  } catch (error) {
    console.error('Error updating sub-agent:', error);
    res.status(500).json({ success: false, error: 'Failed to update agent' });
  }
});

// Deactivate a sub-agent
router.delete('/:agentId', authenticateUser, async (req, res) => {
  try {
    const success = await subAgentService.deactivateAgent(req.params.agentId);
    
    if (success) {
      res.json({ success: true, message: 'Agent deactivated successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Failed to deactivate agent' });
    }
  } catch (error) {
    console.error('Error deactivating agent:', error);
    res.status(500).json({ success: false, error: 'Failed to deactivate agent' });
  }
});

// Process message with a specific agent
router.post('/:agentId/process', authenticateUser, async (req, res) => {
  try {
    const { message, childId, context } = req.body;
    
    if (!message || !childId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and child ID are required' 
      });
    }

    const response = await subAgentService.processMessageWithAgent(
      req.params.agentId,
      req.userId,
      childId,
      message,
      context
    );

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error processing message with agent:', error);
    res.status(500).json({ success: false, error: 'Failed to process message' });
  }
});

// Route message to best agent
router.post('/route', authenticateUser, async (req, res) => {
  try {
    const { message, childId } = req.body;
    
    if (!message || !childId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and child ID are required' 
      });
    }

    const result = await subAgentService.routeMessageToBestAgent(
      req.userId,
      childId,
      message
    );

    if (result) {
      res.json({ success: true, data: result });
    } else {
      res.status(404).json({ success: false, error: 'No suitable agent found' });
    }
  } catch (error) {
    console.error('Error routing message:', error);
    res.status(500).json({ success: false, error: 'Failed to route message' });
  }
});

// Multi-agent collaboration
router.post('/collaborate', authenticateUser, async (req, res) => {
  try {
    const { message, childId, agentIds } = req.body;
    
    if (!message || !childId || !agentIds || !Array.isArray(agentIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message, child ID, and agent IDs array are required' 
      });
    }

    const result = await subAgentService.collaborateWithMultipleAgents(
      req.userId,
      childId,
      message,
      agentIds
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in multi-agent collaboration:', error);
    res.status(500).json({ success: false, error: 'Failed to collaborate' });
  }
});

// Send message between agents
router.post('/:agentId/send-message', authenticateUser, async (req, res) => {
  try {
    const { toAgentId, messageType, content, priority } = req.body;
    
    if (!toAgentId || !messageType || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'To agent ID, message type, and content are required' 
      });
    }

    await subAgentService.sendAgentMessage(
      req.params.agentId,
      toAgentId,
      messageType,
      content,
      priority
    );

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending agent message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Get agent communications
router.get('/:agentId/communications', authenticateUser, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const communications = await subAgentService.getAgentCommunications(
      req.params.agentId,
      limit
    );

    res.json({ success: true, data: communications });
  } catch (error) {
    console.error('Error getting agent communications:', error);
    res.status(500).json({ success: false, error: 'Failed to get communications' });
  }
});

// Get agent capabilities
router.get('/:agentId/capabilities', authenticateUser, async (req, res) => {
  try {
    const capabilities = await subAgentService.getAgentCapabilities(
      req.params.agentId,
      req.userId
    );

    res.json({ success: true, data: capabilities });
  } catch (error) {
    console.error('Error getting agent capabilities:', error);
    res.status(500).json({ success: false, error: 'Failed to get capabilities' });
  }
});

// Update agent capability
router.put('/:agentId/capabilities/:capabilityName', authenticateUser, async (req, res) => {
  try {
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        error: 'Enabled flag is required' 
      });
    }

    const success = await subAgentService.updateAgentCapability(
      req.params.agentId,
      req.params.capabilityName,
      enabled
    );

    if (success) {
      res.json({ success: true, message: 'Capability updated successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Failed to update capability' });
    }
  } catch (error) {
    console.error('Error updating agent capability:', error);
    res.status(500).json({ success: false, error: 'Failed to update capability' });
  }
});

// Get agent performance metrics
router.get('/:agentId/performance', authenticateUser, async (req, res) => {
  try {
    const metrics = await subAgentService.getAgentPerformanceMetrics(req.params.agentId);
    res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error getting agent performance metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to get performance metrics' });
  }
});

// Start agent training
router.post('/:agentId/train/start', authenticateUser, async (req, res) => {
  try {
    const success = await subAgentService.startAgentTraining(req.params.agentId, req.userId);
    
    if (success) {
      res.json({ success: true, message: 'Agent training started' });
    } else {
      res.status(400).json({ success: false, error: 'Failed to start training' });
    }
  } catch (error) {
    console.error('Error starting agent training:', error);
    res.status(500).json({ success: false, error: 'Failed to start training' });
  }
});

// Complete agent training
router.post('/:agentId/train/complete', authenticateUser, async (req, res) => {
  try {
    const success = await subAgentService.completeAgentTraining(req.params.agentId, req.userId);
    
    if (success) {
      res.json({ success: true, message: 'Agent training completed' });
    } else {
      res.status(400).json({ success: false, error: 'Failed to complete training' });
    }
  } catch (error) {
    console.error('Error completing agent training:', error);
    res.status(500).json({ success: false, error: 'Failed to complete training' });
  }
});

// Get agent tasks
router.get('/:agentId/tasks', authenticateUser, async (req, res) => {
  try {
    const status = req.query.status as string;
    const tasks = await subAgentService.getAgentTasks(req.params.agentId, status);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error getting agent tasks:', error);
    res.status(500).json({ success: false, error: 'Failed to get tasks' });
  }
});

// Create agent task
router.post('/:agentId/tasks', authenticateUser, async (req, res) => {
  try {
    const { childId, taskData } = req.body;
    
    if (!childId || !taskData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Child ID and task data are required' 
      });
    }

    const task = await subAgentService.createAgentTask(
      req.params.agentId,
      childId,
      taskData
    );

    if (task) {
      res.json({ success: true, data: task });
    } else {
      res.status(400).json({ success: false, error: 'Failed to create task' });
    }
  } catch (error) {
    console.error('Error creating agent task:', error);
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
});

// Update agent task
router.put('/tasks/:taskId', authenticateUser, async (req, res) => {
  try {
    const task = await subAgentService.updateAgentTask(req.params.taskId, req.body);
    
    if (task) {
      res.json({ success: true, data: task });
    } else {
      res.status(404).json({ success: false, error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating agent task:', error);
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
});

// Execute agent task
router.post('/:agentId/tasks/:taskId/execute', authenticateUser, async (req, res) => {
  try {
    const { childId } = req.body;
    
    if (!childId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Child ID is required' 
      });
    }

    const response = await subAgentService.executeAgentTask(
      req.params.agentId,
      req.params.taskId,
      req.userId,
      childId
    );

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Error executing agent task:', error);
    res.status(500).json({ success: false, error: 'Failed to execute task' });
  }
});

// Get agent insights
router.get('/:agentId/insights', authenticateUser, async (req, res) => {
  try {
    const childId = req.query.childId as string;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const insights = await subAgentService.getAgentInsights(
      req.params.agentId,
      childId,
      limit
    );

    res.json({ success: true, data: insights });
  } catch (error) {
    console.error('Error getting agent insights:', error);
    res.status(500).json({ success: false, error: 'Failed to get insights' });
  }
});

// Generate agent insights
router.post('/:agentId/insights/generate', authenticateUser, async (req, res) => {
  try {
    const { childId } = req.body;
    
    if (!childId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Child ID is required' 
      });
    }

    const insights = await subAgentService.generateAgentInsights(
      req.params.agentId,
      req.userId,
      childId
    );

    res.json({ success: true, data: insights });
  } catch (error) {
    console.error('Error generating agent insights:', error);
    res.status(500).json({ success: false, error: 'Failed to generate insights' });
  }
});

// Get agent recommendations
router.get('/:agentId/recommendations', authenticateUser, async (req, res) => {
  try {
    const childId = req.query.childId as string;
    const status = req.query.status as string;
    
    const recommendations = await subAgentService.getAgentRecommendations(
      req.params.agentId,
      childId,
      status
    );

    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Error getting agent recommendations:', error);
    res.status(500).json({ success: false, error: 'Failed to get recommendations' });
  }
});

// Generate agent recommendations
router.post('/:agentId/recommendations/generate', authenticateUser, async (req, res) => {
  try {
    const { childId } = req.body;
    
    if (!childId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Child ID is required' 
      });
    }

    const recommendations = await subAgentService.generateAgentRecommendations(
      req.params.agentId,
      req.userId,
      childId
    );

    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Error generating agent recommendations:', error);
    res.status(500).json({ success: false, error: 'Failed to generate recommendations' });
  }
});

// Get service status and configuration
router.get('/service/status', authenticateUser, async (req, res) => {
  try {
    const config = subAgentService.getServiceConfig();
    const activeAgentsCount = subAgentService.getActiveAgentsCount();
    
    res.json({ 
      success: true, 
      data: {
        config,
        activeAgentsCount,
        status: 'running'
      }
    });
  } catch (error) {
    console.error('Error getting service status:', error);
    res.status(500).json({ success: false, error: 'Failed to get service status' });
  }
});

export default router; 