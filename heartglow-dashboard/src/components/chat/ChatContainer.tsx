import React, { useState, useRef, useEffect } from 'react';
import PaywallModal from '../ui/PaywallModal';

const ChatContainer: React.FC<ChatContainerProps> = ({
  // ... existing code ...
}) => {
  // ... existing code ...
  const [showPaywall, setShowPaywall] = useState(false);
  // ... existing code ...

  // Handler for sending messages
  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    // Check if user is on free plan and has already sent one message
    const isFreeTier = user?.subscription?.status !== 'active';
    const messageCount = messages.filter(m => m.role === 'user').length;
    
    if (isFreeTier && messageCount >= 1 && !showPaywall) {
      // Show paywall after first message for free users
      setShowPaywall(true);
      return;
    }

    // ... existing code for sending messages ...
  };

  // ... existing code ...

  return (
    <div className={className}>
      {/* ... existing code ... */}
      
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          source="chat_free_limit"
          isPresentOnAllDevices={true}
        />
      )}
      
      {/* ... existing code ... */}
    </div>
  );
}; 