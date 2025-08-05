import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { env, features } from "../config/env";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Express handler for AI chat functionality
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with AI chat response
 */
export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { messages, userId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: "Invalid messages format",
        message: "Messages must be an array",
      });
    }

    // Check if required environment variables are set
    if (!features.claude) {
      console.error("Missing Claude API key");
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
        message: "AI service not configured",
      });
    }

    // Get user data if available and Supabase is configured
    let userData = null;
    let childrenData = null;

    if (userId && features.supabase) {
      try {
        const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        const { data: children } = await supabase
          .from("children")
          .select("*")
          .eq("user_id", userId);

        userData = user;
        childrenData = children;
      } catch (error) {
        console.log("Supabase not available, continuing without user context");
      }
    }

    // Format messages for Claude API
    const formattedMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Create system message with context
    const systemMessage = {
      role: "system" as const,
      content: `You are the ParentPilot.AI assistant, an AI-powered parenting co-pilot. 
      Your tone is supportive, knowledgeable, and practical.
      
      ${userData ? `The parent you're speaking with is ${userData.name}.` : ""}
      ${childrenData && childrenData.length > 0 ? `They have ${childrenData.length} children in the system: ${childrenData.map((child: any) => `${child.name} (${child.age} years old, interests: ${child.interests?.join(", ") || "not specified"})`).join(", ")}.` : ""}
      
      Your goal is to help parents with:
      1. Understanding their child's developmental needs
      2. Providing practical parenting advice tailored to their situation
      3. Suggesting enrichment activities based on their children's interests
      4. Answering questions about the ParentPilot.AI platform and features
      5. Helping with child development roadmaps and progress tracking
      
      Key ParentPilot.AI features you can discuss:
      - AI-generated personalized development roadmaps (1, 3, 5, or 10 year plans)
      - Weekly progress digests with insights
      - Enrichment activity recommendations
      - Child profile management with interests and strengths tracking
      - Milestone and activity logging
      - Two subscription plans: Starter ($19/month, 2 children) and Pro ($49/month, unlimited children)
      
      Keep responses practical, evidence-based, and actionable. Avoid generic advice.
      Limit responses to 2-3 paragraphs maximum. Be encouraging and supportive.`,
    };

    // Call Claude API
    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.CLAUDE_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        messages: [systemMessage, ...formattedMessages],
        temperature: 0.7,
      }),
    });

    if (!claudeResponse.ok) {
      const errorData = (await claudeResponse.json()) as any;
      console.error("Claude API error:", errorData);
      return res.status(500).json({
        success: false,
        error: "AI service error",
        message: "Failed to get response from AI assistant",
      });
    }

    const claudeData = (await claudeResponse.json()) as any;
    const assistantResponse = claudeData.content[0].text;

    // Store conversation in chat_history table if Supabase is available
    if (userId && supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from("chat_history").upsert(
          {
            user_id: userId,
            messages: [
              ...messages,
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

    return res.status(200).json({
      success: true,
      response: assistantResponse,
    });
  } catch (error) {
    console.error("Error in chat handler:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      message: "Failed to process chat request. Please try again.",
    });
  }
};
