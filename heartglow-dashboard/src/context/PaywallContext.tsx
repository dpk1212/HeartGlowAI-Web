import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface PaywallContextType {
  isPaywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export const usePaywall = (): PaywallContextType => {
  const context = useContext(PaywallContext);
  if (!context) {
    throw new Error('usePaywall must be used within a PaywallProvider');
  }
  return context;
};

interface PaywallProviderProps {
  children: ReactNode;
}

export const PaywallProvider: React.FC<PaywallProviderProps> = ({ children }) => {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const openPaywall = useCallback(() => {
    console.log('Opening Paywall Modal...');
    setIsPaywallOpen(true);
  }, []);

  const closePaywall = useCallback(() => {
    setIsPaywallOpen(false);
  }, []);

  const value = {
    isPaywallOpen,
    openPaywall,
    closePaywall,
  };

  return (
    <PaywallContext.Provider value={value}>
      {children}
    </PaywallContext.Provider>
  );
}; 