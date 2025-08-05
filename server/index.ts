import "dotenv/config";
import express from "express";
import cors from "cors";
import { env, validateConfig, getConfig } from "./config/env";
import { handleDemo } from "./routes/demo";
import { handleGenerateDreamPlan } from "./routes/generate-dream-plan";
import { handleGenerateWeeklyDigest } from "./routes/generate-weekly-digest";
import { handleRecommendEnrichment } from "./routes/recommend-enrichment";
import { handleChat } from "./routes/chat";
import { multiAgentRouter } from "./routes/multi-agent";
import { paymentsRouter } from "./routes/payments";
import { handleProcess } from "./routes/process";

// Agent routes
import {
  handleGetUserAgents,
  handleGetAgentTypes,
  handleCreateSubAgent,
  handleUpdateSubAgent,
  handleProcessMessageWithAgent,
  handleRouteMessageToBestAgent,
  handleGenerateAgentInsights,
  handleGenerateAgentRecommendations,
  handleExecuteAgentTask,
  handleGetAgentTasks,
  handleGetAgentInsights,
  handleGetAgentRecommendations,
  handleCreateAgentTask,
  handleUpdateAgentTask,
  handleGetAgentConversations
} from "./routes/agents";

// SubAgent Orchestrator routes
import {
  handleProcessTask,
  handleExecuteDispatcher,
  handleExecuteAnalyst,
  handleExecuteScheduler
} from "./routes/subagent-orchestrator";

export function createServer() {
  // Validate environment configuration
  validateConfig();
  
  const config = getConfig();
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/api/ping", (_req, res) => {
    res.json({ 
      message: config.server.pingMessage,
      environment: config.server.nodeEnv,
      features: config.features
    });
  });

  app.get("/api/demo", handleDemo);

  // AI-powered roadmap generation
  app.post("/api/generate-dream-plan", handleGenerateDreamPlan);

  // AI-powered weekly digest generation
  app.post("/api/generate-weekly-digest", handleGenerateWeeklyDigest);

  // AI-powered enrichment recommendations
  app.post("/api/recommend-enrichment", handleRecommendEnrichment);

  // AI chat assistant
  app.post("/api/chat", handleChat);

  // Main processing endpoint
  app.post("/api/process", handleProcess);

  // Sub-Agent System Routes
  // Agent management
  app.get("/api/agents/types", handleGetAgentTypes);
  app.get("/api/users/:userId/agents", handleGetUserAgents);
  app.post("/api/agents", handleCreateSubAgent);
  app.put("/api/agents/:agentId", handleUpdateSubAgent);

  // Agent messaging
  app.post("/api/agents/:agentId/message", handleProcessMessageWithAgent);
  app.post("/api/agents/route-message", handleRouteMessageToBestAgent);

  // Agent insights and recommendations
  app.post("/api/agents/:agentId/insights", handleGenerateAgentInsights);
  app.post("/api/agents/:agentId/recommendations", handleGenerateAgentRecommendations);
  app.get("/api/agents/:agentId/insights", handleGetAgentInsights);
  app.get("/api/agents/:agentId/recommendations", handleGetAgentRecommendations);

  // Agent tasks
  app.get("/api/agents/:agentId/tasks", handleGetAgentTasks);
  app.post("/api/agents/:agentId/tasks", handleCreateAgentTask);
  app.put("/api/agents/:agentId/tasks/:taskId", handleUpdateAgentTask);
  app.post("/api/agents/:agentId/tasks/:taskId/execute", handleExecuteAgentTask);

  // Agent conversations
  app.get("/api/agents/:agentId/conversations", handleGetAgentConversations);

  // SubAgent Orchestrator Routes
  app.post("/api/subagent-orchestrator/process-task", handleProcessTask);
  app.post("/api/subagent-orchestrator/dispatcher", handleExecuteDispatcher);
  app.post("/api/subagent-orchestrator/analyst", handleExecuteAnalyst);
  app.post("/api/subagent-orchestrator/scheduler", handleExecuteScheduler);

  // Multi-Agent System Routes
  app.use("/api/multi-agent", multiAgentRouter);

  // Payment Routes
  app.use("/api/payments", paymentsRouter);

  return app;
}
