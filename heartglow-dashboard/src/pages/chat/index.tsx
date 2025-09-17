import React, { useState, useEffect } from 'react';
import ChatLayout from '@/components/chat/ChatLayout'; // Import the main layout
import { Connection, Message } from '@/types'; // Import shared types
import { useConnections } from '@/hooks/useConnections'; // Import connections hook
import { useMessages } from '@/hooks/useMessages'; // Import messages hook
import { addConnection } from '@/firebase/db'; // <<< CHANGE IMPORT PATH

// --- Firebase Imports ---
// TODO: Verify these imports match your Firebase setup
// import { getAuth } from "firebase/auth"; 
import { getFunctions, httpsCallable } from 'firebase/functions';
// TODO: Import your initialized Firebase app if needed by getAuth/getFunctions
// import { app } from '@/firebase/firebaseConfig'; 

// --- Auth Hook ---
import { useAuth } from '@/hooks/useAuth'; 

// TODO: Import actual auth hook if available (preferred)
// import { useAuth } from '@/context/AuthContext'; 

// TODO: Import actual data types
// type Connection = { id: string; name: string; relationship?: string };
// type Message = { id: string; text: string; sender: 'user' | 'ai'; timestamp: any };

// TODO: Import hooks for auth, data fetching (useAuth, useConnections, useMessages)
// import { useAuth } from '@/context/AuthContext'; // Example auth context
// import { useConnections } from '@/hooks/useConnections';
// import { useMessages } from '@/hooks/useMessages';
// import { getFunctions, httpsCallable } from 'firebase/functions'; // For calling cloud functions

