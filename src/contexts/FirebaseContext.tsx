import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase/config';

// Type definition for the context
interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isDemo: boolean;
}

// Create the context with a default value
const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: null,
  isDemo: false
});

// Custom hook to use the Firebase context
export const useFirebase = () => useContext(FirebaseContext);

// Provider component
export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FirebaseContextType>({
    user: null,
    loading: true,
    error: null,
    isDemo: false
  });

  // Listen for authentication state changes
  useEffect(() => {
    // Add error handling
    try {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          setState((prev) => ({
            ...prev,
            user,
            loading: false
          }));
        },
        (error) => {
          console.error("Auth state change error:", error);
          setState((prev) => ({
            ...prev,
            error: error.message,
            loading: false,
            // Automatically switch to demo mode if Firebase auth fails
            isDemo: true
          }));
        }
      );

      // Cleanup the listener
      return () => {
        try {
          unsubscribe();
        } catch (err) {
          console.error("Error unsubscribing from auth:", err);
        }
      };
    } catch (err) {
      console.error("Firebase initialization error:", err);
      // If Firebase initialization fails, set demo mode
      setState({
        user: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to initialize Firebase",
        isDemo: true
      });
      return () => {}; // Return empty cleanup function
    }
  }, []);

  return (
    <FirebaseContext.Provider value={state}>
      {children}
    </FirebaseContext.Provider>
  );
}; 