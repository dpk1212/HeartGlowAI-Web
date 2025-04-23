import { useState, useEffect } from 'react';
import { usePaywall } from '../context/PaywallContext';

const STORAGE_KEY = 'heartglow-welcome-shown';
const PAYWALL_AFTER_WELCOME_KEY = 'show-paywall-after-welcome';

export function useWelcomeDialog() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { openPaywall } = usePaywall();
  
  useEffect(() => {
    // Check if this is the first visit
    const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
    
    // Only show welcome dialog if user hasn't seen it before
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      // Set flag to show paywall after welcome is closed
      localStorage.setItem(PAYWALL_AFTER_WELCOME_KEY, 'true');
    }
  }, []);
  
  const closeWelcomeDialog = () => {
    setShowWelcome(false);
    // Mark as seen for future visits
    localStorage.setItem(STORAGE_KEY, 'true');
    
    // Check if we should show the paywall
    const shouldShowPaywall = localStorage.getItem(PAYWALL_AFTER_WELCOME_KEY);
    if (shouldShowPaywall) {
      // Short delay to make the transition feel natural
      setTimeout(() => {
        openPaywall();
        // Remove the flag after showing the paywall
        localStorage.removeItem(PAYWALL_AFTER_WELCOME_KEY);
      }, 300);
    }
  };
  
  // For testing/debugging - resets the welcome dialog state
  const resetWelcomeDialog = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(PAYWALL_AFTER_WELCOME_KEY, 'true');
    setShowWelcome(true);
  };
  
  return {
    showWelcome,
    closeWelcomeDialog,
    resetWelcomeDialog, // Export for testing
  };
} 