import { RequestHandler } from "express";
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { env, features } from "../config/env";
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Express handler for generating personalized enrichment recommendations
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with enrichment recommendations or error
 */
export const handleRecommendEnrichment: RequestHandler = async (req, res) => {
  try {
    const { childId, category, location } = req.body;
    
    // Validate required fields
    if (!childId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required field',
        message: 'Child ID is required'
      });
    }

        // Check if required environment variables are set
    if (!features.supabase || !features.claude) {
      console.error('Missing required environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
        message: 'Required environment variables are not configured'
      });
    }

    // Initialize Supabase client
    const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);
    
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
    
    // Check for existing recommendations less than 14 days old
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const { data: existingRecommendations, error: recCheckError } = await supabase
      .from('enrichment')
      .select('*')
      .eq('child_id', childId)
      .eq('category', category || 'all')
      .gte('created_at', twoWeeksAgo.toISOString())
      .order('created_at', { ascending: false });
      
    if (!recCheckError && existingRecommendations && existingRecommendations.length > 0) {
      return res.status(200).json({
        success: true,
        data: existingRecommendations,
        cached: true
      });
    }
    
    // Format interests for the prompt
    const interests = Array.isArray(childData.interests) 
      ? childData.interests.join(', ') 
      : childData.interests || 'general learning';
      
    // Format strengths for the prompt
    const strengths = Array.isArray(childData.strengths) 
      ? childData.strengths.join(', ') 
      : childData.strengths || 'various areas';
    
    // Set the location (default to Atlanta if not specified)
    const userLocation = location || 'Atlanta, Georgia';
    
    // Generate recommendations using Claude API
    const categoryFilter = category ? `Limit your recommendations to activities in the "${category}" category.` : 'Include a mix of academic, creative, physical, and social-emotional learning activities.';
    
    const prompt = `Generate 5 personalized enrichment recommendations for a child named ${childData.name} who is ${childData.age} years old, in grade ${childData.grade || 'appropriate grade for their age'}, with interests in ${interests} and strengths in ${strengths}.

The recommendations should be a mix of:
1. Local in-person activities in ${userLocation}
2. Online programs or resources
3. Books, games, or materials

${categoryFilter}

Each recommendation should include:
- Title of the activity or resource
- Brief description (2-3 sentences)
- Category (academic, creative, physical, social-emotional)
- URL or location information
- Why it's appropriate for this child's age and interests

Format each recommendation as a JSON object in an array with the following structure:
[
  {
    "title": "Recommendation title",
    "description": "Brief description of the recommendation",
    "category": "academic|creative|physical|social-emotional",
    "type": "local|online|resource",
    "url": "Website URL or null if not applicable",
    "location": "Physical location or null if online",
    "ageAppropriate": true,
    "reasonForRecommendation": "Brief explanation of why this is recommended"
  }
]

Ensure the JSON array is valid and properly formatted.`;

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
        max_tokens: 2500,
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
        message: `Failed to generate recommendations: ${errorData.error?.message || 'Unknown error'}`
      });
    }
    
    const claudeData = await claudeResponse.json() as any;
    
    // Extract and parse the recommendations from Claude's response
    let recommendations;
    try {
      // Extract JSON from Claude's response
      const content = claudeData.content[0].text;
      // Find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/) || 
                        content.match(/(\[[\s\S]*?\])/);
      
      recommendations = jsonMatch 
        ? JSON.parse(jsonMatch[1]) 
        : JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      return res.status(500).json({ 
        success: false,
        error: 'Parse error',
        message: 'Failed to parse the generated recommendations'
      });
    }
    
    // Store each recommendation in Supabase
    const dbInserts = recommendations.map((rec: any) => ({
      child_id: childId,
      category: category || rec.category || 'all',
      title: rec.title,
      description: rec.description,
      url: rec.url || null,
      location: rec.location || null,
      type: rec.type || 'online',
      is_saved: false,
      metadata: {
        ageAppropriate: rec.ageAppropriate || true,
        reasonForRecommendation: rec.reasonForRecommendation || ''
      }
    }));
    
    const { data: insertedRecs, error: insertError } = await supabase
      .from('enrichment')
      .insert(dbInserts)
      .select();
      
    if (insertError) {
      console.error('Supabase error storing recommendations:', insertError);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: 'Failed to store the generated recommendations'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: insertedRecs,
      cached: false
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: 'Failed to generate enrichment recommendations. Please try again.'
    });
  }
};
