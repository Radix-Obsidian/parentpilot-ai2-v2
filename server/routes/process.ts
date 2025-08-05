import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { agentManager } from "../agents/agent-manager";
import { dbService } from "../database/config";
import { getConfig } from "../config/env";

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Claude API configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

interface ProcessingRequest {
  type: "chat" | "agent" | "analysis" | "recommendation" | "task" | "insight" | "auto-route";
  userId?: string;
  childId?: string;
  agentId?: string;
  message?: string;
  data?: any;
  context?: any;
  options?: {
    generateInsights?: boolean;
    generateRecommendations?: boolean;
    createTasks?: boolean;
    autoRoute?: boolean;
    priority?: "low" | "medium" | "high";
    responseFormat?: "text" | "structured" | "both";
  };
}

interface ProcessingResponse {
  success: boolean;
  type: string;
  response: any;
  insights?: any[];
  recommendations?: any[];
  tasks?: any[];
  metadata?: {
    processingTime?: number;
    agentUsed?: string;
    confidence?: number;
    context?: any;
  };
}

/**
 * Main processing endpoint that handles various types of requests
 * and routes them to appropriate handlers based on request type
 */
export const handleProcess: RequestHandler = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const request: ProcessingRequest = req.body;

    // Validate request
    if (!request.type) {
      return res.status(400).json({
        success: false,
        error: "Missing request type",
        message: "Request type is required"
      });
    }

    // Check if required environment variables are set
    if (!CLAUDE_API_KEY) {
      console.error("Missing Claude API key");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
        message: "AI service not configured"
      });
    }

    // Get user and child data if available
    let userData = null;
    let childData = null;

    if (request.userId && supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        if (request.userId) {
          const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("id", request.userId)
            .single();
          userData = user;
        }

        if (request.childId) {
          const { data: child } = await supabase
            .from("children")
            .select("*")
            .eq("id", request.childId)
            .single();
          childData = child;
        }
      } catch (error) {
        console.log("Supabase not available, continuing without user context");
      }
    }

    let response: ProcessingResponse;

    // Route based on request type
    switch (request.type) {
      case "chat":
        response = await handleChatRequest(request, userData, childData);
        break;
      
      case "agent":
        response = await handleAgentRequest(request, userData, childData);
        break;
      
      case "analysis":
        response = await handleAnalysisRequest(request, userData, childData);
        break;
      
      case "recommendation":
        response = await handleRecommendationRequest(request, userData, childData);
        break;
      
      case "task":
        response = await handleTaskRequest(request, userData, childData);
        break;
      
      case "insight":
        response = await handleInsightRequest(request, userData, childData);
        break;
      
      case "auto-route":
        response = await handleAutoRouteRequest(request, userData, childData);
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid request type",
          message: `Unknown request type: ${request.type}`
        });
    }

    // Add processing metadata
    response.metadata = {
      ...response.metadata,
      processingTime: Date.now() - startTime
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error("Error in main processing handler:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to process request. Please try again."
    });
  }
};

/**
 * Handle chat requests with AI assistant
 */
