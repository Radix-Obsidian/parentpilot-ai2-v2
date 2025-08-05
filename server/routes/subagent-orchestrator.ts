import { RequestHandler } from "express";
import { SubAgentOrchestrator } from "../agents/subagent-orchestrator";

const orchestrator = new SubAgentOrchestrator();

// Process a parenting task through the subagent orchestrator
export const handleProcessTask: RequestHandler = async (req, res) => {
  try {
    const { userId, rawInput, childId } = req.body;

    if (!userId || !rawInput) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "User ID and raw input are required"
      });
    }

    const result = await orchestrator.processTask(userId, rawInput, childId);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error processing task:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to process task"
    });
  }
};

// Execute dispatcher agent only
export const handleExecuteDispatcher: RequestHandler = async (req, res) => {
  try {
    const { rawInput } = req.body;

    if (!rawInput) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Raw input is required"
      });
    }

    const result = await orchestrator.executeDispatcher(rawInput);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error executing dispatcher:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to execute dispatcher"
    });
  }
};

// Execute analyst agent only
export const handleExecuteAnalyst: RequestHandler = async (req, res) => {
  try {
    const { rawInput, category } = req.body;

    if (!rawInput || !category) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Raw input and category are required"
      });
    }

    const result = await orchestrator.executeAnalyst(rawInput, category);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error executing analyst:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to execute analyst"
    });
  }
};

// Execute scheduler agent only
export const handleExecuteScheduler: RequestHandler = async (req, res) => {
  try {
    const { extractedData, childName } = req.body;

    if (!extractedData) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Extracted data is required"
      });
    }

    const result = await orchestrator.executeScheduler(extractedData, childName);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error executing scheduler:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to execute scheduler"
    });
  }
}; 