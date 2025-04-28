import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { 
  signIn,
  signInWithGoogle, 
  auth_signUp as signUp,
  logOut,
  onAuthStateChangedListener,
  signInAnonymously
} from '../firebase/auth';
import { User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, increment, getDoc, updateDoc, DocumentData, onSnapshot, Unsubscribe, FieldValue as FirebaseFieldValue } from 'firebase/firestore';
import { db } from '../firebase/config';

// Import Firebase Analytics
import { logEvent } from 'firebase/analytics';
import { analytics as firebaseAnalytics } from '../lib/firebase'; // Import the analytics instance

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
  hasCompletedOnboarding?: boolean; // Added for onboarding flow tracking
  hasSeenDashboardTour?: boolean; // Added for dashboard orientation tour

  // --- Stripe Subscription Fields ---
  isPremium?: boolean;           // Tracks active premium status
  stripeCustomerId?: string;     // Stripe Customer ID
  stripeSubscriptionId?: string; // Active Stripe Subscription ID
  subscriptionEndDate?: any;   // Optional: Track when subscription ends (Timestamp)

  // --- Usage Tracking ---
  coachingSessionsStarted?: number; // Count of coaching sessions initiated

  // New optional field
  hasUsedFreeGuide?: boolean;
};

// Define a type for the data passed to updateUserProfile
// Allows standard fields OR FieldValue for specific numeric fields
export type UserProfileUpdateData = 
  Partial<Omit<UserProfile, 'totalMessageCount' | 'coachingSessionsStarted'>> 
  & { 
    totalMessageCount?: number | FirebaseFieldValue; 
    coachingSessionsStarted?: number | FirebaseFieldValue; 
};

