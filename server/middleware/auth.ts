import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // For demo purposes, create a mock user
    // In production, you'd validate JWT tokens here
    req.user = {
      id: 'demo-user-' + Date.now(),
      email: 'demo@example.com',
      name: 'Demo User'
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
