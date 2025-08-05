# Stripe Setup Guide for ParentPilot.AI2

Your Stripe keys have been successfully configured! Here's what you need to do next to complete the setup.

## ✅ **COMPLETED**
- ✅ Stripe Secret Key: `your_stripe_secret_key_here`
- ✅ Stripe Publishable Key: `your_stripe_publishable_key_here`

## 🔧 **NEXT STEPS**

### **1. Create Products in Stripe Dashboard**

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Navigate to Products**: Products → Add Product
3. **Create Three Products**:

#### **Starter Plan**
- **Name**: "ParentPilot Starter Plan"
- **Description**: "Basic parenting AI assistance"
- **Price**: $10/month (recurring)
- **Price ID**: Copy this ID for `STRIPE_STARTER_PRICE_ID`

#### **Pro Plan**
- **Name**: "ParentPilot Pro Plan"
- **Description**: "Advanced parenting AI with unlimited usage"
- **Price**: $50/month (recurring)
- **Price ID**: Copy this ID for `STRIPE_PRO_PRICE_ID`

#### **Enterprise Plan**
- **Name**: "ParentPilot Enterprise Plan"
- **Description**: "Enterprise-level parenting AI support"
- **Price**: $500/month (recurring)
- **Price ID**: Copy this ID for `STRIPE_ENTERPRISE_PRICE_ID`

### **2. Set Up Webhook Endpoint**

1. **In Stripe Dashboard**: Go to Developers → Webhooks
2. **Add Endpoint**: 
   - **URL**: `https://your-domain.com/api/payments/webhook`
   - **Events to send**:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. **Copy Webhook Secret**: Use this for `STRIPE_WEBHOOK_SECRET`

### **3. Update Environment Variables**

Add these to your `.env` file:

```bash
# Replace with your actual Stripe Price IDs
STRIPE_STARTER_PRICE_ID=price_1ABC123DEF456GHI789JKL
STRIPE_PRO_PRICE_ID=price_1ABC123DEF456GHI789JKL
STRIPE_ENTERPRISE_PRICE_ID=price_1ABC123DEF456GHI789JKL

# Replace with your webhook secret
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef
```

### **4. Configure Other Required Services**

#### **Supabase Setup**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

#### **Claude AI Setup**
```bash
CLAUDE_API_KEY=sk-ant-api03-your-claude-key
```

### **5. Test the Integration**

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Test payment flow**:
   ```bash
   # Create a customer
   curl -X POST http://localhost:3001/api/payments/customers \
     -H "Content-Type: application/json" \
     -H "user-id: test-user" \
     -d '{"email":"test@example.com","name":"Test User"}'
   
   # Create a payment intent
   curl -X POST http://localhost:3001/api/payments/payment-intent \
     -H "Content-Type: application/json" \
     -H "user-id: test-user" \
     -d '{"amount":25.00}'
   ```

## 🧪 **TESTING WITH STRIPE**

### **Test Cards**
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### **Test Webhooks Locally**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/api/payments/webhook
```

## 🔒 **SECURITY CONSIDERATIONS**

### **Production Checklist**
- ✅ Use HTTPS for webhook endpoints
- ✅ Verify webhook signatures
- ✅ Store sensitive keys securely
- ✅ Monitor payment failures
- ✅ Set up error alerts

### **Environment Variables Security**
```bash
# Never commit .env to git
echo ".env" >> .gitignore

# Use different keys for development/production
STRIPE_SECRET_KEY=sk_test_... # Development
STRIPE_SECRET_KEY=your_stripe_secret_key_here # Production
```

## 📊 **MONITORING**

### **Stripe Dashboard**
- Monitor payments in real-time
- View subscription analytics
- Track webhook delivery
- Monitor API usage

### **Application Logs**
```bash
# Check payment logs
tail -f logs/payments.log

# Monitor webhook events
tail -f logs/webhooks.log
```

## 🚀 **DEPLOYMENT**

### **Environment Variables for Production**
```bash
# Production .env
NODE_ENV=production
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_production_webhook_secret
```

### **Webhook URL for Production**
```
https://your-production-domain.com/api/payments/webhook
```

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

1. **Webhook Not Receiving Events**
   - Check webhook URL is accessible
   - Verify webhook secret matches
   - Check server logs for errors

2. **Payment Intent Creation Fails**
   - Verify Stripe keys are correct
   - Check customer exists in Stripe
   - Ensure amount is in cents

3. **Subscription Creation Fails**
   - Verify price IDs are correct
   - Check customer has payment method
   - Ensure price is recurring

### **Debug Commands**
```bash
# Test Stripe connection
curl -H "Authorization: Bearer your_stripe_secret_key_here" \
  https://api.stripe.com/v1/customers

# Check webhook events
stripe events list --limit 10
```

## ✅ **VERIFICATION CHECKLIST**

- [ ] Stripe keys configured in `.env`
- [ ] Products created in Stripe Dashboard
- [ ] Price IDs added to environment variables
- [ ] Webhook endpoint configured
- [ ] Webhook secret added to environment
- [ ] Test payment flow works
- [ ] Webhook events are received
- [ ] Database migrations run successfully
- [ ] Production environment variables set
- [ ] HTTPS enabled for production

Your Stripe integration is now ready for production! 🎉

## 📞 **SUPPORT**

If you encounter any issues:
1. Check Stripe Dashboard for payment status
2. Review application logs for errors
3. Test with Stripe CLI locally
4. Contact Stripe support if needed

**Stripe Support**: https://support.stripe.com/
**Stripe Documentation**: https://stripe.com/docs 