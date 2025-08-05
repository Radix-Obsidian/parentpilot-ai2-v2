import { RequestHandler } from "express";
import { agentManager } from "../agents/agent-manager";
import { dbService } from "../database/config";

// Get all sub-agents for a user
export const handleGetUserAgents: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing user ID",
        message: "User ID is required"
      });
    }

    const agents = await agentManager.getUserAgents(userId);

    return res.status(200).json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error("Error getting user agents:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to get user agents"
    });
  }
};

// Get available agent types
export const handleGetAgentTypes: RequestHandler = async (req, res) => {
  try {
    const agentTypes = await agentManager.getAvailableAgentTypes();

    return res.status(200).json({
      success: true,
      data: agentTypes
    });
  } catch (error) {
    console.error("Error getting agent types:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to get agent types"
    });
  }
};

// Create a new sub-agent
export const handleCreateSubAgent: RequestHandler = async (req, res) => {
  try {
    const { userId, agentTypeId, name, description, configuration } = req.body;

    if (!userId || !agentTypeId || !name) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "User ID, agent type ID, and name are required"
      });
    }

    const agent = await agentManager.createSubAgent(
      userId,
      agentTypeId,
      name,
      description,
      configuration
    );

    if (!agent) {
      return res.status(500).json({
        success: false,
        error: "Creation failed",
        message: "Failed to create sub-agent"
      });
    }

    return res.status(201).json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error("Error creating sub-agent:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to create sub-agent"
    });
  }
};

// Update a sub-agent
export const handleUpdateSubAgent: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const updates = req.body;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Missing agent ID",
        message: "Agent ID is required"
      });
    }

    const agent = await agentManager.updateSubAgent(agentId, updates);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: "Agent not found",
        message: "Sub-agent not found or update failed"
      });
    }

    return res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    console.error("Error updating sub-agent:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to update sub-agent"
    });
  }
};

// Process message with a specific agent
export const handleProcessMessageWithAgent: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { userId, childId, message } = req.body;

    if (!agentId || !userId || !childId || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Agent ID, user ID, child ID, and message are required"
      });
    }

    const response = await agentManager.processMessageWithAgent(
      agentId,
      userId,
      childId,
      message
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error processing message with agent:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to process message with agent"
    });
  }
};

// Route message to best agent
export const handleRouteMessageToBestAgent: RequestHandler = async (req, res) => {
  try {
    const { userId, childId, message } = req.body;

    if (!userId || !childId || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "User ID, child ID, and message are required"
      });
    }

    const result = await agentManager.routeMessageToBestAgent(userId, childId, message);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "No suitable agent found",
        message: "No available agent to handle this message"
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error routing message to agent:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to route message to agent"
    });
  }
};

// Generate insights for a specific agent
export const handleGenerateAgentInsights: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { userId, childId } = req.body;

    if (!agentId || !userId || !childId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Agent ID, user ID, and child ID are required"
      });
    }

    const insights = await agentManager.generateAgentInsights(agentId, userId, childId);

    return res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error("Error generating agent insights:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to generate agent insights"
    });
  }
};

// Generate recommendations for a specific agent
export const handleGenerateAgentRecommendations: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { userId, childId } = req.body;

    if (!agentId || !userId || !childId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Agent ID, user ID, and child ID are required"
      });
    }

    const recommendations = await agentManager.generateAgentRecommendations(agentId, userId, childId);

    return res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error("Error generating agent recommendations:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to generate agent recommendations"
    });
  }
};

// Execute a task with a specific agent
export const handleExecuteAgentTask: RequestHandler = async (req, res) => {
  try {
    const { agentId, taskId } = req.params;
    const { userId, childId } = req.body;

    if (!agentId || !taskId || !userId || !childId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Agent ID, task ID, user ID, and child ID are required"
      });
    }

    const response = await agentManager.executeAgentTask(agentId, taskId, userId, childId);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error executing agent task:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to execute agent task"
    });
  }
};

// Get agent tasks
export const handleGetAgentTasks: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { status } = req.query;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Missing agent ID",
        message: "Agent ID is required"
      });
    }

    const tasks = await agentManager.getAgentTasks(agentId, status as string);

    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error("Error getting agent tasks:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to get agent tasks"
    });
  }
};

// Get agent insights
export const handleGetAgentInsights: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { childId, limit } = req.query;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Missing agent ID",
        message: "Agent ID is required"
      });
    }

    const insights = await agentManager.getAgentInsights(
      agentId,
      childId as string,
      limit ? parseInt(limit as string) : 20
    );

    return res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error("Error getting agent insights:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to get agent insights"
    });
  }
};

// Get agent recommendations
export const handleGetAgentRecommendations: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { childId, status } = req.query;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Missing agent ID",
        message: "Agent ID is required"
      });
    }

    const recommendations = await agentManager.getAgentRecommendations(
      agentId,
      childId as string,
      status as string
    );

    return res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error("Error getting agent recommendations:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to get agent recommendations"
    });
  }
};

// Create agent task
export const handleCreateAgentTask: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { childId, task_type, title, description, priority, due_date } = req.body;

    if (!agentId || !childId || !task_type || !title) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Agent ID, child ID, task type, and title are required"
      });
    }

    const task = await agentManager.createAgentTask(agentId, childId, {
      task_type,
      title,
      description,
      priority,
      due_date
    });

    if (!task) {
      return res.status(500).json({
        success: false,
        error: "Creation failed",
        message: "Failed to create agent task"
      });
    }

    return res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error("Error creating agent task:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to create agent task"
    });
  }
};

// Update agent task
export const handleUpdateAgentTask: RequestHandler = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: "Missing task ID",
        message: "Task ID is required"
      });
    }

    const task = await agentManager.updateAgentTask(taskId, updates);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
        message: "Agent task not found or update failed"
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error("Error updating agent task:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to update agent task"
    });
  }
};

// Get agent conversations
export const handleGetAgentConversations: RequestHandler = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { limit } = req.query;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Missing agent ID",
        message: "Agent ID is required"
      });
    }

    const conversations = await agentManager.getAgentConversations(
      agentId,
      limit ? parseInt(limit as string) : 50
    );

    return res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error("Error getting agent conversations:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to get agent conversations"
    });
  }
}; 