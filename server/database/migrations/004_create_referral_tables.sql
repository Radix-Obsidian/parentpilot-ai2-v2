-- Migration: Create Referral System Tables
-- Description: Sets up the complete referral system with tiered rewards

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create referral_programs table
CREATE TABLE IF NOT EXISTS referral_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referral_code VARCHAR(10) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referral_rewards table
CREATE TABLE IF NOT EXISTS referral_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_program_id UUID NOT NULL REFERENCES referral_programs(id) ON DELETE CASCADE,
    tier_id VARCHAR(50) NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    reward_type VARCHAR(50) NOT NULL CHECK (reward_type IN ('free_days', 'plan_upgrade', 'feature_access')),
    reward_value INTEGER NOT NULL,
    description TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    claimed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referral_invitations table
CREATE TABLE IF NOT EXISTS referral_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'opened', 'clicked', 'signed_up', 'expired')),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    signed_up_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referral_analytics table for tracking
CREATE TABLE IF NOT EXISTS referral_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_invites INTEGER DEFAULT 0,
    total_signups INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_time_to_signup INTEGER DEFAULT 0,
    top_referring_channels TEXT[],
    rewards_earned INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referral_programs_user_id ON referral_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_programs_referral_code ON referral_programs(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_programs_status ON referral_programs(status);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_program_id ON referral_rewards(referral_program_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_status ON referral_rewards(status);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_earned_at ON referral_rewards(earned_at);

CREATE INDEX IF NOT EXISTS idx_referral_invitations_referrer_id ON referral_invitations(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_invitations_email ON referral_invitations(email);
CREATE INDEX IF NOT EXISTS idx_referral_invitations_status ON referral_invitations(status);
CREATE INDEX IF NOT EXISTS idx_referral_invitations_expires_at ON referral_invitations(expires_at);

CREATE INDEX IF NOT EXISTS idx_referral_analytics_user_id ON referral_analytics(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own referral programs" ON referral_programs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own referral programs" ON referral_programs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral programs" ON referral_programs
    FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON referral_programs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON referral_rewards TO authenticated;
GRANT SELECT, INSERT, UPDATE ON referral_invitations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON referral_analytics TO authenticated;
