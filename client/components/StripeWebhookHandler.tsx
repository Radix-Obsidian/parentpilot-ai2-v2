import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface StripeWebhookHandlerProps {
  onPaymentSuccess?: (data: any) => void;
  onPaymentFailure?: (error: any) => void;
  onSubscriptionCreated?: (data: any) => void;
  onSubscriptionUpdated?: (data: any) => void;
}

export const StripeWebhookHandler: React.FC<StripeWebhookHandlerProps> = ({
  onPaymentSuccess,
  onPaymentFailure,
  onSubscriptionCreated,
  onSubscriptionUpdated
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for Stripe events
    const handleStripeEvent = (event: MessageEvent) => {
      if (event.data && event.data.type === 'stripe-payment-success') {
        console.log('Payment successful:', event.data);
        
        // Update user subscription status
        updateUserSubscription(event.data);
        
        // Call success callback
        onPaymentSuccess?.(event.data);
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
      
      if (event.data && event.data.type === 'stripe-payment-failed') {
        console.error('Payment failed:', event.data);
        
        // Call failure callback
        onPaymentFailure?.(event.data);
        
        // Show error message
        showPaymentError(event.data.error);
      }
      
      if (event.data && event.data.type === 'stripe-subscription-created') {
        console.log('Subscription created:', event.data);
        onSubscriptionCreated?.(event.data);
      }
      
      if (event.data && event.data.type === 'stripe-subscription-updated') {
        console.log('Subscription updated:', event.data);
        onSubscriptionUpdated?.(event.data);
      }
    };

    // Add event listener
    window.addEventListener('message', handleStripeEvent);

    return () => {
      window.removeEventListener('message', handleStripeEvent);
    };
  }, [navigate, onPaymentSuccess, onPaymentFailure, onSubscriptionCreated, onSubscriptionUpdated]);

  const updateUserSubscription = async (paymentData: any) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'payment_intent.succeeded',
          data: {
            object: paymentData
          }
        })
      });

      if (!response.ok) {
        console.error('Failed to update subscription status');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const showPaymentError = (error: any) => {
    // You can implement a toast notification here
    alert(`Payment failed: ${error.message || 'Unknown error'}`);
  };

  return null; // This component doesn't render anything
};

export default StripeWebhookHandler; 