export type AuthContextType = {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (data: UserProfileUpdateData) => Promise<void>;
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
  const [isInitialAuthCheckComplete, setIsInitialAuthCheckComplete] = useState(false);
  const previousUserProfileRef = useRef<UserProfile | null>(null); // Ref to store previous profile

  // --- Analytics Helper (Simplified for context) ---
  const logAuthEvent = async (eventName: string, params?: { [key: string]: any }) => {
    try {
      const analyticsInstance = await firebaseAnalytics; // Resolve the promise
      if (analyticsInstance) {
        logEvent(analyticsInstance, eventName, params);
        console.log(`[Firebase Analytics] Logged auth event: ${eventName}`, params);
      } else {
        console.warn('[Firebase Analytics] Analytics not supported or initialized.');
      }
    } catch (error) {
      console.error('[Firebase Analytics] Error logging auth event:', error);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    let profileUnsubscribe: Unsubscribe | null = null;
    
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      console.log('Auth state changed:', user ? `User logged in ${user.uid} (Anonymous: ${user.isAnonymous})` : 'No user');

      setCurrentUser(user);

      if (profileUnsubscribe) {
        console.log('Unsubscribing from previous profile listener');
        profileUnsubscribe();
        profileUnsubscribe = null;
      }
      
      if (!user) {
        if (isInitialAuthCheckComplete) {
          console.log('User logged out or session ended.');
          setUserProfile(null);
          setLoading(false);
        } else {
          console.log('Initial load: No user found, attempting anonymous sign-in...');
          setLoading(true);
          try {
            await signInAnonymously();
            console.log('Anonymous sign-in successful, waiting for state update.');
          } catch (error) {
            console.error('Anonymous sign-in failed:', error);
            setUserProfile(null);
            setLoading(false);
          } finally {
            setIsInitialAuthCheckComplete(true);
          }
        }
      } else {
        setIsInitialAuthCheckComplete(true);
        setLoading(true);
        const userRef = doc(db, "users", user.uid);
        console.log(`Setting up profile listener for user ${user.uid}`);

        profileUnsubscribe = onSnapshot(userRef, async (docSnap) => {
           if (docSnap.exists()) {
             console.log(`Profile data received for user ${user.uid}:`, docSnap.data());
             const profileData = docSnap.data() as Omit<UserProfile, 'uid'>;
             
             // Construct the new profile object
             const newProfile: UserProfile = {
               uid: user.uid, 
               email: user.email ?? profileData.email ?? null,
               displayName: user.displayName ?? profileData.displayName ?? null,
               photoURL: user.photoURL ?? profileData.photoURL ?? null,
               lastLogin: profileData.lastLogin ?? serverTimestamp(),
               totalMessageCount: profileData.totalMessageCount ?? 0,
               glowScoreXP: profileData.glowScoreXP ?? 0,
               glowScoreTier: profileData.glowScoreTier ?? '🌱 Opening Up',
               currentStreak: profileData.currentStreak ?? 0,
               lastMessageTimestamp: profileData.lastMessageTimestamp ?? null,
               activeChallenge: profileData.activeChallenge ?? null,
               challengeHistory: profileData.challengeHistory ?? [],
               metrics: profileData.metrics ?? { weeklyMessageCount: 0, uniqueConnectionsMessagedWeekly: [], toneCounts: {}, reflectionsCompletedCount: 0 },
               unlockedFeatures: profileData.unlockedFeatures ?? [],
               hasCompletedOnboarding: profileData.hasCompletedOnboarding ?? false,
               hasSeenDashboardTour: profileData.hasSeenDashboardTour ?? false,
               isPremium: profileData.isPremium ?? false,
               stripeCustomerId: profileData.stripeCustomerId ?? '',
               stripeSubscriptionId: profileData.stripeSubscriptionId ?? '',
               subscriptionEndDate: profileData.subscriptionEndDate ?? null,
               coachingSessionsStarted: profileData.coachingSessionsStarted ?? 0,
               hasUsedFreeGuide: profileData.hasUsedFreeGuide ?? false
             };
             
             // --- Check for Premium Status Change ---
             const previousProfile = previousUserProfileRef.current;
             if (previousProfile && !previousProfile.isPremium && newProfile.isPremium) {
               console.log('User transitioned to Premium! Logging subscription_completed event.');
               logAuthEvent('subscription_completed', {
                 stripe_customer_id: newProfile.stripeCustomerId,
                 // Add any other relevant parameters like plan ID if available/needed
               });
             }
             
             // Update state and previous state ref
             setUserProfile(newProfile);
             previousUserProfileRef.current = newProfile; // Store current profile for next comparison
             
             setLoading(false);
           } else {
             console.log(`Profile not found for ${user.uid}, creating...`);
             try {
               const initialProfile: UserProfile = {
                 uid: user.uid,
                 email: user.email,
                 displayName: user.displayName,
                 photoURL: user.photoURL,
                 lastLogin: serverTimestamp(),
                 totalMessageCount: 0,
                 glowScoreXP: 0,
                 glowScoreTier: '🌱 Opening Up',
                 currentStreak: 0,
                 lastMessageTimestamp: null,
                 activeChallenge: null,
                 challengeHistory: [],
                 metrics: { weeklyMessageCount: 0, uniqueConnectionsMessagedWeekly: [], toneCounts: {}, reflectionsCompletedCount: 0 },
                 unlockedFeatures: [],
                 hasCompletedOnboarding: false,
                 hasSeenDashboardTour: false,
                 isPremium: false,
                 stripeCustomerId: '',
                 stripeSubscriptionId: '',
                 subscriptionEndDate: null,
                 coachingSessionsStarted: 0,
                 hasUsedFreeGuide: false
               };
               await setDoc(userRef, initialProfile);
               console.log(`Initial profile created for ${user.uid}`);
             } catch (error) {
               console.error('Error creating initial user document:', error);
               setUserProfile(null);
               setLoading(false);
             }
           }
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
      previousUserProfileRef.current = null; // Clear ref on cleanup
    };
  }, []);

  // Update userProfileRef whenever userProfile state changes (alternative way to track previous state)
  /* useEffect(() => {
    previousUserProfileRef.current = userProfile;
  }, [userProfile]); */

  const updateUserProfile = async (data: UserProfileUpdateData) => {
    if (!currentUser) {
      throw new Error("User not authenticated to update profile.");
    }
    const userRef = doc(db, "users", currentUser.uid);
    try {
      console.log(`Updating profile for user ${currentUser.uid} with data:`, data);
      await updateDoc(userRef, { 
        ...data, 
      });
      console.log(`Profile updated successfully for user ${currentUser.uid}.`);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

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
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 