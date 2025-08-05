import React, { useEffect } from 'react';

interface PricingTableProps {
  className?: string;
}

declare global {
  interface Window {
    Stripe?: any;
  }
}

export const PricingTable: React.FC<PricingTableProps> = ({ className = '' }) => {
  useEffect(() => {
    // Load Stripe Pricing Table script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className={`pricing-table-container ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Parenting AI Plan
          </h2>
          <p className="text-lg text-gray-600">
            Get personalized AI assistance for your parenting journey
          </p>
        </div>
        
        {/* Stripe Pricing Table */}
        <stripe-pricing-table 
          pricing-table-id="prctbl_1RsYEgDBaLXa22vfMNkonnit"
          publishable-key={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_live_51RSOHIDBaLXa22vf94s5xTyNkOXLHSmzDLpctf3c0KDHm3KYz0K3BHFkVdyzd9hWKHGiePksuWXp1GUnIzuLRjFJ00MW6I9qsj"}
        />
        
        {/* Additional Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            All plans include secure payment processing via Stripe. 
            Cancel or change your plan at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingTable; 