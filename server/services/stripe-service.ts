import Stripe from 'stripe';
import { dbService } from '../database/config';
import { costTracker } from './cost-tracker';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  planId: string;
  customerId: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  subscriptionId?: string;
}

export class StripeService {
  private stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  // Create a customer in Stripe
  async createCustomer(userId: string, email: string, name: string): Promise<Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          userId
        }
      });

      // Update user in database with Stripe customer ID
      await dbService.supabase
        .from('users')
        .update({ 
          stripe_customer_id: customer.id,
          updated_at: new Date()
        })
        .eq('id', userId);

      return {
        id: customer.id,
        email: customer.email!,
        name: customer.name!
      };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  }

  // Create a payment intent for one-time payments
  async createPaymentIntent(amount: number, currency: string = 'usd', customerId?: string): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          type: 'usage_payment'
        }
      });

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret!
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Create a subscription
  async createSubscription(customerId: string, planId: string): Promise<Subscription> {
    try {
      // Get the price ID for the plan
      const priceId = await this.getPriceIdForPlan(planId);
      
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          planId
        }
      });

      return {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        planId,
        customerId
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Update subscription (change plan)
  async updateSubscription(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    try {
      const newPriceId = await this.getPriceIdForPlan(newPlanId);
      
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      
      const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        metadata: {
          planId: newPlanId
        }
      });

      return {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        currentPeriodStart: new Date(updatedSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        planId: newPlanId,
        customerId: updatedSubscription.customer as string
      };
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Process usage-based payment
  async processUsagePayment(userId: string, amount: number): Promise<PaymentIntent> {
    try {
      // Get user's Stripe customer ID
      const user = await dbService.getUserById(userId);
      if (!user?.stripe_customer_id) {
        throw new Error('User does not have a Stripe customer ID');
      }

      // Create payment intent
      const paymentIntent = await this.createPaymentIntent(amount, 'usd', user.stripe_customer_id);

      // Log the payment attempt
      await this.logPaymentAttempt(userId, amount, paymentIntent.id);

      return paymentIntent;
    } catch (error) {
      console.error('Error processing usage payment:', error);
      throw error;
    }
  }

  // Handle webhook events
  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  // Get customer by user ID
  async getCustomerByUserId(userId: string): Promise<Customer | null> {
    try {
      const user = await dbService.getUserById(userId);
      if (!user?.stripe_customer_id) {
        return null;
      }

      const customer = await this.stripe.customers.retrieve(user.stripe_customer_id);
      
      return {
        id: customer.id,
        email: customer.email!,
        name: customer.name!,
        subscriptionId: customer.subscriptions?.data[0]?.id
      };
    } catch (error) {
      console.error('Error getting customer:', error);
      return null;
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      
      return {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        planId: subscription.metadata.planId || 'starter',
        customerId: subscription.customer as string
      };
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  }

  // Get payment history
  async getPaymentHistory(customerId: string, limit: number = 10): Promise<any[]> {
    try {
      const payments = await this.stripe.paymentIntents.list({
        customer: customerId,
        limit
      });

      return payments.data.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        created: new Date(payment.created * 1000),
        description: payment.description
      }));
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  }

  // Private helper methods
  private async getPriceIdForPlan(planId: string): Promise<string> {
    // Map plan IDs to Stripe price IDs
    const planToPriceMap: Record<string, string> = {
      'starter': process.env.STRIPE_STARTER_PRICE_ID!,
      'pro': process.env.STRIPE_PRO_PRICE_ID!,
      'enterprise': process.env.STRIPE_ENTERPRISE_PRICE_ID!
    };

    const priceId = planToPriceMap[planId];
    if (!priceId) {
      throw new Error(`No price ID found for plan: ${planId}`);
    }

    return priceId;
  }

  private async logPaymentAttempt(userId: string, amount: number, paymentIntentId: string): Promise<void> {
    try {
      await dbService.supabase
        .from('payment_attempts')
        .insert({
          user_id: userId,
          amount_cents: Math.round(amount * 100),
          payment_intent_id: paymentIntentId,
          status: 'pending',
          created_at: new Date()
        });
    } catch (error) {
      console.error('Error logging payment attempt:', error);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const userId = paymentIntent.metadata.userId;
      if (userId) {
        // Update payment attempt status
        await dbService.supabase
          .from('payment_attempts')
          .update({ 
            status: 'succeeded',
            updated_at: new Date()
          })
          .eq('payment_intent_id', paymentIntent.id);

        // Reset user's usage for the month
        await this.resetUserUsage(userId);
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      await dbService.supabase
        .from('payment_attempts')
        .update({ 
          status: 'failed',
          updated_at: new Date()
        })
        .eq('payment_intent_id', paymentIntent.id);
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    try {
      const customerId = subscription.customer as string;
      const planId = subscription.metadata.planId || 'starter';

      // Update user's subscription status
      await dbService.supabase
        .from('users')
        .update({ 
          subscription_plan: planId,
          subscription_status: subscription.status,
          updated_at: new Date()
        })
        .eq('stripe_customer_id', customerId);
    } catch (error) {
      console.error('Error handling subscription created:', error);
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    try {
      const customerId = subscription.customer as string;
      const planId = subscription.metadata.planId || 'starter';

      await dbService.supabase
        .from('users')
        .update({ 
          subscription_plan: planId,
          subscription_status: subscription.status,
          updated_at: new Date()
        })
        .eq('stripe_customer_id', customerId);
    } catch (error) {
      console.error('Error handling subscription updated:', error);
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    try {
      const customerId = subscription.customer as string;

      await dbService.supabase
        .from('users')
        .update({ 
          subscription_status: 'cancelled',
          updated_at: new Date()
        })
        .eq('stripe_customer_id', customerId);
    } catch (error) {
      console.error('Error handling subscription deleted:', error);
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    try {
      // Handle successful subscription renewal
      const customerId = invoice.customer as string;
      
      // Reset usage for the new billing period
      const user = await dbService.supabase
        .from('users')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (user?.data?.id) {
        await this.resetUserUsage(user.data.id);
      }
    } catch (error) {
      console.error('Error handling invoice payment succeeded:', error);
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    try {
      const customerId = invoice.customer as string;

      await dbService.supabase
        .from('users')
        .update({ 
          subscription_status: 'past_due',
          updated_at: new Date()
        })
        .eq('stripe_customer_id', customerId);
    } catch (error) {
      console.error('Error handling invoice payment failed:', error);
    }
  }

  private async resetUserUsage(userId: string): Promise<void> {
    try {
      // Reset monthly usage tracking
      await dbService.supabase
        .from('user_usage')
        .upsert({
          user_id: userId,
          monthly_usage_cents: 0,
          reset_date: new Date(),
          updated_at: new Date()
        });
    } catch (error) {
      console.error('Error resetting user usage:', error);
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService(); 