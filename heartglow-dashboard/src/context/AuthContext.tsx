import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signIn,
  signInWithGoogle, 
  auth_signUp as signUp,
  logOut,
  onAuthStateChangedListener
} from '../firebase/auth';
import { User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, increment, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

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
    
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth state timeout - forcing load complete');
        setLoading(false);
      }
    }, 10000);
    
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');

      // Set user and loading state immediately
      setCurrentUser(user);
      setLoading(false);
      clearTimeout(timeoutId);
      
      // Perform Firestore operations afterwards if user exists
      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          await setDoc(userRef, { 
            email: user.email,
            uid: user.uid,
            lastLogin: serverTimestamp(),
            displayName: user.displayName,
            photoURL: user.photoURL
          }, { merge: true });
          
          const checkSnap = await getDoc(userRef);
          if (!checkSnap.exists() || checkSnap.data()?.totalMessageCount === undefined) {
             await updateDoc(userRef, { totalMessageCount: 0 });
          }

          console.log('User document created/updated in Firestore for:', user.uid);
        } catch (error) {
          console.error('Error creating/updating user document:', error);
        }
      }
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