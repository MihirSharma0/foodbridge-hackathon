import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export type UserRole = 'donor' | 'ngo' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  displayName: string;
  email: string;
  phoneNumber?: string;
  companyName?: string;
  securityQuestion?: {
    question: string;
    answer: string;
  };
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  needsProfile: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  createProfile: (profileData: Omit<User, 'id' | 'email' | 'username'>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);

  const fetchCurrentUser = useCallback(async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setNeedsProfile(!response.data.displayName);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { emailOrUsername, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      setNeedsProfile(userData.needsProfile);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, role: UserRole) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { email, password, role });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      setNeedsProfile(true);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    setUser(null);
    setNeedsProfile(false);
  }, []);

  const createProfile = useCallback(async (profileData: Omit<User, 'id' | 'email' | 'username'>) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setNeedsProfile(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Failed to update profile' };
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      needsProfile,
      isLoading,
      login,
      signUp,
      logout,
      updateUser,
      createProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
