-- ParentPilot.AI Database Schema
-- This schema supports the main application and sub-agent functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    subscription_plan VARCHAR(50) DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'pro')),
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Children table
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    grade VARCHAR(50),
    interests TEXT[],
    strengths TEXT[],
    challenges TEXT[],
    learning_style VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table (for development roadmaps)
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    years INTEGER NOT NULL CHECK (years IN (1, 3, 5, 10)),
    roadmap JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat history table
CREATE TABLE chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    messages JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly digests table
CREATE TABLE weekly_digests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    week_start_date DATE NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrichment activities table
CREATE TABLE enrichment_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty_level VARCHAR(50),
    estimated_duration INTEGER, -- in minutes
    materials_needed TEXT[],
    instructions TEXT,
    learning_objectives TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones table
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    target_date DATE,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities log table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    activity_type VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER, -- in minutes
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-Agents Schema
-- Agent types table
CREATE TABLE agent_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    capabilities TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-agents table
CREATE TABLE sub_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_type_id UUID REFERENCES agent_types(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    configuration JSONB,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'training')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent conversations table
CREATE TABLE agent_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_agent_id UUID REFERENCES sub_agents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    messages JSONB NOT NULL,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent tasks table
CREATE TABLE agent_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_agent_id UUID REFERENCES sub_agents(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    task_type VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    result_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent insights table
CREATE TABLE agent_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_agent_id UUID REFERENCES sub_agents(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    insight_type VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    data_sources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent recommendations table
CREATE TABLE agent_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_agent_id UUID REFERENCES sub_agents(id) ON DELETE CASCADE,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    action_items JSONB,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'implemented')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent learning data table
CREATE TABLE agent_learning_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_agent_id UUID REFERENCES sub_agents(id) ON DELETE CASCADE,
    data_type VARCHAR(100),
    data_content JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_children_user_id ON children(user_id);
CREATE INDEX idx_plans_child_id ON plans(child_id);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_weekly_digests_child_id ON weekly_digests(child_id);
CREATE INDEX idx_enrichment_activities_child_id ON enrichment_activities(child_id);
CREATE INDEX idx_milestones_child_id ON milestones(child_id);
CREATE INDEX idx_activity_logs_child_id ON activity_logs(child_id);
CREATE INDEX idx_sub_agents_user_id ON sub_agents(user_id);
CREATE INDEX idx_agent_conversations_sub_agent_id ON agent_conversations(sub_agent_id);
CREATE INDEX idx_agent_tasks_sub_agent_id ON agent_tasks(sub_agent_id);
CREATE INDEX idx_agent_insights_sub_agent_id ON agent_insights(sub_agent_id);
CREATE INDEX idx_agent_recommendations_sub_agent_id ON agent_recommendations(sub_agent_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_history_updated_at BEFORE UPDATE ON chat_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrichment_activities_updated_at BEFORE UPDATE ON enrichment_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sub_agents_updated_at BEFORE UPDATE ON sub_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_conversations_updated_at BEFORE UPDATE ON agent_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_tasks_updated_at BEFORE UPDATE ON agent_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_recommendations_updated_at BEFORE UPDATE ON agent_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default agent types
INSERT INTO agent_types (name, description, capabilities) VALUES
('Development Tracker', 'Tracks child development milestones and progress', ARRAY['milestone_tracking', 'progress_analysis', 'development_alerts']),
('Learning Coach', 'Provides personalized learning recommendations and activities', ARRAY['activity_recommendations', 'learning_optimization', 'skill_assessment']),
('Behavior Analyst', 'Analyzes behavior patterns and provides insights', ARRAY['behavior_tracking', 'pattern_analysis', 'intervention_suggestions']),
('Social Skills Mentor', 'Focuses on social and emotional development', ARRAY['social_skills_training', 'emotional_intelligence', 'peer_interaction']),
('Academic Advisor', 'Provides academic guidance and educational planning', ARRAY['academic_planning', 'curriculum_guidance', 'performance_tracking']),
('Health Monitor', 'Tracks health-related milestones and provides wellness insights', ARRAY['health_tracking', 'nutrition_guidance', 'wellness_recommendations']),
('Creative Catalyst', 'Encourages creativity and artistic development', ARRAY['creative_activities', 'artistic_development', 'imagination_stimulation']),
('Technology Guide', 'Manages screen time and digital learning', ARRAY['screen_time_management', 'digital_learning', 'tech_balance']);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichment_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_learning_data ENABLE ROW LEVEL SECURITY;

-- Sub-agent tasks
CREATE TABLE IF NOT EXISTS subagent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  
  raw_input TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
  
  dispatcher_result JSONB,
  analyst_result JSONB,
  scheduler_result JSONB,
  
  processing_time_ms INTEGER,
  total_cost_cents INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-agent execution logs
CREATE TABLE IF NOT EXISTS subagent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES subagent_tasks(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL,
  
  input_data JSONB,
  output_data JSONB,
  execution_time_ms INTEGER,
  tokens_used INTEGER DEFAULT 0,
  cost_cents INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'failed')),
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for new tables
ALTER TABLE subagent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subagent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY subagent_tasks_policy ON subagent_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY subagent_logs_policy ON subagent_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM subagent_tasks WHERE subagent_tasks.id = subagent_logs.task_id AND subagent_tasks.user_id = auth.uid())
);

-- Indexes for new tables
CREATE INDEX idx_subagent_tasks_user ON subagent_tasks(user_id, created_at DESC);
CREATE INDEX idx_subagent_logs_task ON subagent_logs(task_id);

-- Updated trigger for subagent_tasks
CREATE TRIGGER update_subagent_tasks_updated_at BEFORE UPDATE ON subagent_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (these will be applied based on auth.uid())
-- Note: In a real implementation, you would create specific policies for each table
-- based on your authentication system (Supabase Auth, etc.) 