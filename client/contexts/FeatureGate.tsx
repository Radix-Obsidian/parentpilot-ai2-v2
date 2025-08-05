import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FeatureLimits {
  aiInteractions: number;
  roadmapsPerChild: number;
  childrenProfiles: number;
  weeklyDigests: boolean;
  prioritySupport: boolean;
  customCoaching: boolean;
  referralRewards: boolean;
}

interface PlanLimits {
  starter: FeatureLimits;
  pro: FeatureLimits;
}

const PLAN_LIMITS: PlanLimits = {
  starter: {
    aiInteractions: 50,
    roadmapsPerChild: 2,
    childrenProfiles: 2,
    weeklyDigests: true,
    prioritySupport: false,
    customCoaching: false,
    referralRewards: true,
  },
  pro: {
    aiInteractions: -1, // Unlimited
    roadmapsPerChild: -1, // Unlimited
    childrenProfiles: -1, // Unlimited
    weeklyDigests: true,
    prioritySupport: true,
    customCoaching: true,
    referralRewards: true,
  },
};

interface FeatureGateContextType {
  canAccess: (feature: keyof FeatureLimits) => boolean;
  getRemainingUsage: (feature: keyof FeatureLimits) => number;
  isFeatureAvailable: (feature: keyof FeatureLimits) => boolean;
  showUpgradePrompt: (feature: keyof FeatureLimits) => void;
  currentPlan: 'starter' | 'pro' | null;
  isTrialActive: boolean;
}

const FeatureGateContext = createContext<FeatureGateContextType | undefined>(undefined);

export const useFeatureGate = () => {
  const context = useContext(FeatureGateContext);
  if (context === undefined) {
    throw new Error('useFeatureGate must be used within a FeatureGateProvider');
  }
  return context;
};

interface FeatureGateProviderProps {
  children: ReactNode;
}

export const FeatureGateProvider: React.FC<FeatureGateProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const currentPlan = user?.subscription?.plan || null;
  const isTrialActive = user?.subscription?.status === 'trial';

  const getRemainingUsage = (feature: keyof FeatureLimits): number => {
    if (!currentPlan) return 0;
    
    const limit = PLAN_LIMITS[currentPlan][feature];
    if (limit === -1) return -1; // Unlimited
    
    // In a real app, you'd fetch actual usage from your backend
    const currentUsage = localStorage.getItem(`usage_${feature}`) || '0';
    return Math.max(0, limit - parseInt(currentUsage));
  };

  const canAccess = (feature: keyof FeatureLimits): boolean => {
    if (!currentPlan) return false;
    
    const limit = PLAN_LIMITS[currentPlan][feature];
    if (limit === -1) return true; // Unlimited features
    
    const remaining = getRemainingUsage(feature);
    return remaining > 0;
  };

  const isFeatureAvailable = (feature: keyof FeatureLimits): boolean => {
    if (!currentPlan) return false;
    return PLAN_LIMITS[currentPlan][feature] !== 0;
  };

  const showUpgradePrompt = (feature: keyof FeatureLimits) => {
    const featureNames = {
      aiInteractions: 'AI Interactions',
      roadmapsPerChild: 'Roadmaps per Child',
      childrenProfiles: 'Children Profiles',
      weeklyDigests: 'Weekly Digests',
      prioritySupport: 'Priority Support',
      customCoaching: 'Custom Coaching',
      referralRewards: 'Referral Rewards',
    };

    const message = currentPlan === 'starter' 
      ? `Upgrade to Pro to unlock unlimited ${featureNames[feature]}!`
      : `This feature is not available in your current plan.`;

    // In a real app, you'd show a modal or toast
    alert(message);
  };

  const value: FeatureGateContextType = {
    canAccess,
    getRemainingUsage,
    isFeatureAvailable,
    showUpgradePrompt,
    currentPlan,
    isTrialActive,
  };

  return (
    <FeatureGateContext.Provider value={value}>
      {children}
    </FeatureGateContext.Provider>
  );
};
