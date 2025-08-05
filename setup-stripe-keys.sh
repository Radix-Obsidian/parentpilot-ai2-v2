#!/bin/bash

# ParentPilot.AI2 - Stripe Configuration Setup Script
echo "🚀 Setting up Stripe configuration for ParentPilot.AI2..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Configuration
CLAUDE_API_KEY=your_claude_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (if using separate database)
DATABASE_URL=your_database_url

# Optional: Additional AI Services
OPENAI_API_KEY=your_openai_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Optional: Monitoring and Analytics
SENTRY_DSN=your_sentry_dsn
ANALYTICS_KEY=your_analytics_key

# Optional: Email Service (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Optional: File Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_s3_bucket_name

# Optional: Redis (for caching and sessions)
REDIS_URL=your_redis_url

# Optional: JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Stripe Configuration (LIVE KEYS)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_STARTER_PRICE_ID=price_starter_plan_id
STRIPE_PRO_PRICE_ID=price_pro_plan_id
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_plan_id
EOF
    echo "✅ .env file created successfully!"
else
    echo "📝 .env file already exists, updating Stripe keys..."
    
    # Update Stripe keys in existing .env file
    sed -i '' 's/STRIPE_SECRET_KEY=.*/STRIPE_SECRET_KEY=your_stripe_secret_key_here/' .env
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY=.*/STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here/' .env
    
    echo "✅ Stripe keys updated successfully!"
fi

echo ""
echo "🔑 Your Stripe keys have been configured:"
echo "   Secret Key: your_stripe_secret_key_here"
echo "   Publishable Key: your_stripe_publishable_key_here"
echo ""
echo "⚠️  IMPORTANT: You still need to configure the following:"
echo "   1. STRIPE_WEBHOOK_SECRET - Get this from your Stripe Dashboard"
echo "   2. STRIPE_*_PRICE_ID - Create products/prices in Stripe Dashboard"
echo "   3. Other environment variables (Supabase, Claude API, etc.)"
echo ""
echo "📋 Next steps:"
echo "   1. Create products in Stripe Dashboard"
echo "   2. Set up webhook endpoint"
echo "   3. Configure other API keys"
echo "   4. Run: npm run dev"
echo ""
echo "🎉 Stripe configuration complete!" 