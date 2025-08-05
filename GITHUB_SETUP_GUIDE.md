# 🚀 GitHub Repository Setup Guide

## 📋 **STEP-BY-STEP GITHUB SETUP**

### **1. Create GitHub Repository**

1. **Go to GitHub**: https://github.com
2. **Click "New repository"** (green button)
3. **Repository name**: `parentpilot-ai2`
4. **Description**: `AI-powered parenting assistant with multi-agent system and Stripe integration`
5. **Make it Public** (for Netlify deployment)
6. **Don't initialize** with README (we already have one)
7. **Click "Create repository"**

### **2. Connect Local Repository to GitHub**

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/parentpilot-ai2.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### **3. Verify Repository**

- Go to your GitHub repository URL
- You should see all the files uploaded
- Check that `.env` is NOT in the repository (it should be ignored)

## 🌐 **NETLIFY DEPLOYMENT SETUP**

### **1. Connect to Netlify**

1. **Go to Netlify**: https://app.netlify.com
2. **Click "New site from Git"**
3. **Choose GitHub** as your Git provider
4. **Authorize Netlify** to access your GitHub account
5. **Select your repository**: `parentpilot-ai2`

### **2. Configure Build Settings**

**Build settings** (Netlify will auto-detect these):
- **Build command**: `npm run build`
- **Publish directory**: `dist/spa`
- **Node version**: `18`

### **3. Set Environment Variables**

In Netlify dashboard, go to **Site settings > Environment variables** and add:

```env
# Claude AI
CLAUDE_API_KEY=your_claude_api_key_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_STARTER_PRICE_ID=price_starter_plan_id
STRIPE_PRO_PRICE_ID=price_pro_plan_id
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_plan_id

# Supabase
SUPABASE_URL=https://odugiodvlmftdjtwgmcu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdWdpb2R2bG1mdGRqdHdnbWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDc5NDYsImV4cCI6MjA2OTkyMzk0Nn0.uFLGQALtF7Zzn_dHL7LM6C3jSzxJ_0lnk_ElvmrqeKo

# Other
NODE_ENV=production
PING_MESSAGE=ping pong
```

### **4. Deploy**

1. **Click "Deploy site"**
2. **Wait for build** (usually 2-3 minutes)
3. **Check build logs** for any errors
4. **Your site will be live** at a Netlify URL

## 🔧 **CUSTOM DOMAIN (OPTIONAL)**

### **1. Add Custom Domain**

1. **Go to Site settings > Domain management**
2. **Click "Add custom domain"**
3. **Enter your domain**: `parentpilot.ai` (or your preferred domain)
4. **Follow DNS instructions** to point your domain to Netlify

### **2. SSL Certificate**

- Netlify automatically provides SSL certificates
- Your site will be available at `https://yourdomain.com`

## 🚀 **AUTOMATIC DEPLOYMENTS**

### **How it Works**

- **Every push to `main` branch** triggers a new deployment
- **Pull requests** create preview deployments
- **Build logs** are available in Netlify dashboard

### **Deployment Triggers**

```bash
# Push to main = automatic deployment
git add .
git commit -m "Update feature"
git push origin main
```

## 📊 **MONITORING DEPLOYMENTS**

### **1. Netlify Dashboard**

- **Deployments tab**: See all deployments
- **Functions tab**: Monitor serverless functions
- **Analytics tab**: Track site performance

### **2. Build Logs**

- **Click on any deployment** to see build logs
- **Check for errors** in the build process
- **Verify environment variables** are set correctly

## 🔒 **SECURITY CONSIDERATIONS**

### **1. Environment Variables**

- ✅ **Never commit** `.env` files to Git
- ✅ **Use Netlify environment variables** for production
- ✅ **Rotate API keys** regularly
- ✅ **Monitor usage** in Stripe and Supabase dashboards

### **2. Access Control**

- **GitHub repository**: Public for Netlify deployment
- **Sensitive data**: Only in environment variables
- **API keys**: Securely stored in Netlify

## 🛠️ **TROUBLESHOOTING**

### **Common Issues**

1. **Build Fails**
   ```bash
   # Check build logs in Netlify
   # Verify all dependencies are in package.json
   # Ensure environment variables are set
   ```

2. **Environment Variables Not Working**
   ```bash
   # Check Netlify environment variables
   # Verify variable names match exactly
   # Re-deploy after adding variables
   ```

3. **Stripe Payments Not Working**
   ```bash
   # Verify Stripe keys are correct
   # Check webhook endpoint URL
   # Test with Stripe test cards
   ```

### **Debug Commands**

```bash
# Test local build
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Verify environment variables
node -e "console.log(process.env.CLAUDE_API_KEY ? 'Claude API set' : 'Claude API missing')"
```

## 📞 **SUPPORT**

### **GitHub Issues**
- Create issues for bugs or feature requests
- Use the issue templates provided

### **Netlify Support**
- **Documentation**: https://docs.netlify.com/
- **Community**: https://community.netlify.com/
- **Status**: https://status.netlify.com/

### **Stripe Support**
- **Documentation**: https://stripe.com/docs
- **Support**: https://support.stripe.com/

## ✅ **VERIFICATION CHECKLIST**

- [ ] GitHub repository created and connected
- [ ] All files pushed to GitHub
- [ ] Netlify site created and connected
- [ ] Environment variables set in Netlify
- [ ] Build succeeds without errors
- [ ] Site is accessible at Netlify URL
- [ ] Stripe payments work (test with test cards)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Team members can access repository

## 🎉 **SUCCESS!**

Once completed, you'll have:
- ✅ **GitHub repository** for collaboration
- ✅ **Netlify deployment** for hosting
- ✅ **Automatic deployments** on every push
- ✅ **Custom domain** (if configured)
- ✅ **SSL certificate** for security
- ✅ **Team collaboration** ready

**Your ParentPilot.AI2 is now ready for the world!** 🌍 