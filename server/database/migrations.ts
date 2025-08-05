import { dbService } from './config';

export interface Migration {
  id: string;
  name: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

export class MigrationManager {
  private migrations: Migration[] = [];

  constructor() {
    this.registerMigrations();
  }

  private registerMigrations() {
    // Migration 001: Create multi-agent tables
    this.migrations.push({
      id: '001',
      name: 'Create Multi-Agent Tables',
      description: 'Create subagent_tasks and subagent_logs tables for the multi-agent system',
      up: async () => {
        await dbService.supabase.rpc('exec_sql', {
          sql: `
            -- Create subagent_tasks table if not exists
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

            -- Create subagent_logs table if not exists
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

            -- Create indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_subagent_tasks_user ON subagent_tasks(user_id, created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_subagent_logs_task ON subagent_logs(task_id);

            -- Enable RLS
            ALTER TABLE subagent_tasks ENABLE ROW LEVEL SECURITY;
            ALTER TABLE subagent_logs ENABLE ROW LEVEL SECURITY;

            -- Create RLS policies
            CREATE POLICY IF NOT EXISTS subagent_tasks_policy ON subagent_tasks FOR ALL USING (auth.uid() = user_id);
            CREATE POLICY IF NOT EXISTS subagent_logs_policy ON subagent_logs FOR SELECT USING (
              EXISTS (SELECT 1 FROM subagent_tasks WHERE subagent_tasks.id = subagent_logs.task_id AND subagent_tasks.user_id = auth.uid())
            );
          `
        });
      },
      down: async () => {
        await dbService.supabase.rpc('exec_sql', {
          sql: `
            DROP TABLE IF EXISTS subagent_logs;
            DROP TABLE IF EXISTS subagent_tasks;
          `
        });
      }
    });

    // Migration 002: Add cost tracking indexes
    this.migrations.push({
      id: '002',
      name: 'Add Cost Tracking Indexes',
      description: 'Add indexes for cost tracking and analytics',
      up: async () => {
        await dbService.supabase.rpc('exec_sql', {
          sql: `
            -- Add indexes for cost tracking
            CREATE INDEX IF NOT EXISTS idx_subagent_logs_cost ON subagent_logs(cost_cents, created_at);
            CREATE INDEX IF NOT EXISTS idx_subagent_logs_agent ON subagent_logs(agent_name, created_at);
            CREATE INDEX IF NOT EXISTS idx_subagent_tasks_cost ON subagent_tasks(total_cost_cents, created_at);
          `
        });
      },
      down: async () => {
        await dbService.supabase.rpc('exec_sql', {
          sql: `
            DROP INDEX IF EXISTS idx_subagent_logs_cost;
            DROP INDEX IF EXISTS idx_subagent_logs_agent;
            DROP INDEX IF EXISTS idx_subagent_tasks_cost;
          `
        });
      }
    });

    // Migration 003: Add agent types for multi-agent system
    this.migrations.push({
      id: '003',
      name: 'Add Multi-Agent Types',
      description: 'Add dispatcher, analyst, and scheduler agent types',
      up: async () => {
        await dbService.supabase.rpc('exec_sql', {
          sql: `
            -- Insert multi-agent types if they don't exist
            INSERT INTO agent_types (name, description, capabilities) VALUES
            ('Dispatcher', 'Categorizes and prioritizes incoming tasks', ARRAY['task_categorization', 'priority_assessment', 'processing_estimation'])
            ON CONFLICT (name) DO NOTHING;
            
            INSERT INTO agent_types (name, description, capabilities) VALUES
            ('Analyst', 'Analyzes patterns and provides insights', ARRAY['pattern_recognition', 'insight_generation', 'recommendation_engine'])
            ON CONFLICT (name) DO NOTHING;
            
            INSERT INTO agent_types (name, description, capabilities) VALUES
            ('Scheduler', 'Schedules actions and creates timelines', ARRAY['timeline_creation', 'action_scheduling', 'reminder_generation'])
            ON CONFLICT (name) DO NOTHING;
          `
        });
      },
      down: async () => {
        await dbService.supabase.rpc('exec_sql', {
          sql: `
            DELETE FROM agent_types WHERE name IN ('Dispatcher', 'Analyst', 'Scheduler');
          `
        });
      }
    });

    // Migration 004: Add payment and billing tables
    this.migrations.push({
      id: '004',
      name: 'Add Payment and Billing Tables',
      description: 'Create tables for payment processing and billing management',
      up: async () => {
        await dbService.supabase.rpc('exec_sql', {
          sql: `
            -- Add stripe_customer_id column to users table
            ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

            -- Create payment_attempts table
            CREATE TABLE IF NOT EXISTS payment_attempts (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              amount_cents INTEGER NOT NULL,
              payment_intent_id TEXT UNIQUE,
              status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            -- Create user_usage table for tracking monthly usage
            CREATE TABLE IF NOT EXISTS user_usage (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              monthly_usage_cents INTEGER DEFAULT 0,
              reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(user_id)
            );

            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_payment_attempts_user ON payment_attempts(user_id, created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_payment_attempts_status ON payment_attempts(status);
            CREATE INDEX IF NOT EXISTS idx_user_usage_user ON user_usage(user_id);

            -- Enable RLS
            ALTER TABLE payment_attempts ENABLE ROW LEVEL SECURITY;
            ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

            -- Create RLS policies
            CREATE POLICY IF NOT EXISTS payment_attempts_policy ON payment_attempts FOR ALL USING (auth.uid() = user_id);
            CREATE POLICY IF NOT EXISTS user_usage_policy ON user_usage FOR ALL USING (auth.uid() = user_id);

            -- Create updated_at triggers
            CREATE TRIGGER IF NOT EXISTS update_payment_attempts_updated_at BEFORE UPDATE ON payment_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            CREATE TRIGGER IF NOT EXISTS update_user_usage_updated_at BEFORE UPDATE ON user_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
          `
        });
      },
      down: async () => {
        await dbService.supabase.rpc('exec_sql', {
          sql: `
            DROP TABLE IF EXISTS user_usage;
            DROP TABLE IF EXISTS payment_attempts;
            ALTER TABLE users DROP COLUMN IF EXISTS stripe_customer_id;
          `
        });
      }
    });
  }

