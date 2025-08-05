import { RequestHandler } from "express";
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { env, features } from "../config/env";
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Express handler for generating personalized child development roadmaps
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with roadmap data or error
 */
export const handleGenerateDreamPlan: RequestHandler = async (req, res) => {
  try {
    const { childId, years } = req.body;
    
    // Validate required fields
    if (!childId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required field',
        message: 'Child ID is required'
      });
    }
    
    if (!years || ![1, 3, 5, 10].includes(Number(years))) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid time frame',
        message: 'Years must be one of: 1, 3, 5, or 10'
      });
    }

    // Check if required environment variables are set
    if (!supabaseUrl || !supabaseKey || !CLAUDE_API_KEY) {
      console.error('Missing required environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
        message: 'Required environment variables are not configured'
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get child data from Supabase
    const { data: childData, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .single();
      
    if (childError) {
      console.error('Supabase error fetching child:', childError);
      return res.status(404).json({ 
        success: false,
        error: 'Child not found',
        message: 'Could not find a child with the provided ID'
      });
    }
    
    // Check if a plan already exists for this child and timeframe
    const { data: existingPlan, error: planCheckError } = await supabase
      .from('plans')
      .select('*')
      .eq('child_id', childId)
      .eq('years', years)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (!planCheckError && existingPlan && existingPlan.length > 0) {
      // Return the existing plan if it's less than 7 days old
      const planDate = new Date(existingPlan[0].created_at);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 7) {
        return res.status(200).json({
          success: true,
          data: existingPlan[0],
          cached: true
        });
      }
    }
    
    // Format interests for the prompt
    const interests = Array.isArray(childData.interests) 
      ? childData.interests.join(', ') 
      : childData.interests || 'general learning';
    
    // Format strengths for the prompt
    const strengths = Array.isArray(childData.strengths) 
      ? childData.strengths.join(', ') 
      : childData.strengths || 'various areas';
    
    // Generate roadmap using Claude API
    const prompt = `Create a personalized ${years}-year developmental roadmap for a child named ${childData.name} who is ${childData.age} years old, in grade ${childData.grade || 'appropriate grade for their age'}, with interests in ${interests} and strengths in ${strengths}.

The roadmap should be structured as follows:
1. Include key developmental milestones appropriate for their age
2. Recommend age-appropriate activities and resources
3. Suggest educational focus areas organized by year and quarter
4. Include social and emotional learning recommendations
5. Suggest enrichment activities based on their specific interests

Format the response as a JSON object with the following structure:
{
  "summary": "Brief overview of the roadmap",
  "years": [
    {
      "year": 1,
      "title": "Title for year 1",
      "description": "Overview of year 1 focus",
      "quarters": [
        {
          "quarter": 1,
          "focus": "Main focus for this quarter",
          "milestones": ["milestone 1", "milestone 2"],
          "activities": ["activity 1", "activity 2"],
          "enrichment": ["enrichment 1", "enrichment 2"]
        }
      ]
    }
  ]
}

Ensure the JSON is valid and properly formatted.`;

    // Call Claude API
    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4000,
        messages: [
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.7
      })
    });
    
    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.json() as any;
      console.error('Claude API error:', errorData);
      return res.status(500).json({ 
        success: false,
        error: 'AI service error',
        message: `Failed to generate roadmap: ${errorData.error?.message || 'Unknown error'}`
      });
    }
    
    const claudeData = await claudeResponse.json() as any;
    
    // Extract and parse the roadmap from Claude's response
    let roadmap;
    try {
      // Extract JSON from Claude's response
      const content = claudeData.content[0].text;
      // Find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```(?:json)?\s*({[\s\S]*?})\s*```/) || 
                        content.match(/({[\s\S]*})/);
      
      roadmap = jsonMatch 
        ? JSON.parse(jsonMatch[1]) 
        : JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      return res.status(500).json({ 
        success: false,
        error: 'Parse error',
        message: 'Failed to parse the generated roadmap'
      });
    }
    
    // Store the roadmap in Supabase
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .insert([
        { 
          child_id: childId, 
          years: years, 
          roadmap: roadmap
        }
      ])
      .select()
      .single();
      
    if (planError) {
      console.error('Supabase error storing plan:', planError);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: 'Failed to store the generated plan'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: planData,
      cached: false
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: 'Failed to generate the development plan. Please try again.'
    });
  }
};
