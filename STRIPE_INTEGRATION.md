# Stripe Payment Integration

This document explains how ParentPilot.AI2 handles payments using Stripe, including how payments are processed, stored, and managed.

## 🏗️ **ARCHITECTURE OVERVIEW**

### **Payment Flow**
1. **User Action**: User triggers a task that requires payment
2. **Usage Check**: System checks if user has remaining usage
3. **Payment Intent**: If needed, creates Stripe payment intent
4. **Payment Processing**: User completes payment via Stripe
5. **Webhook Handling**: Stripe sends webhook with payment status
6. **Database Update**: System updates payment and usage records

## 💳 **PAYMENT METHODS**

### **1. Usage-Based Payments**
- **Trigger**: When user exceeds monthly usage limit
- **Amount**: Calculated based on actual usage
- **Frequency**: One-time payments as needed

### **2. Subscription Payments**
- **Trigger**: Monthly recurring billing
- **Amount**: Fixed monthly plan amount
- **Frequency**: Automatic monthly charges

## 🗄️ **DATABASE SCHEMA**

### **Users Table (Updated)**
```sql
ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
```

### **Payment Attempts Table**
```sql
CREATE TABLE payment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  payment_intent_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **User Usage Table**
```sql
CREATE TABLE user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_usage_cents INTEGER DEFAULT 0,
  reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

## 🔧 **API ENDPOINTS**

### **Payment Routes** (`/api/payments`)

```typescript
// Create Stripe customer
POST /api/payments/customers
{
  "email": "user@example.com",
  "name": "John Doe"
}

// Create payment intent for usage payment
POST /api/payments/payment-intent
{
  "amount": 15.50
}

// Create subscription
POST /api/payments/subscriptions
{
  "planId": "pro"
}

// Update subscription
PUT /api/payments/subscriptions/:subscriptionId
{
  "planId": "enterprise"
}

// Cancel subscription
DELETE /api/payments/subscriptions/:subscriptionId

// Get billing information
GET /api/payments/billing

// Get payment history
GET /api/payments/history?limit=10

// Get cost analytics
GET /api/payments/analytics?startDate=2024-01-01&endDate=2024-01-31

// Get available plans
GET /api/payments/plans

// Upgrade plan
POST /api/payments/upgrade-plan
{
  "planId": "pro"
}

// Check usage limit
POST /api/payments/check-usage-limit
{
  "estimatedCost": 25.00
}

// Stripe webhook handler
POST /api/payments/webhook
```

## 💰 **BILLING PLANS**

### **Starter Plan**
- **Monthly Limit**: $10 (1,000 cents)
- **Cost per Token**: $0.001
- **Cost per Minute**: $0.10
- **Stripe Price ID**: `price_starter_plan_id`

### **Pro Plan**
- **Monthly Limit**: $50 (5,000 cents)
- **Cost per Token**: $0.0005
- **Cost per Minute**: $0.05
- **Stripe Price ID**: `price_pro_plan_id`

### **Enterprise Plan**
- **Monthly Limit**: $500 (50,000 cents)
- **Cost per Token**: $0.0002
- **Cost per Minute**: $0.02
- **Stripe Price ID**: `price_enterprise_plan_id`

## 🔄 **PAYMENT PROCESSING FLOW**

### **1. Usage-Based Payment Flow**

```typescript
// User tries to process a task
const taskProcessor = new TaskProcessor(context);
const estimatedCost = 25.00; // cents

// Check if user can afford the task
const canProcess = await costTracker.checkUsageLimit(userId, estimatedCost);

if (!canProcess) {
  // Create payment intent
  const paymentIntent = await stripeService.processUsagePayment(userId, estimatedCost);
  
  // Return payment intent to frontend
  return {
    requiresPayment: true,
    paymentIntent: paymentIntent
  };
}

// Process the task
const result = await taskProcessor.processTask(taskInput);
```

### **2. Subscription Payment Flow**

```typescript
// User subscribes to a plan
const customer = await stripeService.createCustomer(userId, email, name);
const subscription = await stripeService.createSubscription(customer.id, 'pro');

// Stripe handles recurring billing automatically
// Webhooks update subscription status
```

## 📡 **WEBHOOK HANDLING**

### **Supported Webhook Events**

