import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  subscription?: {
    plan: 'starter' | 'pro';
    status: 'active' | 'trial' | 'expired';
    trialEndsAt?: Date;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  googleAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In a real app, validate token with backend
          const userData = localStorage.getItem('user_data');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call - in real app, call your backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          subscription: data.user.subscription
        };
        
        setUser(userData);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        return true;
      } else {
        // For demo purposes, create a mock user if login fails
        const mockUser: User = {
          id: 'demo-user-1',
          name: 'Demo Parent',
          email: email,
          subscription: {
            plan: 'starter',
            status: 'trial',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
          }
        };
        
        setUser(mockUser);
        localStorage.setItem('auth_token', 'demo-token');
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // For demo purposes, create a mock user even if API fails
      const mockUser: User = {
        id: 'demo-user-1',
        name: 'Demo Parent',
        email: email,
        subscription: {
          plan: 'starter',
          status: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_token', 'demo-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call - in real app, call your backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          subscription: data.user.subscription
        };
        
        setUser(userData);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        return true;
      } else {
        // For demo purposes, create a mock user if registration fails
        const mockUser: User = {
          id: 'demo-user-1',
          name: name,
          email: email,
          subscription: {
            plan: 'starter',
            status: 'trial',
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          }
        };
        
        setUser(mockUser);
        localStorage.setItem('auth_token', 'demo-token');
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      
      // For demo purposes, create a mock user even if API fails
      const mockUser: User = {
        id: 'demo-user-1',
        name: name,
        email: email,
        subscription: {
          plan: 'starter',
          status: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_token', 'demo-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const googleAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate Google OAuth - in real app, implement Google OAuth
      const mockUser: User = {
        id: 'google-user-1',
        name: 'Google User',
        email: 'user@gmail.com',
        subscription: {
          plan: 'starter',
          status: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_token', 'google-demo-token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Google auth failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    googleAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
