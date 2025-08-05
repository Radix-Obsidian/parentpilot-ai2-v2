import React from 'react';
import PricingTable from '../components/PricingTable';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                ParentPilot.AI
              </h1>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-500 hover:text-gray-900">
                Home
              </a>
              <a href="/features" className="text-gray-500 hover:text-gray-900">
                Features
              </a>
              <a href="/pricing" className="text-blue-600 font-medium">
                Pricing
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Choose the perfect plan for your parenting needs. All plans include our advanced AI assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">AI-Powered Insights</h3>
              <p className="mt-2 text-base text-gray-500">
                Get personalized recommendations and insights based on your child's development.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">24/7 Support</h3>
              <p className="mt-2 text-base text-gray-500">
                Access parenting guidance whenever you need it, day or night.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Expert Guidance</h3>
              <p className="mt-2 text-base text-gray-500">
                Based on child development research and expert parenting advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <PricingTable />

      {/* FAQ Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Can I cancel my subscription at any time?
                </h3>
                <p className="mt-2 text-gray-500">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  What payment methods do you accept?
                </h3>
                <p className="mt-2 text-gray-500">
                  We accept all major credit cards, debit cards, and digital wallets through our secure Stripe payment processing.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Is my payment information secure?
                </h3>
                <p className="mt-2 text-gray-500">
                  Absolutely. We use Stripe for payment processing, which is PCI DSS compliant and handles all sensitive payment data securely.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="mt-2 text-gray-500">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Do you offer refunds?
                </h3>
                <p className="mt-2 text-gray-500">
                  We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Parenting?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of parents who trust ParentPilot.AI for guidance.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="#pricing"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/contact"
                className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ParentPilot.AI. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <a href="/privacy" className="hover:text-white">Privacy Policy</a>
              <a href="/terms" className="hover:text-white">Terms of Service</a>
              <a href="/support" className="hover:text-white">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing; 