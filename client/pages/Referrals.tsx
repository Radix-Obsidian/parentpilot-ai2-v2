import React from 'react';
import ReferralDashboard from '../components/ReferralDashboard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';

const ReferralsPage: React.FC = () => {
  const shareText = "I just discovered ParentPilot.AI - an amazing AI-powered parenting assistant! Get 30 days free when you sign up with my referral link. Perfect for busy parents who need personalized advice and support. 🚀 #Parenting #AI #ParentPilot";

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
    email: `mailto:?subject=Check out ParentPilot.AI&body=${encodeURIComponent(shareText + '\n\n' + window.location.origin)}`,
    sms: `sms:?body=${encodeURIComponent(shareText + '\n\n' + window.location.origin)}`
  };

  const handleShare = (platform: string) => {
    const url = shareLinks[platform as keyof typeof shareLinks];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Invite Friends, Earn Rewards! 🎁
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Share ParentPilot.AI with other parents and both of you get amazing rewards. 
            The more friends you invite, the more you earn!
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">3+</div>
              <div className="text-sm opacity-90">Referrals = 15 days free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">5+</div>
              <div className="text-sm opacity-90">Referrals = 30 days free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">10+</div>
              <div className="text-sm opacity-90">Referrals = 60 days + Pro plan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm opacity-90">Referrals = 90 days + Priority features</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
            <CardDescription>
              Simple steps to earn rewards with your friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold mb-2">Share Your Link</h3>
                <p className="text-gray-600 text-sm">
                  Copy your unique referral link and share it with friends
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold mb-2">Friends Sign Up</h3>
                <p className="text-gray-600 text-sm">
                  Your friends sign up using your link within 14 days
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold mb-2">Both Get Rewards</h3>
                <p className="text-gray-600 text-sm">
                  You both get free days and unlock tier rewards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share ParentPilot.AI
            </CardTitle>
            <CardDescription>
              Spread the word and help other parents discover AI-powered parenting support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button
                onClick={() => handleShare('facebook')}
                className="bg-blue-600 hover:bg-blue-700"
                variant="default"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                onClick={() => handleShare('twitter')}
                className="bg-sky-500 hover:bg-sky-600"
                variant="default"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={() => handleShare('linkedin')}
                className="bg-blue-700 hover:bg-blue-800"
                variant="default"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                onClick={() => handleShare('email')}
                className="bg-gray-600 hover:bg-gray-700"
                variant="default"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                onClick={() => handleShare('sms')}
                className="bg-green-600 hover:bg-green-700"
                variant="default"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                SMS
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referral Dashboard */}
        <ReferralDashboard />

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How long do I have to invite friends?</h3>
                <p className="text-gray-600">
                  Your referral program is active for 90 days. Friends have 14 days to sign up after receiving your invitation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What rewards do my friends get?</h3>
                <p className="text-gray-600">
                  Your friends get 30 days free when they sign up using your referral link, regardless of which plan they choose.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I earn multiple rewards?</h3>
                <p className="text-gray-600">
                  Yes! You can earn multiple tier rewards. Each tier builds on the previous one, so you get cumulative benefits.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">When do I receive my rewards?</h3>
                <p className="text-gray-600">
                  Rewards are automatically applied to your account when you reach each tier. You'll receive an email notification.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I track my referral progress?</h3>
                <p className="text-gray-600">
                  Yes! Your referral dashboard shows real-time progress, analytics, and upcoming rewards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralsPage;