```typescript
// Payment events
'payment_intent.succeeded'    // Payment completed
'payment_intent.payment_failed' // Payment failed

// Subscription events
'customer.subscription.created' // New subscription
'customer.subscription.updated' // Plan changed
'customer.subscription.deleted' // Subscription cancelled

// Invoice events
'invoice.payment_succeeded'   // Monthly billing succeeded
'invoice.payment_failed'      // Monthly billing failed
```

### **Webhook Processing**

```typescript
// Webhook handler automatically processes events
router.post('/webhook', async (req, res) => {
  const event = stripe.webhooks.constructEvent(req.body, sig, secret);
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update payment status
      // Reset user usage
      break;
      
    case 'customer.subscription.created':
      // Update user subscription status
      break;
      
    case 'invoice.payment_succeeded':
      // Reset monthly usage
      break;
  }
});
```

## 🔐 **SECURITY FEATURES**

### **1. Webhook Signature Verification**
- All webhooks are verified using Stripe's signature
- Prevents webhook spoofing attacks

### **2. Row Level Security (RLS)**
- Users can only access their own payment data
- Database-level security enforcement

### **3. Payment Intent Security**
- Client secrets are used for frontend payment processing
- Server-side payment intent creation

## 📊 **USAGE TRACKING**

### **Cost Calculation**
```typescript
// Calculate cost based on usage
const calculateCost = (tokensUsed: number, executionTimeMs: number) => {
  const plan = billingPlans[userPlan];
  const tokenCost = tokensUsed * plan.costPerToken;
  const timeCost = (executionTimeMs / 60000) * plan.costPerMinute;
  return Math.round((tokenCost + timeCost) * 100); // Convert to cents
};
```

### **Usage Monitoring**
```typescript
// Track usage in real-time
await dbService.supabase
  .from('user_usage')
  .upsert({
    user_id: userId,
    monthly_usage_cents: currentUsage + newCost,
    updated_at: new Date()
  });
```

## 🚀 **DEPLOYMENT SETUP**

### **1. Environment Variables**
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_STARTER_PRICE_ID=price_starter_plan_id
STRIPE_PRO_PRICE_ID=price_pro_plan_id
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_plan_id
```

### **2. Stripe Dashboard Setup**
1. Create products in Stripe Dashboard
2. Set up recurring prices for each plan
3. Configure webhook endpoint
4. Add webhook events to listen for

### **3. Database Migration**
```bash
# Run migrations to create payment tables
npm run dev  # Migrations run automatically
```

## 💡 **USAGE EXAMPLES**

### **Frontend Payment Integration**

```typescript
// 1. Create payment intent
const response = await fetch('/api/payments/payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': userId
  },
  body: JSON.stringify({ amount: 25.00 })
});

const { data: paymentIntent } = await response.json();

// 2. Process payment with Stripe Elements
const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: `${window.location.origin}/payment-success`,
  },
});

// 3. Handle success/failure
if (error) {
  console.error('Payment failed:', error);
} else {
  console.log('Payment successful!');
}
```

### **Subscription Management**

```typescript
// Create subscription
const subscription = await fetch('/api/payments/subscriptions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-id': userId
  },
  body: JSON.stringify({ planId: 'pro' })
});

// Cancel subscription
await fetch(`/api/payments/subscriptions/${subscriptionId}`, {
  method: 'DELETE',
  headers: { 'user-id': userId }
});
```

## 🔍 **MONITORING & ANALYTICS**

### **Payment Analytics**
- Total revenue tracking
- Payment success rates
- Subscription conversion rates
- Usage patterns by plan

### **Cost Analytics**
- Monthly spending trends
- Cost breakdown by agent
- Usage optimization insights
- Budget alerts

## 🛡️ **ERROR HANDLING**

### **Common Error Scenarios**
1. **Payment Failed**: Retry with different payment method
2. **Insufficient Funds**: Prompt user to add payment method
3. **Webhook Failure**: Manual intervention required
4. **Usage Limit Exceeded**: Prompt for plan upgrade

### **Recovery Procedures**
```typescript
// Handle payment failure
if (paymentStatus === 'failed') {
  // Log failure
  await logPaymentFailure(userId, paymentIntentId, error);
  
  // Notify user
  await sendPaymentFailureNotification(userId);
  
  // Offer retry option
  return { retryPayment: true };
}
```

## ✅ **TESTING**

### **Stripe Test Mode**
- Use test API keys for development
- Test webhook events using Stripe CLI
- Simulate payment failures and successes

### **Test Cards**
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

The Stripe integration is now complete and ready for production use! 🎉 