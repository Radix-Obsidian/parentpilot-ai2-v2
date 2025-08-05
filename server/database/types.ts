export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          subscription_plan: 'starter' | 'pro'
          subscription_status: 'active' | 'cancelled' | 'past_due'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          subscription_plan?: 'starter' | 'pro'
          subscription_status?: 'active' | 'cancelled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          subscription_plan?: 'starter' | 'pro'
          subscription_status?: 'active' | 'cancelled' | 'past_due'
          created_at?: string
          updated_at?: string
        }
      }
      children: {
        Row: {
          id: string
          user_id: string
          name: string
          age: number
          grade: string | null
          interests: string[] | null
          strengths: string[] | null
          challenges: string[] | null
          learning_style: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          age: number
          grade?: string | null
          interests?: string[] | null
          strengths?: string[] | null
          challenges?: string[] | null
          learning_style?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          age?: number
          grade?: string | null
          interests?: string[] | null
          strengths?: string[] | null
          challenges?: string[] | null
          learning_style?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          child_id: string
          years: number
          roadmap: Json
          status: 'active' | 'archived' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          years: number
          roadmap: Json
          status?: 'active' | 'archived' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          years?: number
          roadmap?: Json
          status?: 'active' | 'archived' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          messages: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: Json
          created_at?: string
          updated_at?: string
        }
      }
      weekly_digests: {
        Row: {
          id: string
          child_id: string
          week_start_date: string
          content: Json
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          week_start_date: string
          content: Json
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          week_start_date?: string
          content?: Json
          created_at?: string
        }
      }
      enrichment_activities: {
        Row: {
          id: string
          child_id: string
          title: string
          description: string | null
          category: string | null
          difficulty_level: string | null
          estimated_duration: number | null
          materials_needed: string[] | null
          instructions: string | null
          learning_objectives: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          title: string
          description?: string | null
          category?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          materials_needed?: string[] | null
          instructions?: string | null
          learning_objectives?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          title?: string
          description?: string | null
          category?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          materials_needed?: string[] | null
          instructions?: string | null
          learning_objectives?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          child_id: string
          title: string
          description: string | null
          category: string | null
          target_date: string | null
          completed_date: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'overdue'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          title: string
          description?: string | null
          category?: string | null
          target_date?: string | null
          completed_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          title?: string
          description?: string | null
          category?: string | null
          target_date?: string | null
          completed_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          child_id: string
          activity_type: string | null
          title: string
          description: string | null
          duration: number | null
          date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          activity_type?: string | null
          title: string
          description?: string | null
          duration?: number | null
          date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          activity_type?: string | null
          title?: string
          description?: string | null
          duration?: number | null
          date?: string
          notes?: string | null
          created_at?: string
        }
      }
      agent_types: {
        Row: {
          id: string
          name: string
          description: string | null
          capabilities: string[] | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          capabilities?: string[] | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          capabilities?: string[] | null
          is_active?: boolean
          created_at?: string
        }
      }
      sub_agents: {
        Row: {
          id: string
          user_id: string
          agent_type_id: string
          name: string
          description: string | null
          configuration: Json | null
          status: 'active' | 'inactive' | 'training'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_type_id: string
          name: string
          description?: string | null
          configuration?: Json | null
          status?: 'active' | 'inactive' | 'training'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_type_id?: string
          name?: string
          description?: string | null
          configuration?: Json | null
          status?: 'active' | 'inactive' | 'training'
          created_at?: string
          updated_at?: string
        }
      }
      agent_conversations: {
        Row: {
          id: string
          sub_agent_id: string
          user_id: string
          messages: Json
          context: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sub_agent_id: string
          user_id: string
          messages: Json
          context?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sub_agent_id?: string
          user_id?: string
          messages?: Json
          context?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_tasks: {
        Row: {
          id: string
          sub_agent_id: string
          child_id: string
          task_type: string | null
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'failed'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          completed_at: string | null
          result_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sub_agent_id: string
          child_id: string
          task_type?: string | null
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'failed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          completed_at?: string | null
          result_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sub_agent_id?: string
          child_id?: string
          task_type?: string | null
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'failed'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          completed_at?: string | null
          result_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_insights: {
        Row: {
          id: string
          sub_agent_id: string
          child_id: string
          insight_type: string | null
          title: string
          content: string | null
          confidence_score: number | null
          data_sources: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          sub_agent_id: string
          child_id: string
          insight_type?: string | null
          title: string
          content?: string | null
          confidence_score?: number | null
          data_sources?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          sub_agent_id?: string
          child_id?: string
          insight_type?: string | null
          title?: string
          content?: string | null
          confidence_score?: number | null
          data_sources?: Json | null
          created_at?: string
        }
      }
      agent_recommendations: {
        Row: {
          id: string
          sub_agent_id: string
          child_id: string
          recommendation_type: string | null
          title: string
          description: string | null
          action_items: Json | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'pending' | 'accepted' | 'rejected' | 'implemented'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sub_agent_id: string
          child_id: string
          recommendation_type?: string | null
          title: string
          description?: string | null
          action_items?: Json | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'accepted' | 'rejected' | 'implemented'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sub_agent_id?: string
          child_id?: string
          recommendation_type?: string | null
          title?: string
          description?: string | null
          action_items?: Json | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'pending' | 'accepted' | 'rejected' | 'implemented'
          created_at?: string
          updated_at?: string
        }
      }
      agent_learning_data: {
        Row: {
          id: string
          sub_agent_id: string
          data_type: string | null
          data_content: Json | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          sub_agent_id: string
          data_type?: string | null
          data_content?: Json | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          sub_agent_id?: string
          data_type?: string | null
          data_content?: Json | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type aliases for common patterns
export type User = Database['public']['Tables']['users']['Row']
export type Child = Database['public']['Tables']['children']['Row']
export type Plan = Database['public']['Tables']['plans']['Row']
export type SubAgent = Database['public']['Tables']['sub_agents']['Row']
export type AgentType = Database['public']['Tables']['agent_types']['Row']
export type AgentTask = Database['public']['Tables']['agent_tasks']['Row']
export type AgentInsight = Database['public']['Tables']['agent_insights']['Row']
export type AgentRecommendation = Database['public']['Tables']['agent_recommendations']['Row']
export type AgentConversation = Database['public']['Tables']['agent_conversations']['Row']
export type EnrichmentActivity = Database['public']['Tables']['enrichment_activities']['Row']
export type Milestone = Database['public']['Tables']['milestones']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']
export type WeeklyDigest = Database['public']['Tables']['weekly_digests']['Row']
export type ChatHistory = Database['public']['Tables']['chat_history']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ChildInsert = Database['public']['Tables']['children']['Insert']
export type PlanInsert = Database['public']['Tables']['plans']['Insert']
export type SubAgentInsert = Database['public']['Tables']['sub_agents']['Insert']
export type AgentTaskInsert = Database['public']['Tables']['agent_tasks']['Insert']
export type AgentInsightInsert = Database['public']['Tables']['agent_insights']['Insert']
export type AgentRecommendationInsert = Database['public']['Tables']['agent_recommendations']['Insert']
export type AgentConversationInsert = Database['public']['Tables']['agent_conversations']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type ChildUpdate = Database['public']['Tables']['children']['Update']
export type PlanUpdate = Database['public']['Tables']['plans']['Update']
export type SubAgentUpdate = Database['public']['Tables']['sub_agents']['Update']
export type AgentTaskUpdate = Database['public']['Tables']['agent_tasks']['Update']
export type AgentInsightUpdate = Database['public']['Tables']['agent_insights']['Update']
export type AgentRecommendationUpdate = Database['public']['Tables']['agent_recommendations']['Update']
export type AgentConversationUpdate = Database['public']['Tables']['agent_conversations']['Update'] 