async function handleChatRequest(
  request: ProcessingRequest,
  userData: any,
  childData: any
): Promise<ProcessingResponse> {
  const { message, options = {} } = request;

  if (!message) {
    throw new Error("Message is required for chat requests");
  }

  // Create system message with context
  const systemMessage = `You are the ParentPilot.AI assistant, an AI-powered parenting co-pilot. 
  Your tone is supportive, knowledgeable, and practical.
  
  ${userData ? `The parent you're speaking with is ${userData.name}.` : ""}
  ${childData ? `They have a child: ${childData.name} (${childData.age} years old, interests: ${childData.interests?.join(", ") || "not specified"}).` : ""}
  
  Your goal is to help parents with:
  1. Understanding their child's developmental needs
  2. Providing practical parenting advice tailored to their situation
  3. Suggesting enrichment activities based on their children's interests
  4. Answering questions about the ParentPilot.AI platform and features
  5. Helping with child development roadmaps and progress tracking
  
  Keep responses practical, evidence-based, and actionable. Avoid generic advice.
  Limit responses to 2-3 paragraphs maximum. Be encouraging and supportive.`;

  // Call Claude API
  const claudeResponse = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    }),
  });

  if (!claudeResponse.ok) {
    const errorData = await claudeResponse.json() as any;
    throw new Error(`AI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const claudeData = await claudeResponse.json() as any;
  const assistantResponse = claudeData.content[0].text;

  // Store conversation if user data is available
  if (request.userId && supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("chat_history").upsert(
        {
          user_id: request.userId,
          messages: [
            { role: "user", content: message },
            { role: "assistant", content: assistantResponse },
          ],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    } catch (error) {
      console.log("Could not store chat history:", error);
    }
  }

  return {
    success: true,
    type: "chat",
    response: assistantResponse,
    metadata: {
      confidence: 0.8
    }
  };
}

/**
 * Handle agent-specific requests
 */
async function handleAgentRequest(
  request: ProcessingRequest,
  userData: any,
  childData: any
): Promise<ProcessingResponse> {
  const { agentId, message, childId, options = {} } = request;

  if (!agentId || !message) {
    throw new Error("Agent ID and message are required for agent requests");
  }

  if (!childId) {
    throw new Error("Child ID is required for agent requests");
  }

  // Process message with specific agent
  const agentResponse = await agentManager.processMessageWithAgent(
    agentId,
    request.userId!,
    childId,
    message
  );

  if (!agentResponse.success) {
    throw new Error(agentResponse.message);
  }

  const response: ProcessingResponse = {
    success: true,
    type: "agent",
    response: agentResponse.message,
    metadata: {
      agentUsed: agentId,
      confidence: 0.85
    }
  };

  // Generate additional outputs if requested
  if (options.generateInsights) {
    const insights = await agentManager.generateAgentInsights(agentId, request.userId!, childId);
    response.insights = insights;
  }

  if (options.generateRecommendations) {
    const recommendations = await agentManager.generateAgentRecommendations(agentId, request.userId!, childId);
    response.recommendations = recommendations;
  }

  return response;
}

/**
 * Handle analysis requests
 */
async function handleAnalysisRequest(
  request: ProcessingRequest,
  userData: any,
  childData: any
): Promise<ProcessingResponse> {
  const { data, options = {} } = request;

  if (!data) {
    throw new Error("Data is required for analysis requests");
  }

  // Create analysis prompt
  const analysisPrompt = `Analyze the following data and provide insights:
  
  Data: ${JSON.stringify(data)}
  
  ${childData ? `Child Context: ${childData.name} (${childData.age} years old)` : ""}
  
  Please provide:
  1. Key observations
  2. Developmental insights
  3. Areas of strength
  4. Potential areas for growth
  5. Recommendations for next steps
  
  Format your response in a clear, structured manner.`;

  const analysisResponse = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 800,
      messages: [
        { role: "user", content: analysisPrompt }
      ],
      temperature: 0.3,
    }),
  });

  if (!analysisResponse.ok) {
    const errorData = await analysisResponse.json() as any;
    throw new Error(`AI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const analysisData = await analysisResponse.json() as any;
  const analysisResult = analysisData.content[0].text;

  return {
    success: true,
    type: "analysis",
    response: analysisResult,
    metadata: {
      confidence: 0.75
    }
  };
}

/**
 * Handle recommendation requests
 */
async function handleRecommendationRequest(
  request: ProcessingRequest,
  userData: any,
  childData: any
): Promise<ProcessingResponse> {
  const { data, options = {} } = request;

  if (!data) {
    throw new Error("Data is required for recommendation requests");
  }

  // Create recommendation prompt
  const recommendationPrompt = `Based on the following information, provide personalized recommendations:
  
  Data: ${JSON.stringify(data)}
  
  ${childData ? `Child: ${childData.name} (${childData.age} years old, interests: ${childData.interests?.join(", ") || "not specified"})` : ""}
  
  Please provide:
  1. Activity recommendations
  2. Learning opportunities
  3. Developmental milestones to focus on
  4. Resources or tools that might be helpful
  5. Timeline suggestions
  
  Make recommendations specific, actionable, and age-appropriate.`;

  const recommendationResponse = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 600,
      messages: [
        { role: "user", content: recommendationPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!recommendationResponse.ok) {
    const errorData = await recommendationResponse.json() as any;
    throw new Error(`AI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const recommendationData = await recommendationResponse.json() as any;
  const recommendationResult = recommendationData.content[0].text;

  return {
    success: true,
    type: "recommendation",
    response: recommendationResult,
    metadata: {
      confidence: 0.8
    }
  };
}

/**
 * Handle task requests
 */
async function handleTaskRequest(
  request: ProcessingRequest,
  userData: any,
  childData: any
): Promise<ProcessingResponse> {
  const { data, options = {} } = request;

  if (!data || !request.agentId || !request.childId) {
    throw new Error("Data, agent ID, and child ID are required for task requests");
  }

  // Create task using agent manager
  const task = await agentManager.createAgentTask(
    request.agentId,
    request.childId,
    {
      task_type: data.taskType || "general",
      title: data.title,
      description: data.description,
      priority: data.priority || "medium",
      due_date: data.dueDate
    }
  );

  if (!task) {
    throw new Error("Failed to create task");
  }

  return {
    success: true,
    type: "task",
    response: task,
    metadata: {
      agentUsed: request.agentId,
      confidence: 0.9
    }
  };
}

/**
 * Handle insight requests
 */
async function handleInsightRequest(
  request: ProcessingRequest,
  userData: any,
  childData: any
): Promise<ProcessingResponse> {
  const { data, options = {} } = request;

  if (!data || !request.agentId || !request.childId) {
    throw new Error("Data, agent ID, and child ID are required for insight requests");
  }

  // Generate insights using agent manager
  const insights = await agentManager.generateAgentInsights(
    request.agentId,
    request.userId!,
    request.childId
  );

  return {
    success: true,
    type: "insight",
    response: insights,
    insights: insights,
    metadata: {
      agentUsed: request.agentId,
      confidence: 0.8
    }
  };
}

/**
 * Handle auto-route requests - automatically determine the best agent for a message
 */
async function handleAutoRouteRequest(
  request: ProcessingRequest,
  userData: any,
  childData: any
): Promise<ProcessingResponse> {
  const { message, childId, options = {} } = request;

  if (!message || !childId) {
    throw new Error("Message and child ID are required for auto-route requests");
  }

  // Route message to best agent
  const routeResult = await agentManager.routeMessageToBestAgent(
    request.userId!,
    childId,
    message
  );

  if (!routeResult) {
    throw new Error("No suitable agent found for this message");
  }

  const response: ProcessingResponse = {
    success: true,
    type: "auto-route",
    response: routeResult.response.message,
    metadata: {
      agentUsed: routeResult.agentId,
      confidence: 0.85
    }
  };

  // Generate additional outputs if requested
  if (options.generateInsights) {
    const insights = await agentManager.generateAgentInsights(routeResult.agentId, request.userId!, childId);
    response.insights = insights;
  }

  if (options.generateRecommendations) {
    const recommendations = await agentManager.generateAgentRecommendations(routeResult.agentId, request.userId!, childId);
    response.recommendations = recommendations;
  }

  return response;
} 