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

  // Handler for selecting a connection
  const handleSelectConnection = (connectionId: string) => {
    console.log(`Selected connection: ${connectionId}`);
    setSelectedConnectionId(connectionId); 
    // useMessages hook automatically refetches when selectedConnectionId changes
  };

  // Handler for saving a connection
  const handleSaveConnection = async (name: string, relationship: string) => {
    if (!user) { // Check for user object
      console.error("User object not available, cannot save connection.");
      throw new Error("Authentication error."); // Throw error to be caught in modal
    }
    console.log('Attempting to save connection:', { userId: user.uid, name, relationship }); // Log userId if needed
    try {
      await addConnection(user, { name, relationship }); // Pass user object
      console.log('Connection saved successfully');
      // Refreshing might happen automatically if useConnections hook listens to Firestore changes.
    } catch (error) {
      console.error("Error saving connection:", error);
      throw error; // Rethrow the error so the modal can display it
    }
  };

  // Handler for sending a message
  const handleSendMessage = async (messageText: string) => {
    if (!selectedConnectionId || !userId) {
      console.error("User ID or Connection ID is missing for sending message.");
      // TODO: Show error to user (e.g., toast notification)
      return;
    }

    console.log(`Sending message to ${selectedConnectionId}: ${messageText}`);
    setIsSendingMessage(true);

    try {
      // --- Actual Cloud Function Call ---
      const functions = getFunctions(); // Pass 'app' if needed: getFunctions(app)
      const callHandleChatMessage = httpsCallable(functions, 'handleChatMessage');
      console.log(`Calling handleChatMessage for connection ${selectedConnectionId}`);
      
      const result = await callHandleChatMessage({ 
        connectionId: selectedConnectionId, 
        messageText: messageText 
      });
      
      console.log("Cloud function raw result:", result);
      const resultData = result.data as { success?: boolean; error?: string; messageId?: string }; // Type assertion
      
      if (!resultData?.success) {
        // Throw an error if the function explicitly reported failure
        throw new Error("Cloud function reported failure: " + (resultData?.error || 'Unknown error'));
      }
      
      console.log(`Message processed by cloud function. User message ID: ${resultData?.messageId || 'N/A'}`);
      // --- UI updates automatically via Firestore listeners --- 
      
    } catch (error) { // Catch errors from httpsCallable or the explicit throw above
      console.error("Error calling handleChatMessage function:", error);
      // TODO: Show error toast/message to user (e.g., check error.code, error.message)
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
    return <div className="text-red-500 p-4">Error loading connections: {connectionsError.message}</div>;
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
    <ChatLayout
      connections={connections}
      messages={messages}
      selectedConnectionId={selectedConnectionId}
      onSelectConnection={handleSelectConnection}
      onSendMessage={handleSendMessage}
      onSaveConnection={handleSaveConnection}
      isLoadingConnections={isLoadingConnections} // Pass down loading states
      isLoadingMessages={isLoadingMessages}
      // TODO: Pass isSendingMessage down if MessageInput needs it directly
      // isSending={isSendingMessage} 
    />
  );
};

export default ChatPage; 