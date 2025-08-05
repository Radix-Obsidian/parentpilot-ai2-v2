import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  FileText, 
  Scale, 
  Users, 
  CreditCard, 
  Shield,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-indigo-600 bg-clip-text text-transparent">
              ParentPilot.AI
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-gray-600 hover:text-brand-primary">
                Dashboard
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-brand-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Key Points Summary */}
          <Card className="mb-8 border-l-4 border-l-brand-primary">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Terms Summary</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Scale className="w-8 h-8 text-brand-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Fair Use</h3>
                  <p className="text-sm text-gray-600">Use our service responsibly and within intended purposes</p>
                </div>
                <div className="text-center">
                  <CreditCard className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Flexible Billing</h3>
                  <p className="text-sm text-gray-600">Cancel anytime with no penalties or hidden fees</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Your Data</h3>
                  <p className="text-sm text-gray-600">You retain ownership of all content you create</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                
                <p className="text-gray-600 mb-4">
                  By accessing or using ParentPilot.AI ("the Service"), you agree to be bound by these Terms of Service 
                  ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
                </p>

                <p className="text-gray-600 mb-4">
                  These Terms apply to all visitors, users, and others who access or use the Service. 
                  We reserve the right to update these Terms at any time, and we will notify you of material changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                
                <p className="text-gray-600 mb-4">
                  ParentPilot.AI is an AI-powered parenting platform that provides:
                </p>
                
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Personalized child development roadmaps</li>
                  <li>Progress tracking and milestone recording</li>
                  <li>Weekly progress digests and insights</li>
                  <li>Enrichment activity recommendations</li>
                  <li>Educational resources and guidance</li>
                </ul>

                <p className="text-gray-600 mb-4">
                  Our Service is designed to support parents and guardians in their children's development journey. 
                  It is not a substitute for professional medical, educational, or psychological advice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Creation</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for safeguarding your account credentials</li>
                  <li>You must be at least 18 years old to create an account</li>
                  <li>One account per user; sharing accounts is not permitted</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Responsibilities</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Maintain the security and confidentiality of your login credentials</li>
                  <li>Notify us immediately of any unauthorized access to your account</li>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>Keep your contact information up to date</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Permitted Use</h3>
                <p className="text-gray-600 mb-4">You may use our Service to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Create and manage development plans for your children</li>
                  <li>Track progress and log activities</li>
                  <li>Access AI-generated recommendations and insights</li>
                  <li>Export your data for personal use</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Use</h3>
                <p className="text-gray-600 mb-4">You may not:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Transmit any harmful, threatening, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Create false or misleading profiles</li>
                  <li>Use the Service to harm, abuse, or monitor children</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription Plans and Billing</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Plan Options</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li><strong>Starter Plan:</strong> $19/month - Up to 2 child profiles with basic features</li>
                  <li><strong>Pro Plan:</strong> $49/month - Unlimited profiles with advanced features</li>
                  <li><strong>Free Trial:</strong> 14-day access to Starter plan features</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Billing Terms</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Subscriptions are billed monthly in advance</li>
                  <li>Billing begins immediately after your free trial ends</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>We may change pricing with 30 days' notice</li>
                  <li>Failed payments may result in service suspension</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cancellation</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>You may cancel your subscription at any time</li>
                  <li>Cancellation takes effect at the end of your current billing period</li>
                  <li>No refunds for partial months</li>
                  <li>Your data remains accessible until the end of your paid period</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content and Intellectual Property</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Content</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>You retain ownership of all content you upload or create</li>
                  <li>You grant us license to use your content to provide the Service</li>
                  <li>You are responsible for ensuring you have rights to uploaded content</li>
                  <li>You can delete your content or account at any time</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Content</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>ParentPilot.AI and our platform are protected by intellectual property laws</li>
                  <li>AI-generated roadmaps and recommendations are provided for your personal use</li>
                  <li>You may not redistribute or commercialize our content</li>
                  <li>Our trademarks and logos may not be used without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. AI Services and Limitations</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI-Generated Content</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>AI recommendations are suggestions, not professional advice</li>
                  <li>Results may vary and are not guaranteed</li>
                  <li>Always use your judgment and consult professionals when needed</li>
                  <li>AI systems may have biases or limitations</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">No Professional Advice</h3>
                <p className="text-gray-600 mb-4">
                  Our Service does not provide medical, educational, psychological, or legal advice. 
                  Always consult qualified professionals for specific concerns about your child's development, 
                  health, education, or well-being.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
                
                <p className="text-gray-600 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which explains how we 
                  collect, use, and protect your information. By using our Service, you agree to our Privacy Policy.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Security</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>We implement industry-standard security measures</li>
                  <li>Your data is encrypted in transit and at rest</li>
                  <li>We conduct regular security audits and updates</li>
                  <li>You can export or delete your data at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitations of Liability</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Disclaimers</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>The Service is provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee uninterrupted or error-free service</li>
                  <li>We may suspend or modify the Service for maintenance or updates</li>
                  <li>Third-party integrations may have their own terms and limitations</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                <p className="text-gray-600 mb-4">
                  To the maximum extent permitted by law, ParentPilot.AI shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including without limitation, loss of 
                  profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Termination by You</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>You may terminate your account at any time</li>
                  <li>Cancellation can be done through your account settings</li>
                  <li>You remain responsible for any charges incurred before termination</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Termination by Us</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>We may terminate accounts for violation of these Terms</li>
                  <li>We may suspend service for non-payment</li>
                  <li>We will provide reasonable notice when possible</li>
                  <li>Upon termination, your right to use the Service ceases immediately</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Disputes</h2>
                
                <p className="text-gray-600 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                  without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service 
                  shall be resolved through binding arbitration in San Francisco, California.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
                
                <p className="text-gray-600 mb-4">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes 
                  via email or through the Service. Your continued use of the Service after such modifications 
                  constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@parentpilot.ai</p>
                  <p className="text-gray-700 mb-2"><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94105</p>
                  <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contact Legal Team
                </Button>
              </Link>
              <Link to="/privacy">
                <Button variant="outline" size="lg">
                  View Privacy Policy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
