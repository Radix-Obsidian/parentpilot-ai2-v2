#!/bin/bash

# ParentPilot.AI2 - Deployment Script
echo "🚀 ParentPilot.AI2 - Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Please run setup-stripe-keys.sh first"
    exit 1
fi

echo "📋 Pre-deployment checks..."

# Check if all required environment variables are set
echo "🔍 Checking environment variables..."

REQUIRED_VARS=(
    "CLAUDE_API_KEY"
    "STRIPE_SECRET_KEY"
    "STRIPE_PUBLISHABLE_KEY"
    "SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo "Please configure these variables before deploying."
    exit 1
fi

echo "✅ Environment variables check passed"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "This will open your browser for authentication..."

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "1. ✅ Test the live application"
    echo "2. ✅ Verify Stripe payments work"
    echo "3. ✅ Check webhook endpoints"
    echo "4. ✅ Monitor error logs"
    echo "5. ✅ Test user registration"
    echo ""
    echo "🔗 Your application is now live!"
    echo "Monitor it at: https://vercel.com/dashboard"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi

echo ""
echo "🎯 Next steps:"
echo "1. Complete Stripe Dashboard setup"
echo "2. Configure webhook endpoints"
echo "3. Set up monitoring and alerts"
echo "4. Test with real users"
echo ""
echo "Good luck with your pilot launch! 🚀" 