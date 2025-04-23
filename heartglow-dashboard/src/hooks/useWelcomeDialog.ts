import { useState, useEffect } from 'react';

const STORAGE_KEY = 'heartglow-welcome-shown';

export function useWelcomeDialog() {
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    // Check if this is the first visit
    const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
    
    // Only show welcome dialog if user hasn't seen it before
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);
  
  const closeWelcomeDialog = () => {
    setShowWelcome(false);
    // Mark as seen for future visits
    localStorage.setItem(STORAGE_KEY, 'true');
  };
  
  // For testing/debugging - resets the welcome dialog state
  const resetWelcomeDialog = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowWelcome(true);
  };
  
  return {
    showWelcome,
    closeWelcomeDialog,
    resetWelcomeDialog, // Export for testing
  };
} 