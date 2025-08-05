# 🚀 ParentPilot.AI2

**AI-Powered Parenting Assistant with Multi-Agent System**

ParentPilot.AI2 is a comprehensive parenting platform that uses advanced AI agents to provide personalized guidance, insights, and recommendations for parents. Built with React, TypeScript, and powered by Claude AI.

## ✨ Features

### 🤖 Multi-Agent AI System
- **Dispatcher Agent**: Categorizes and prioritizes parenting tasks
- **Analyst Agent**: Generates insights and pattern recognition
- **Scheduler Agent**: Creates timelines and action plans
- **Task Processor**: Orchestrates the entire workflow

### 💳 Payment Integration
- **Stripe Integration**: Secure payment processing
- **Subscription Management**: Multiple pricing tiers
- **Webhook Handling**: Real-time payment updates
- **Cost Tracking**: AI usage monitoring

### 🎨 User Experience
- **Professional Pricing Page**: Embedded Stripe pricing table
- **Responsive Design**: Mobile-friendly interface
- **Real-time Chat**: AI-powered parenting assistance
- **Dashboard**: Personalized insights and recommendations

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Radix UI** for components
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Supabase** for database
- **Claude AI** for intelligent responses
- **Stripe** for payments

### Infrastructure
- **Vercel** for deployment
- **GitHub** for version control
- **Supabase** for database hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/parentpilot-ai2.git
   cd parentpilot-ai2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API keys:
   ```env
   # Claude AI
   CLAUDE_API_KEY=your_claude_api_key
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
parentpilot-ai2/
├── client/                 # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   └── App.tsx           # Main app component
├── server/               # Backend Node.js application
│   ├── agents/           # AI agent implementations
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   └── database/         # Database configuration
├── shared/               # Shared types and utilities
├── docs/                 # Documentation
└── scripts/              # Build and deployment scripts
```

## 🤖 AI Agents

### Dispatcher Agent
- **Purpose**: Categorizes and prioritizes parenting tasks
- **Input**: Raw user input about parenting situations
- **Output**: Task categorization, priority assessment, processing estimation

### Analyst Agent
- **Purpose**: Generates insights and identifies patterns
- **Input**: Categorized tasks and context
- **Output**: Insights, patterns, recommendations, confidence scores

### Scheduler Agent
- **Purpose**: Creates timelines and action plans
- **Input**: Insights and recommendations
- **Output**: Timelines, scheduled actions, reminders

## 💳 Payment System

### Stripe Integration
- **Pricing Table**: Embedded Stripe pricing component
- **Subscription Management**: Two tiers (Starter, Pro)
- **Webhook Handling**: Real-time payment event processing
- **Cost Tracking**: AI usage monitoring and billing

### Pricing Tiers
- **Starter**: $19.99/month - 50 AI interactions per month
- **Pro**: $49.99/month - Unlimited AI interactions
## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify
# Connect your GitHub repository to Netlify
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Payment Flow
```bash
# Test cards for Stripe
4242 4242 4242 4242  # Success
4000 0000 0000 0002  # Decline
```

## 📊 Monitoring

### Application Metrics
- **Page Load Times**: < 2 seconds
- **API Response Times**: < 500ms
- **Payment Success Rate**: > 95%
- **Uptime**: > 99.9%

### Business Metrics
- **User Registration**: Track signup conversions
- **Payment Conversions**: Monitor pricing page to payment
- **User Engagement**: Measure feature usage
- **AI Usage**: Track cost per user

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

### Pull Request Guidelines
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [AI Agents Guide](./docs/agents.md)
- [Payment Integration](./docs/payments.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🔒 Security

### Data Protection
- **Payment Data**: Handled securely by Stripe (PCI DSS compliant)
- **User Data**: Encrypted in transit and at rest
- **API Keys**: Stored securely in environment variables
- **Authentication**: JWT-based with secure token handling

### Security Features
- **CORS**: Configured for production domains
- **Rate Limiting**: Prevents abuse
- **Input Validation**: All user inputs validated
- **HTTPS**: Required in production

## 📞 Support

### Technical Support
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/parentpilot-ai2/issues)
- **Documentation**: Check the docs folder
- **Community**: Join our Discord server

### Business Support
- **Stripe Support**: https://support.stripe.com/
- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Claude AI** for intelligent responses
- **Stripe** for secure payment processing
- **Supabase** for database hosting
- **Vercel** for deployment platform
- **Open Source Community** for amazing tools

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Multi-agent AI system
- ✅ Payment integration
- ✅ User authentication
- ✅ Basic dashboard

### Phase 2 (Next)
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Social features
- [ ] Expert consultations

### Phase 3 (Future)
- [ ] AI-powered video analysis
- [ ] Integration with smart devices
- [ ] Community marketplace
- [ ] International expansion

---

**Made with ❤️ for parents everywhere**

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/parentpilot-ai2)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/parentpilot-ai2) 
