"use client";

/**
 * StudioSync Authentication Context
 * * Manages the global authentication state, session persistence via LocalStorage,
 * and provides secure routing triggers for login/logout actions.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, User } from '../types';

// Initialize context with undefined to enforce Provider usage
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Wraps the application to provide shared auth state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Session Hydration logic:
   * Runs on mount to check for existing credentials in the browser's storage.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Logs in the user and persists credentials.
   * @param userData User context received from the backend API.
   */
  const login = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/');
  };

  /**
   * Destroys the current session and redirects to the public entry point.
   */
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access AuthContext.
 * Includes a safety check to ensure it's used within a valid Provider.
 * @returns {AuthContextType} The current user state and auth methods.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}