import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signIn,
  signInWithGoogle, 
  auth_signUp as signUp,
  logOut,
  onAuthStateChangedListener
} from '../firebase/auth';
import { User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, increment, getDoc, updateDoc, DocumentData, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase/config';

// Define a type for the extended user profile data from Firestore
export type UserProfile = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  lastLogin?: any; // Firestore Timestamp
  totalMessageCount?: number;
  // Add GlowScore and Challenge fields with defaults
  glowScoreXP?: number;
  glowScoreTier?: string;
  currentStreak?: number;
  lastMessageTimestamp?: any | null; // Firestore Timestamp or null
  activeChallenge?: {
    challengeId: string;
    progress: number;
    goal: number;
    assignedDate: any; // Firestore Timestamp
    status: 'active' | 'completed' | 'skipped';
    rewardXP: number;
    rewardUnlock: string | null;
  } | null;
  challengeHistory?: Array<any>; // Consider a more specific type later
  metrics?: {
    weeklyMessageCount?: number;
    uniqueConnectionsMessagedWeekly?: Array<string>;
    toneCounts?: { [key: string]: number };
    reflectionsCompletedCount?: number;
  };
  unlockedFeatures?: string[];
};

export type AuthContextType = {
  currentUser: User | null;
  userProfile: UserProfile | null;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    let profileUnsubscribe: Unsubscribe | null = null;
    
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      console.log('Auth state changed:', user ? `User logged in ${user.uid}` : 'No user');

      setCurrentUser(user);

      if (profileUnsubscribe) {
        console.log('Unsubscribing from previous profile listener');
        profileUnsubscribe();
        profileUnsubscribe = null;
      }
      
      if (!user) {
        setUserProfile(null);
        setLoading(false);
      } else {
        setLoading(true);
        const userRef = doc(db, "users", user.uid);
        console.log(`Setting up profile listener for user ${user.uid}`);

        profileUnsubscribe = onSnapshot(userRef, async (docSnap) => {
           if (docSnap.exists()) {
             console.log(`Profile data received for user ${user.uid}:`, docSnap.data());
             setUserProfile({ uid: user.uid, ...docSnap.data() } as UserProfile);
           } else {
             console.log(`Profile not found for ${user.uid}, creating...`);
             try {
               const initialProfile: Partial<UserProfile> = {
                 email: user.email,
                 uid: user.uid,
                 lastLogin: serverTimestamp(),
                 displayName: user.displayName,
                 photoURL: user.photoURL,
                 totalMessageCount: 0,
                 glowScoreXP: 0,
                 glowScoreTier: '🌱 Opening Up',
                 currentStreak: 0,
                 lastMessageTimestamp: null,
                 activeChallenge: null,
                 challengeHistory: [],
                 metrics: { weeklyMessageCount: 0, uniqueConnectionsMessagedWeekly: [], toneCounts: {}, reflectionsCompletedCount: 0 },
                 unlockedFeatures: []
               };
               await setDoc(userRef, initialProfile);
               console.log(`Initial profile created for ${user.uid}`);
             } catch (error) {
               console.error('Error creating initial user document:', error);
               setUserProfile(null);
               setLoading(false);
             }
           }
           setLoading(false); 
        }, (error) => {
            console.error(`Error listening to profile for ${user.uid}:`, error);
            setUserProfile(null);
            setLoading(false);
        });
      }
    });

    return () => {
      console.log('Cleaning up auth listeners');
      unsubscribe();
      if (profileUnsubscribe) {
        console.log('Unsubscribing from profile listener during cleanup');
        profileUnsubscribe();
      }
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
    userProfile,
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