  async runMigrations(): Promise<void> {
    console.log('Running database migrations...');
    
    try {
      // Create migrations table if it doesn't exist
      await this.createMigrationsTable();
      
      // Get applied migrations
      const appliedMigrations = await this.getAppliedMigrations();
      
      // Run pending migrations
      for (const migration of this.migrations) {
        if (!appliedMigrations.includes(migration.id)) {
          console.log(`Running migration ${migration.id}: ${migration.name}`);
          await migration.up();
          await this.markMigrationAsApplied(migration.id);
          console.log(`✓ Migration ${migration.id} completed`);
        }
      }
      
      console.log('All migrations completed successfully');
    } catch (error) {
      console.error('Error running migrations:', error);
      throw error;
    }
  }

  async rollbackMigration(migrationId: string): Promise<void> {
    const migration = this.migrations.find(m => m.id === migrationId);
    if (!migration) {
      throw new Error(`Migration ${migrationId} not found`);
    }

    console.log(`Rolling back migration ${migrationId}: ${migration.name}`);
    await migration.down();
    await this.markMigrationAsRolledBack(migrationId);
    console.log(`✓ Migration ${migrationId} rolled back`);
  }

  private async createMigrationsTable(): Promise<void> {
    await dbService.supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS migrations (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          rolled_back_at TIMESTAMP WITH TIME ZONE
        );
      `
    });
  }

  private async getAppliedMigrations(): Promise<string[]> {
    const { data, error } = await dbService.supabase
      .from('migrations')
      .select('id')
      .is('rolled_back_at', null);

    if (error) {
      console.error('Error getting applied migrations:', error);
      return [];
    }

    return data.map(row => row.id);
  }

  private async markMigrationAsApplied(migrationId: string): Promise<void> {
    const migration = this.migrations.find(m => m.id === migrationId);
    if (!migration) return;

    await dbService.supabase
      .from('migrations')
      .upsert({
        id: migrationId,
        name: migration.name,
        description: migration.description,
        applied_at: new Date()
      });
  }

  private async markMigrationAsRolledBack(migrationId: string): Promise<void> {
    await dbService.supabase
      .from('migrations')
      .update({ rolled_back_at: new Date() })
      .eq('id', migrationId);
  }

  async getMigrationStatus(): Promise<any[]> {
    const appliedMigrations = await this.getAppliedMigrations();
    
    return this.migrations.map(migration => ({
      id: migration.id,
      name: migration.name,
      description: migration.description,
      applied: appliedMigrations.includes(migration.id)
    }));
  }
}

// Export singleton instance
export const migrationManager = new MigrationManager(); 