const ChatPage = () => {
  // --- Authentication ---
  const { user, loading: authLoading } = useAuth(); // Use the custom hook
  const userId = user?.uid; // Get user ID from the hook's user object

  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false); // State for input disable/spinner
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [usageLimitMessage, setUsageLimitMessage] = useState("");

  // Handle account creation redirect for usage limits
  const handleCreateAccount = () => {
    setShowUsageLimitModal(false);
    window.location.href = '/login?reason=usage_limit&mode=signup';
  };

  // Handler for starting a guide: only trigger the backend, do NOT show as user message
  const handleStartGuide = async (guideFirstLine: string) => {
    if (!userId) {
      console.error("User not authenticated, cannot start guide.");
      return;
    }
    setIsSendingMessage(true);
    try {
      const functions = getFunctions();
      const callHandleChatMessage = httpsCallable(functions, 'handleChatMessage');
      // Pass selectedConnectionId as 'heartglow-ai' for guides
      const result = await callHandleChatMessage({ connectionId: 'heartglow-ai', messageText: guideFirstLine });
      const resultData = result.data as { success?: boolean; error?: string; messageId?: string };
      if (!resultData?.success) {
        throw new Error("Cloud function reported failure: " + (resultData?.error || 'Unknown error'));
      }
      // No need to add a user message locally; the AI response will be picked up by the messages hook
      console.log('Guide started, AI response will appear.');
    } catch (error: any) {
      console.error("Error starting guide:", error);
      
      // Check if it's a usage limit error
      if (error?.code === 'functions/resource-exhausted' || error?.message?.includes('free guide') || error?.message?.includes('free messages')) {
        setUsageLimitMessage(error.message || "You've reached your daily limit. Create an account to get unlimited access!");
        setShowUsageLimitModal(true);
      } else {
        // TODO: Show other error types via toast
        console.error("Non-usage limit error:", error);
      }
    } finally {
      setIsSendingMessage(false);
    }
  };

  // --- Data Fetching Hooks ---
  const { 
    connections, 
    isLoading: isLoadingConnections, 
    error: connectionsError 
  } = useConnections(userId); // Pass the potentially null userId
  
  const { 
    messages, 
    isLoading: isLoadingMessages, 
    error: messagesError 
  } = useMessages(userId, selectedConnectionId); // Pass potentially null userId

  // --- Effect to Select Default AI Chat for New Users ---
  useEffect(() => {
    // Only run if we have a user, connections are loaded, and no connection is selected yet
    if (userId && !isLoadingConnections && !selectedConnectionId) {
      // If the user has no connections yet, select the default AI chat
      if (connections.length === 0) {
        console.log("New user or no connections found, selecting HeartGlow AI chat.");
        setSelectedConnectionId('heartglow-ai');
      }
    }
    // Dependencies: Run when user loads, connections load, or connections array changes
  }, [userId, connections, isLoadingConnections, selectedConnectionId]);

  // Handler for selecting a connection
  const handleSelectConnection = (connectionId: string) => {
    console.log(`Selected connection: ${connectionId}`);
    setSelectedConnectionId(connectionId); 
    // useMessages hook automatically refetches when selectedConnectionId changes
  };

  // Handler for saving a connection
  const handleSaveConnection = async (name: string, relationship: string, specificRelationship?: string, goal?: string, notes?: string) => {
    if (!user) { // Check for user object
      console.error("User object not available, cannot save connection.");
      throw new Error("Authentication error."); // Throw error to be caught in modal
    }
    // Updated data object to include optional fields
    const connectionData = {
      name,
      relationship,
      // Only include fields if they have a non-empty value after trimming
      ...(specificRelationship && { specificRelationship }),
      ...(goal && { goal }),
      ...(notes && { notes }),
    };
    console.log('Attempting to save connection:', { userId: user.uid, ...connectionData }); // Log userId if needed
    try {
      // Pass the complete connectionData object to addConnection
      await addConnection(user, connectionData);
      console.log('Connection saved successfully');
      // Refreshing might happen automatically if useConnections hook listens to Firestore changes.
    } catch (error) {
      console.error("Error saving connection:", error);
      throw error; // Rethrow the error so the modal can display it
    }
  };

  // Handler for sending a message
  const handleSendMessage = async (messageText: string) => {
    // Allow sending even if selectedConnectionId is null
    if (!userId) {
      console.error("User ID is missing for sending message.");
      return;
    }
    
    // Trim and check if message is empty
    const textToSend = messageText.trim();
    if (!textToSend) {
        return;
    }

    console.log(`Sending message to ${selectedConnectionId || 'General AI Chat'}: ${textToSend}`);
    setIsSendingMessage(true);

    try {
      const functions = getFunctions();
      const callHandleChatMessage = httpsCallable(functions, 'handleChatMessage');
      
      // Prepare payload conditionally
      const payload: { messageText: string; connectionId?: string | null } = {
        messageText: textToSend,
        connectionId: selectedConnectionId, // Send the actual selected ID ('heartglow-ai' or user connection ID)
      };

      // Pass the payload
      // Note: The backend 'handleChatMessage' needs to recognize 'heartglow-ai' as the general chat.
      console.log(`Calling handleChatMessage for ${selectedConnectionId === 'heartglow-ai' ? 'HeartGlow AI' : ('connection ' + selectedConnectionId)} with payload:`, payload);
      const result = await callHandleChatMessage(payload);
      
      console.log("Cloud function raw result:", result);
      const resultData = result.data as { success?: boolean; error?: string; messageId?: string };
      
      if (!resultData?.success) {
        throw new Error("Cloud function reported failure: " + (resultData?.error || 'Unknown error'));
      }
      
      console.log(`Message processed by cloud function. User message ID: ${resultData?.messageId || 'N/A'}`);
      
    } catch (error: any) { 
      console.error("Error calling handleChatMessage function:", error);
      
      // Check if it's a usage limit error
      if (error?.code === 'functions/resource-exhausted' || error?.message?.includes('free guide') || error?.message?.includes('free messages')) {
        setUsageLimitMessage(error.message || "You've reached your daily limit. Create an account to get unlimited access!");
        setShowUsageLimitModal(true);
      } else {
        // TODO: Show other error types via toast
        console.error("Non-usage limit error:", error);
      }
    } finally {
      setIsSendingMessage(false);
    }
  };

  // --- Loading / Error / Auth States ---
  if (authLoading) {
    // TODO: Replace with a proper loading spinner/component
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Authenticating...</div>;
  }

  if (!userId) {
    // TODO: Redirect to login page or show login prompt
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Please log in to access your chat.</div>;
  }

  if (connectionsError) {
    // Check if error is a string or an object with a message property
    const errorMessage = typeof connectionsError === 'string' ? connectionsError : (connectionsError as Error)?.message || 'Unknown error';
    return <div className="text-red-500 p-4">Error loading connections: {errorMessage}</div>;
  }
  // TODO: Handle messagesError appropriately (e.g., toast within ChatWindow)
  if (messagesError) {
     console.error("Error loading messages:", messagesError);
  }

  // Maybe show a page-level loader if connections are loading initially?
  // if (isLoadingConnections && connections.length === 0) {
  //   return <div>Loading Chat...</div>;
  // }

  return (
    <>
      <ChatLayout
        connections={connections}
        messages={messages}
        selectedConnectionId={selectedConnectionId}
        onSelectConnection={handleSelectConnection}
        onSendMessage={handleSendMessage}
        onSaveConnection={handleSaveConnection}
        isLoadingConnections={isLoadingConnections} // Pass down loading states
        isLoadingMessages={isLoadingMessages}
        isSendingMessage={isSendingMessage} // Pass down isSendingMessage state
        onStartGuide={handleStartGuide} // Pass guide handler
      />
      
      {/* Usage Limit Modal */}
      {showUsageLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUsageLimitModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-gradient-to-br from-[#1A1A2E] to-[#16213E] border border-purple-500/20 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            {/* Close button */}
            <button 
              onClick={() => setShowUsageLimitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            {/* Content */}
            <div className="text-center">
              <div className="text-4xl mb-4">💕</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                You're on the right track!
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                You've experienced what thousands of couples are discovering - HeartGlow actually works. Research shows couples who work on their relationship together report <span className="text-pink-400 font-semibold">67% higher satisfaction</span>. Ready to unlock your full potential?
              </p>
              
              {/* Features */}
              <div className="space-y-3 mb-8 text-left">
                {[
                  "💬 Unlimited AI Guidance & Expert Advice",
                  "🎯 Personalized Relationship Coaching", 
                  "📚 Save Your Progress & Conversations",
                  "🛠️ Advanced Communication Tools",
                  "❤️ Join 10,000+ Couples Building Stronger Bonds"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-300">
                    <span className="mr-2">{feature.split(' ')[0]}</span>
                    <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <button
                onClick={handleCreateAccount}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Your Free Account
              </button>
              
              <p className="text-xs text-gray-400 mt-4">
                Start your journey to a deeper connection • Free forever
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPage; 