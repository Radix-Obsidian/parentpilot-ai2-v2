import express from 'express';
import { referralService } from '../services/referral-service';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.get('/program', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const program = await referralService.getReferralProgram(userId);
    
    if (!program) {
      const newProgram = await referralService.createReferralProgram(userId);
      return res.json(newProgram);
    }

    res.json(program);
  } catch (error) {
    console.error('Error getting referral program:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/invite', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { email, name } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const invitation = await referralService.sendInvitation(userId, email, name);
    
    res.json({
      success: true,
      invitation,
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/process', async (req, res) => {
  try {
    const { referralCode, userId } = req.body;

    if (!referralCode || !userId) {
      return res.status(400).json({ error: 'Referral code and user ID are required' });
    }

    await referralService.processSuccessfulReferral(referralCode, userId);
    
    res.json({
      success: true,
      message: 'Referral processed successfully'
    });
  } catch (error) {
    console.error('Error processing referral:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/analytics', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const analytics = await referralService.getAnalytics(userId);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/rewards', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const program = await referralService.getReferralProgram(userId);
    
    if (!program) {
      return res.json({ rewards: [] });
    }

    res.json({
      rewards: program.rewardsEarned,
      currentTier: program.currentTier
    });
  } catch (error) {
    console.error('Error getting rewards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/claim-reward', authenticateUser, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { rewardId } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!rewardId) {
      return res.status(400).json({ error: 'Reward ID is required' });
    }

    res.json({
      success: true,
      message: 'Reward claimed successfully'
    });
  } catch (error) {
    console.error('Error claiming reward:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tiers', async (req, res) => {
  try {
    const tiers = [
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

    res.json(tiers);
  } catch (error) {
    console.error('Error getting tiers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
