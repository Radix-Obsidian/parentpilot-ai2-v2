import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Share2, Users, Gift, Trophy, Mail, Copy, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface ReferralProgram {
  id: string;
  userId: string;
  referralCode: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  totalReferrals: number;
  successfulReferrals: number;
  currentTier: ReferralTier;
  rewardsEarned: ReferralReward[];
}

interface ReferralTier {
  id: string;
  name: string;
  requiredReferrals: number;
  rewards: {
    freeDays: number;
    planUpgrade?: 'pro';
    features?: string[];
  };
  description: string;
}

interface ReferralReward {
  id: string;
  referralProgramId: string;
  tier: ReferralTier;
  type: 'free_days' | 'plan_upgrade' | 'feature_access';
  value: number;
  description: string;
  earnedAt: Date;
  claimedAt?: Date;
  status: 'pending' | 'claimed' | 'expired';
}

interface ReferralAnalytics {
  userId: string;
  totalInvites: number;
  totalSignups: number;
  conversionRate: number;
  averageTimeToSignup: number;
  topReferringChannels: string[];
  rewardsEarned: number;
  revenueGenerated: number;
}

export const ReferralDashboard: React.FC = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const queryClient = useQueryClient();

  // Fetch referral program data
  const { data: program, isLoading: programLoading } = useQuery({
    queryKey: ['referral-program'],
    queryFn: async () => {
      const response = await fetch('/api/referrals/program');
      if (!response.ok) throw new Error('Failed to fetch referral program');
      return response.json() as Promise<ReferralProgram>;
    }
  });

  // Fetch analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['referral-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/referrals/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json() as Promise<ReferralAnalytics>;
    }
  });

  // Fetch tiers
  const { data: tiers } = useQuery({
    queryKey: ['referral-tiers'],
    queryFn: async () => {
      const response = await fetch('/api/referrals/tiers');
      if (!response.ok) throw new Error('Failed to fetch tiers');
      return response.json() as Promise<ReferralTier[]>;
    }
  });

  // Send invitation mutation
  const sendInvitation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name?: string }) => {
      const response = await fetch('/api/referrals/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      if (!response.ok) throw new Error('Failed to send invitation');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully!');
      setInviteEmail('');
      setInviteName('');
      queryClient.invalidateQueries({ queryKey: ['referral-analytics'] });
    },
    onError: () => {
      toast.error('Failed to send invitation');
    }
  });

  // Copy referral link
  const copyReferralLink = () => {
    if (program?.referralCode) {
      const link = `${window.location.origin}/signup?ref=${program.referralCode}`;
      navigator.clipboard.writeText(link);
      toast.success('Referral link copied to clipboard!');
    }
  };

  if (programLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const nextTier = tiers?.find(tier => tier.requiredReferrals > (program?.successfulReferrals || 0));
  const progressToNextTier = nextTier 
    ? ((program?.successfulReferrals || 0) / nextTier.requiredReferrals) * 100 
    : 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Program</h1>
        <p className="text-gray-600">Invite friends and earn rewards together!</p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {program?.currentTier.name}
          </CardTitle>
          <CardDescription>
            {program?.successfulReferrals} successful referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress to next tier */}
            {nextTier && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to {nextTier.name}</span>
                  <span>{program?.successfulReferrals || 0} / {nextTier.requiredReferrals}</span>
                </div>
                <Progress value={progressToNextTier} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {nextTier.requiredReferrals - (program?.successfulReferrals || 0)} more referrals needed
                </p>
              </div>
            )}

            {/* Referral Code */}
            <div className="flex items-center gap-2">
              <Input
                value={program?.referralCode ? `${window.location.origin}/signup?ref=${program.referralCode}` : ''}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyReferralLink} size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Send Invitation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Send Invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                placeholder="Friend's email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                type="email"
              />
              <Input
                placeholder="Friend's name (optional)"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
              <Button 
                onClick={() => sendInvitation.mutate({ email: inviteEmail, name: inviteName })}
                disabled={!inviteEmail || sendInvitation.isPending}
                className="w-full"
              >
                {sendInvitation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Invites:</span>
                <span className="font-semibold">{analytics?.totalInvites || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Successful Signups:</span>
                <span className="font-semibold">{analytics?.totalSignups || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-semibold">{analytics?.conversionRate?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>Rewards Earned:</span>
                <span className="font-semibold">{analytics?.rewardsEarned || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Earned */}
      {program?.rewardsEarned && program.rewardsEarned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-500" />
              Rewards Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {program.rewardsEarned.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{reward.description}</p>
                    <p className="text-sm text-gray-500">
                      Earned {new Date(reward.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={reward.status === 'claimed' ? 'default' : 'secondary'}>
                    {reward.status === 'claimed' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {reward.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tier Rewards */}
      {tiers && (
        <Card>
          <CardHeader>
            <CardTitle>Available Tiers</CardTitle>
            <CardDescription>Earn rewards as you refer more friends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tiers.map((tier) => {
                const isCurrentTier = program?.currentTier.id === tier.id;
                const isAchieved = (program?.successfulReferrals || 0) >= tier.requiredReferrals;
                
                return (
                  <div
                    key={tier.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCurrentTier ? 'border-blue-500 bg-blue-50' :
                      isAchieved ? 'border-green-500 bg-green-50' :
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <h3 className="font-semibold">{tier.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {tier.requiredReferrals} referrals
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>• {tier.rewards.freeDays} days free</p>
                        {tier.rewards.planUpgrade && (
                          <p>• Pro plan upgrade</p>
                        )}
                        {tier.rewards.features?.map(feature => (
                          <p key={feature}>• {feature.replace('_', ' ')}</p>
                        ))}
                      </div>
                      {isCurrentTier && (
                        <Badge className="mt-2" variant="default">Current</Badge>
                      )}
                      {isAchieved && !isCurrentTier && (
                        <Badge className="mt-2" variant="secondary">Achieved</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferralDashboard;
