import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signIn,
  signInWithGoogle, 
  auth_signUp as signUp,
  logOut,
  onAuthStateChangedListener
} from '../firebase/auth';
import { User } from 'firebase/auth';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth state timeout - forcing load complete');
        setLoading(false);
      }
    }, 10000); // 10 second timeout
    
    const unsubscribe = onAuthStateChangedListener((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setCurrentUser(user);
      setLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email: string, password: string) => {
    return signIn(email, password);
  };

  const loginWithGoogle = async () => {
    return signInWithGoogle();
  };

  const signup = async (email: string, password: string) => {
    return signUp(email, password);
  };

  const logout = async () => {
    return logOut();
  };

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 