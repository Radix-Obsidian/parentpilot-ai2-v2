#!/bin/bash

# ParentPilot.AI2 - GitHub Repository Setup Script
echo "🚀 ParentPilot.AI2 - GitHub Repository Setup"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized. Run 'git init' first."
    exit 1
fi

echo "📋 GitHub Repository Setup Instructions"
echo ""

echo "1️⃣  CREATE GITHUB REPOSITORY"
echo "   • Go to: https://github.com"
echo "   • Click 'New repository'"
echo "   • Repository name: parentpilot-ai2"
echo "   • Description: AI-powered parenting assistant with multi-agent system and Stripe integration"
echo "   • Make it Public"
echo "   • Don't initialize with README (we already have one)"
echo "   • Click 'Create repository'"
echo ""

echo "2️⃣  CONNECT LOCAL REPOSITORY"
echo "   • Copy the repository URL from GitHub"
echo "   • Run these commands (replace YOUR_USERNAME with your GitHub username):"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/parentpilot-ai2.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "3️⃣  VERIFY REPOSITORY"
echo "   • Go to your GitHub repository URL"
echo "   • Check that all files are uploaded"
echo "   • Verify .env is NOT in the repository (it should be ignored)"
echo ""

echo "4️⃣  NETLIFY DEPLOYMENT"
echo "   • Go to: https://app.netlify.com"
echo "   • Click 'New site from Git'"
echo "   • Choose GitHub as your Git provider"
echo "   • Authorize Netlify to access your GitHub account"
echo "   • Select your repository: parentpilot-ai2"
echo ""

echo "5️⃣  CONFIGURE NETLIFY"
echo "   • Build command: npm run build"
echo "   • Publish directory: dist/spa"
echo "   • Node version: 18"
echo ""

echo "6️⃣  SET ENVIRONMENT VARIABLES"
echo "   • In Netlify dashboard, go to Site settings > Environment variables"
echo "   • Add all the variables from your .env file"
echo "   • See GITHUB_SETUP_GUIDE.md for the complete list"
echo ""

echo "7️⃣  DEPLOY"
echo "   • Click 'Deploy site' in Netlify"
echo "   • Wait for build (2-3 minutes)"
echo "   • Your site will be live at a Netlify URL"
echo ""

echo "📚 DOCUMENTATION"
echo "   • README.md - Project overview and setup"
echo "   • GITHUB_SETUP_GUIDE.md - Detailed GitHub/Netlify setup"
echo "   • PILOT_LAUNCH_CHECKLIST.md - Complete deployment checklist"
echo "   • STRIPE_INTEGRATION.md - Payment system documentation"
echo ""

echo "🔗 USEFUL LINKS"
echo "   • GitHub: https://github.com"
echo "   • Netlify: https://app.netlify.com"
echo "   • Stripe Dashboard: https://dashboard.stripe.com"
echo "   • Supabase Dashboard: https://app.supabase.com"
echo ""

echo "✅ NEXT STEPS"
echo "   1. Create GitHub repository (follow steps above)"
echo "   2. Push code to GitHub"
echo "   3. Connect to Netlify"
echo "   4. Set environment variables"
echo "   5. Deploy and test"
echo "   6. Share repository with your team"
echo ""

echo "🎯 TEAM COLLABORATION"
echo "   • Invite team members to GitHub repository"
echo "   • Set up branch protection rules"
echo "   • Create issue templates"
echo "   • Set up automated testing"
echo ""

echo "🚀 Your ParentPilot.AI2 is ready for GitHub and Netlify deployment!"
echo ""
echo "Need help? Check the documentation files or create an issue in the repository." 