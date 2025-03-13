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
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setState((prev) => ({
          ...prev,
          user,
          loading: false
        }));
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false
        }));
      }
    );

    // Cleanup the listener
    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={state}>
      {children}
    </FirebaseContext.Provider>
  );
}; 