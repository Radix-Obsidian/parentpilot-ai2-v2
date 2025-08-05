import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

export default function PrivacyPolicy() {
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
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Privacy Summary */}
          <Card className="mb-8 border-l-4 border-l-brand-primary">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Privacy at a Glance</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-brand-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Secure by Design</h3>
                  <p className="text-sm text-gray-600">Enterprise-grade encryption protects all your family data</p>
                </div>
                <div className="text-center">
                  <UserCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">Your Control</h3>
                  <p className="text-sm text-gray-600">You own your data and can export or delete it anytime</p>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900">No Third Parties</h3>
                  <p className="text-sm text-gray-600">We never sell or share your personal information</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <p className="text-gray-600 mb-4">
                  When you create an account, we collect information such as your name, email address, and billing information. 
                  This information is necessary to provide you with our services and communicate with you about your account.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Child Profile Information</h3>
                <p className="text-gray-600 mb-4">
                  To create personalized development roadmaps, we collect information about your children including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Name, age, and grade level</li>
                  <li>Interests, strengths, and learning preferences</li>
                  <li>Activities and milestones you choose to track</li>
                  <li>Photos you voluntarily upload for profiles</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
                <p className="text-gray-600 mb-4">
                  We automatically collect certain information when you use our service, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Device information and browser type</li>
                  <li>IP address and general location</li>
                  <li>Pages visited and features used</li>
                  <li>Time and duration of your visits</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Provision</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Generate personalized AI-powered development roadmaps</li>
                  <li>Create weekly progress digests and insights</li>
                  <li>Provide enrichment recommendations tailored to your children</li>
                  <li>Enable progress tracking and milestone recording</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Send important account and service updates</li>
                  <li>Respond to your support requests and inquiries</li>
                  <li>Deliver optional educational content and tips (with your consent)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Improvement</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Analyze usage patterns to improve our AI recommendations</li>
                  <li>Develop new features and enhance existing ones</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                  <p className="text-emerald-800 font-semibold">
                    We do not sell, trade, or otherwise transfer your personal information to third parties.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Limited Sharing</h3>
                <p className="text-gray-600 mb-4">We may share your information only in these specific circumstances:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (hosting, payment processing, customer support)</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to you)</li>
                  <li><strong>With Your Consent:</strong> Any other sharing will only occur with your explicit permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Safeguards</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>End-to-end encryption for all data transmission</li>
                  <li>Encrypted data storage with regular security audits</li>
                  <li>Secure authentication and session management</li>
                  <li>Regular security updates and vulnerability assessments</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Controls</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Strict employee access controls with background checks</li>
                  <li>Multi-factor authentication for administrative access</li>
                  <li>Regular access reviews and permissions auditing</li>
                  <li>Secure development practices and code reviews</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Access and Control</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li><strong>Access:</strong> View and download all your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Export your data in a common format</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication Preferences</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Opt out of promotional emails while keeping essential notifications</li>
                  <li>Choose frequency and types of educational content</li>
                  <li>Manage push notification preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Children's Privacy</h2>
                
                <p className="text-gray-600 mb-4">
                  ParentPilot.AI is designed for parents and guardians to track their children's development. 
                  We do not knowingly collect personal information directly from children under 13.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Parental Control</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li>Parents maintain full control over their children's profile information</li>
                  <li>Child data is only used to provide services to the parent/guardian</li>
                  <li>Parents can update or delete child information at any time</li>
                  <li>We follow COPPA guidelines for protecting children's privacy</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                
                <p className="text-gray-600 mb-4">
                  We retain your information for as long as your account is active or as needed to provide services. 
                  You can request deletion of your account and data at any time.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Retention Periods</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4">
                  <li><strong>Active Accounts:</strong> Data retained while account is active</li>
                  <li><strong>Inactive Accounts:</strong> Data may be retained for up to 2 years for reactivation</li>
                  <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days (some may be retained for legal compliance)</li>
                  <li><strong>Billing Records:</strong> Retained for 7 years as required by law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
                
                <p className="text-gray-600 mb-4">
                  Your information may be processed and stored in the United States and other countries where our 
                  service providers operate. We ensure appropriate safeguards are in place for international transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Updates to This Policy</h2>
                
                <p className="text-gray-600 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes 
                  via email or through our service. Your continued use of our service after such modifications 
                  constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@parentpilot.ai</p>
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
                  Contact Privacy Team
                </Button>
              </Link>
              <Link to="/terms">
                <Button variant="outline" size="lg">
                  View Terms of Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
