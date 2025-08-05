import { RequestHandler } from "express";
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { format, subDays } from 'date-fns';
import { env, features } from "../config/env";
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Express handler for generating weekly digests for a parent's children
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns JSON response with digest data or error
 */
export const handleGenerateWeeklyDigest: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required field',
        message: 'User ID is required'
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
    
    // Check if there's a recent digest (< 6 days old)
    const { data: recentDigest, error: digestError } = await supabase
      .from('digests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (!digestError && recentDigest && recentDigest.length > 0) {
      const digestDate = new Date(recentDigest[0].created_at);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - digestDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 6) {
        return res.status(200).json({
          success: true,
          data: recentDigest[0],
          cached: true
        });
      }
    }
    
    // Get all children for the user
    const { data: children, error: childrenError } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', userId);
      
    if (childrenError) {
      console.error('Supabase error fetching children:', childrenError);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: 'Failed to retrieve children data'
      });
    }
    
    if (!children || children.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'No children found',
        message: 'No children profiles found for this user'
      });
    }
    
    // Get all recent events (last 7 days)
    const oneWeekAgo = subDays(new Date(), 7);
    const formattedDate = format(oneWeekAgo, 'yyyy-MM-dd');
    
    const childIds = children.map(child => child.id);
    
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .in('child_id', childIds)
      .gte('date', formattedDate);
      
    if (eventsError) {
      console.error('Supabase error fetching events:', eventsError);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: 'Failed to retrieve events data'
      });
    }
    
    // Get the most recent plans for each child
    const childPlans = [];
    for (const child of children) {
      const { data: plans, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .eq('child_id', child.id)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (!plansError && plans && plans.length > 0) {
        childPlans.push({
          childId: child.id,
          childName: child.name,
          plan: plans[0]
        });
      }
    }
    
    // Generate digest using Claude API
    let digestPrompt = `Generate a weekly parenting digest for a parent with ${children.length} ${children.length === 1 ? 'child' : 'children'}:\n\n`;
    
    // Add children information
    children.forEach(child => {
      digestPrompt += `Child: ${child.name}, Age: ${child.age}, Grade: ${child.grade || 'N/A'}\n`;
      digestPrompt += `Interests: ${Array.isArray(child.interests) ? child.interests.join(', ') : child.interests || 'None specified'}\n`;
      digestPrompt += `Strengths: ${Array.isArray(child.strengths) ? child.strengths.join(', ') : child.strengths || 'None specified'}\n\n`;
    });
    
    // Add recent events
    digestPrompt += `Recent events (last 7 days):\n`;
    if (events && events.length > 0) {
      events.forEach(event => {
        const childName = children.find(c => c.id === event.child_id)?.name || 'Unknown';
        digestPrompt += `- ${format(new Date(event.date), 'MMM d')}: ${childName} - ${event.title} (${event.category || 'general'})\n`;
        if (event.notes) digestPrompt += `  Notes: ${event.notes}\n`;
      });
    } else {
      digestPrompt += `No events recorded in the past week.\n`;
    }
    
    // Add plan information if available
    digestPrompt += `\nCurrent development plans:\n`;
    if (childPlans.length > 0) {
      childPlans.forEach(({ childName, plan }) => {
        digestPrompt += `- ${childName}: ${plan.years}-year plan created on ${format(new Date(plan.created_at), 'MMM d, yyyy')}\n`;
      });
    } else {
      digestPrompt += `No active development plans found.\n`;
    }
    
    digestPrompt += `\nPlease create a comprehensive weekly digest with the following sections:
1. Weekly Summary - Overall progress and highlights
2. Child-Specific Updates - Personalized insights for each child
3. Upcoming Focus Areas - Based on their development plans
4. Recommendations - Suggested activities or resources for the coming week
5. Parenting Tip of the Week - One actionable, evidence-based parenting tip

Format the digest in Markdown with appropriate headers, bullet points, and emphasis.
If there's limited event data, extrapolate reasonable activities and progress based on the children's ages, interests, and development plans.`;

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
            content: digestPrompt 
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
        message: `Failed to generate digest: ${errorData.error?.message || 'Unknown error'}`
      });
    }
    
    const claudeData = await claudeResponse.json() as any;
    const digestContent = claudeData.content[0].text;
    
    // Calculate week start and end dates for the digest
    const now = new Date();
    const weekStart = subDays(now, 7);
    const weekEnd = now;
    
    // Store the digest in Supabase
    const { data: digestData, error: digestInsertError } = await supabase
      .from('digests')
      .insert([
        { 
          user_id: userId, 
          week_start: format(weekStart, 'yyyy-MM-dd'),
          week_end: format(weekEnd, 'yyyy-MM-dd'),
          content: digestContent,
          read_status: false
        }
      ])
      .select()
      .single();
      
    if (digestInsertError) {
      console.error('Supabase error storing digest:', digestInsertError);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: 'Failed to store the generated digest'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: digestData,
      cached: false
    });
  } catch (error) {
    console.error('Error generating digest:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: 'Failed to generate the weekly digest. Please try again.'
    });
  }
};
