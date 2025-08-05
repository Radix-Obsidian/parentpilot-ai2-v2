import { dbService } from '../database/config';
import { ReferralProgram, ReferralReward, ReferralTier, ReferralInvitation, ReferralAnalytics } from '../database/types';
import { v4 as uuidv4 } from 'uuid';

export class ReferralService {
  private tiers: ReferralTier[] = [
    {
      id: 'bronze',
      name: 'Bronze Referrer',
      requiredReferrals: 3,
      rewards: {
        freeDays: 15,
        description: '15 days free for 3 successful referrals'
      }
    },
    {
      id: 'silver',
      name: 'Silver Referrer',
      requiredReferrals: 5,
      rewards: {
        freeDays: 30,
        description: '30 days free for 5 successful referrals'
      }
    },
    {
      id: 'gold',
      name: 'Gold Referrer',
      requiredReferrals: 10,
      rewards: {
        freeDays: 60,
        planUpgrade: 'pro',
        description: '60 days free + Pro plan upgrade for 10 successful referrals'
      }
    },
    {
      id: 'platinum',
      name: 'Platinum Referrer',
      requiredReferrals: 20,
      rewards: {
        freeDays: 90,
        planUpgrade: 'pro',
        features: ['priority_support', 'custom_coaching'],
        description: '90 days free + Pro plan + Priority features for 20 successful referrals'
      }
    }
  ];

  async createReferralProgram(userId: string): Promise<ReferralProgram> {
    const referralCode = this.generateReferralCode();
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    
    const referralProgram: ReferralProgram = {
      id: uuidv4(),
      userId,
      referralCode,
      status: 'active',
      createdAt: new Date(),
      expiresAt,
      totalReferrals: 0,
      successfulReferrals: 0,
      currentTier: this.tiers[0],
      rewardsEarned: []
    };

    await dbService.from('referral_programs').insert(referralProgram);
    return referralProgram;
  }

  async getReferralProgram(userId: string): Promise<ReferralProgram | null> {
    const { data, error } = await dbService
      .from('referral_programs')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      currentTier: this.getTierByReferrals(data.successfulReferrals),
      rewardsEarned: await this.getRewardsForProgram(data.id)
    };
  }

  async sendInvitation(referrerId: string, email: string, name?: string): Promise<ReferralInvitation> {
    const invitation: ReferralInvitation = {
      id: uuidv4(),
      referrerId,
      email,
      name,
      status: 'sent',
      sentAt: new Date(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    };

    await dbService.from('referral_invitations').insert(invitation);
    await this.sendInvitationEmail(invitation);
    return invitation;
  }

  async processSuccessfulReferral(referralCode: string, newUserId: string): Promise<void> {
    const { data: referralProgram } = await dbService
      .from('referral_programs')
      .select('*')
      .eq('referralCode', referralCode)
      .single();

    if (!referralProgram) return;

    await dbService
      .from('referral_programs')
      .update({
        totalReferrals: referralProgram.totalReferrals + 1,
        successfulReferrals: referralProgram.successfulReferrals + 1
      })
      .eq('id', referralProgram.id);

    const newTier = this.getTierByReferrals(referralProgram.successfulReferrals + 1);
    const currentTier = this.getTierByReferrals(referralProgram.successfulReferrals);

    if (newTier.id !== currentTier.id) {
      await this.grantReward(referralProgram.id, newTier);
    }

    await this.grantNewUserReward(newUserId);
  }

  async grantReward(referralProgramId: string, tier: ReferralTier): Promise<ReferralReward> {
    const reward: ReferralReward = {
      id: uuidv4(),
      referralProgramId,
      tier,
      type: 'free_days',
      value: tier.rewards.freeDays,
      description: tier.description,
      earnedAt: new Date(),
      status: 'pending'
    };

    await dbService.from('referral_rewards').insert(reward);
    await this.applyRewardToSubscription(referralProgramId, reward);
    return reward;
  }

  async grantNewUserReward(userId: string): Promise<ReferralReward> {
    const reward: ReferralReward = {
      id: uuidv4(),
      referralProgramId: 'new_user',
      tier: { id: 'new_user', name: 'New User', requiredReferrals: 0, rewards: { freeDays: 30 }, description: '30 days free for signing up via referral' },
      type: 'free_days',
      value: 30,
      description: '30 days free for signing up via referral',
      earnedAt: new Date(),
      status: 'pending'
    };

    await dbService.from('referral_rewards').insert(reward);
    await this.applyRewardToSubscription('new_user', reward);
    return reward;
  }

  async getAnalytics(userId: string): Promise<ReferralAnalytics> {
    const { data: invitations } = await dbService
      .from('referral_invitations')
      .select('*')
      .eq('referrerId', userId);

    const { data: rewards } = await dbService
      .from('referral_rewards')
      .select('*')
      .eq('referralProgramId', userId);

    const totalInvites = invitations?.length || 0;
    const totalSignups = invitations?.filter(i => i.status === 'signed_up').length || 0;
    const conversionRate = totalInvites > 0 ? (totalSignups / totalInvites) * 100 : 0;

    return {
      userId,
      totalInvites,
      totalSignups,
      conversionRate,
      averageTimeToSignup: 0,
      topReferringChannels: ['email'],
      rewardsEarned: rewards?.length || 0,
      revenueGenerated: 0
    };
  }

  private generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private getTierByReferrals(referralCount: number): ReferralTier {
    return this.tiers
      .filter(tier => tier.requiredReferrals <= referralCount)
      .sort((a, b) => b.requiredReferrals - a.requiredReferrals)[0] || this.tiers[0];
  }

  private async getRewardsForProgram(programId: string): Promise<ReferralReward[]> {
    const { data } = await dbService
      .from('referral_rewards')
      .select('*')
      .eq('referralProgramId', programId);
    return data || [];
  }

  private async sendInvitationEmail(invitation: ReferralInvitation): Promise<void> {
    console.log(`Sending invitation email to ${invitation.email}`);
  }

  private async applyRewardToSubscription(programId: string, reward: ReferralReward): Promise<void> {
    console.log(`Applying reward: ${reward.description}`);
  }
}

export const referralService = new ReferralService();
