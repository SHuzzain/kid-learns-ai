/**
 * Authentication Context
 * Provides auth state and methods throughout the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import { useCurrentUser, useLogin, useLogout, useSignUp } from '@/hooks/useApi';
import { useNavigate } from 'react-router-dom';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'admin' | 'student') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const loginMutation = useLogin();
  const signUpMutation = useSignUp();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const user = await loginMutation.mutateAsync({ email, password });
    // Redirect based on role
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'admin' | 'student') => {
    const user = await signUpMutation.mutateAsync({ email, password, name, role });
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    navigate('/');
  };

  const value: AuthContextType = {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    login,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
