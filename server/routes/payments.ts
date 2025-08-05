import express from 'express';
import { stripeService } from '../services/stripe-service';
import { costTracker } from '../services/cost-tracker';
import { dbService } from '../database/config';

const router = express.Router();

// Middleware to validate user authentication
const authenticateUser = async (req: any, res: any, next: any) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }
  req.userId = userId;
  next();
};

// Create a Stripe customer for a user
router.post('/customers', authenticateUser, async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and name are required' 
      });
    }

    const customer = await stripeService.createCustomer(req.userId, email, name);

    res.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create customer' 
    });
  }
});

// Create a payment intent for usage-based payment
router.post('/payment-intent', authenticateUser, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid amount is required' 
      });
    }

    const paymentIntent = await stripeService.processUsagePayment(req.userId, amount);

    res.json({
      success: true,
      data: paymentIntent
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create payment intent' 
    });
  }
});

// Create a subscription
router.post('/subscriptions', authenticateUser, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!planId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Plan ID is required' 
      });
    }

    // Get user's customer ID
    const user = await dbService.getUserById(req.userId);
    if (!user?.stripe_customer_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'User must have a Stripe customer ID' 
      });
    }

    const subscription = await stripeService.createSubscription(user.stripe_customer_id, planId);

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create subscription' 
    });
  }
});

// Update subscription (change plan)
router.put('/subscriptions/:subscriptionId', authenticateUser, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { planId } = req.body;
    
    if (!planId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Plan ID is required' 
      });
    }

    const subscription = await stripeService.updateSubscription(subscriptionId, planId);

    res.json({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update subscription' 
    });
  }
});

// Cancel subscription
router.delete('/subscriptions/:subscriptionId', authenticateUser, async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    await stripeService.cancelSubscription(subscriptionId);

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to cancel subscription' 
    });
  }
});

// Get user's billing information
router.get('/billing', authenticateUser, async (req, res) => {
  try {
    const billing = await costTracker.getUserBilling(req.userId);
    const customer = await stripeService.getCustomerByUserId(req.userId);

    res.json({
      success: true,
      data: {
        billing,
        customer
      }
    });

  } catch (error) {
    console.error('Error getting billing info:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get billing information' 
    });
  }
});

// Get payment history
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const user = await dbService.getUserById(req.userId);
    if (!user?.stripe_customer_id) {
      return res.json({
        success: true,
        data: []
      });
    }

    const { limit = 10 } = req.query;
    const payments = await stripeService.getPaymentHistory(user.stripe_customer_id, Number(limit));

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get payment history' 
    });
  }
});

// Get cost analytics
router.get('/analytics', authenticateUser, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const analytics = await costTracker.getCostAnalytics(req.userId, start, end);

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error getting cost analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get cost analytics' 
    });
  }
});

// Get available billing plans
router.get('/plans', authenticateUser, async (req, res) => {
  try {
    const plans = await costTracker.getBillingPlans();

    res.json({
      success: true,
      data: plans
    });

  } catch (error) {
    console.error('Error getting billing plans:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get billing plans' 
    });
  }
});

// Upgrade user's plan
router.post('/upgrade-plan', authenticateUser, async (req, res) => {
  try {
    const { planId } = req.body;
    
    if (!planId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Plan ID is required' 
      });
    }

    const success = await costTracker.upgradePlan(req.userId, planId);

    if (success) {
      res.json({
        success: true,
        message: 'Plan upgraded successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to upgrade plan'
      });
    }

  } catch (error) {
    console.error('Error upgrading plan:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upgrade plan' 
    });
  }
});

// Check if user can process a task (usage limit check)
router.post('/check-usage-limit', authenticateUser, async (req, res) => {
  try {
    const { estimatedCost } = req.body;
    
    if (!estimatedCost || estimatedCost < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid estimated cost is required' 
      });
    }

    const canProcess = await costTracker.checkUsageLimit(req.userId, estimatedCost);

    res.json({
      success: true,
      data: {
        canProcess,
        estimatedCost
      }
    });

  } catch (error) {
    console.error('Error checking usage limit:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check usage limit' 
    });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).json({ error: 'Missing signature or webhook secret' });
    }

    let event;
    try {
      event = stripeService.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle the event
    await stripeService.handleWebhook(event);

    res.json({ received: true });

  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

export { router as paymentsRouter }; 