import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, Crown, Zap, Users, Target, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeatureGate } from '@/contexts/FeatureGate';

interface UpgradePromptProps {
  feature: string;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  isOpen,
  onClose,
  onUpgrade
}) => {
  const { currentPlan } = useFeatureGate();

  if (!isOpen) return null;

  const featureInfo = {
    aiInteractions: {
      title: 'AI Interactions Limit Reached',
      description: 'You\'ve used all your AI interactions for this month.',
      icon: <Zap className="w-6 h-6" />,
      starterLimit: '50 interactions/month',
      proBenefit: 'Unlimited AI interactions'
    },
    roadmapsPerChild: {
      title: 'Roadmap Limit Reached',
      description: 'You\'ve created the maximum number of roadmaps for your plan.',
      icon: <Target className="w-6 h-6" />,
      starterLimit: '2 roadmaps per child',
      proBenefit: 'Unlimited roadmaps'
    },
    childrenProfiles: {
      title: 'Children Profiles Limit Reached',
      description: 'You\'ve reached the maximum number of children profiles.',
      icon: <Users className="w-6 h-6" />,
      starterLimit: '2 children profiles',
      proBenefit: 'Unlimited children profiles'
    },
    prioritySupport: {
      title: 'Priority Support',
      description: 'This feature is only available with Pro plan.',
      icon: <MessageSquare className="w-6 h-6" />,
      starterLimit: 'Standard support',
      proBenefit: 'Priority support with faster response times'
    }
  };

  const info = featureInfo[feature as keyof typeof featureInfo] || {
    title: 'Feature Limit Reached',
    description: 'This feature is limited in your current plan.',
    icon: <Crown className="w-6 h-6" />,
    starterLimit: 'Limited access',
    proBenefit: 'Full access'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-indigo-600 rounded-lg flex items-center justify-center">
              {info.icon}
            </div>
          </div>
          <CardTitle className="text-xl">{info.title}</CardTitle>
          <CardDescription>{info.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Current Plan</span>
              <Badge variant="secondary">{currentPlan?.toUpperCase()}</Badge>
            </div>
            <p className="text-sm text-gray-600">{info.starterLimit}</p>
          </div>

          {/* Pro Benefits */}
          <div className="bg-gradient-to-r from-brand-primary to-indigo-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Pro Plan Benefits</span>
              <Crown className="w-5 h-5" />
            </div>
            <ul className="text-sm space-y-1">
              <li>• {info.proBenefit}</li>
              <li>• Unlimited AI interactions</li>
              <li>• Priority support</li>
              <li>• Custom coaching sessions</li>
              <li>• Advanced analytics</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Link to="/pricing" className="flex-1">
              <Button 
                onClick={onUpgrade}
                className="w-full bg-brand-primary hover:bg-indigo-700"
              >
                Upgrade to Pro
              </Button>
            </Link>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpgradePrompt;
