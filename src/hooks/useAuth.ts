import { useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import * as authService from '../services/auth';
import { useFirebase } from '../contexts/FirebaseContext';

export const useAuth = () => {
  const { user, loading: contextLoading, error: contextError, isDemo } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In demo mode, we'll simulate a user
  const demoUser: User | null = isDemo ? {
    uid: 'demo-user-id',
    email: 'demo@example.com',
    displayName: 'Demo User',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => { },
    getIdToken: async () => 'demo-token',
    getIdTokenResult: async () => ({
      token: 'demo-token',
      signInProvider: 'password',
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      authTime: new Date().toISOString(),
      claims: {}
    }),
    reload: async () => { },
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null,
    providerId: 'password'
  } as unknown as User : null;

  const currentUser = isDemo ? demoUser : user;

  const login = useCallback(async (email: string, password: string) => {
    if (isDemo) {
      setLoading(true);
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authService.signIn(email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  const logout = useCallback(async () => {
    if (isDemo) {
      setLoading(true);
      // Simulate logout delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authService.signOutUser();
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    if (isDemo) {
      setLoading(true);
      // Simulate signup delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authService.signUp(email, password, displayName);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  const resetPassword = useCallback(async (email: string) => {
    if (isDemo) {
      setLoading(true);
      // Simulate password reset delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(email);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  return {
    user: currentUser,
    loading: contextLoading || loading,
    error: contextError || error,
    isDemo,
    login,
    logout,
    signup,
    resetPassword
  };
}; 