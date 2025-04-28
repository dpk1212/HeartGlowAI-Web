import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
import QuickTemplateGrid from '../components/ui/QuickTemplateGrid';
import ConnectionsCarousel from '../components/ui/ConnectionsCarousel';
import RecentMessagesList from '../components/ui/RecentMessagesList';
import ComingSoonCard from '../components/ui/ComingSoonCard';
import CoachingEntryCard from '../components/ui/CoachingEntryCard';
import WelcomeDialog from '../components/ui/WelcomeDialog';
import { useWelcomeDialog } from '../hooks/useWelcomeDialog';
// import ChallengeCard from '../components/ui/ChallengeCard'; // Comment out
// import GlowScoreSummaryCard from '../components/ui/GlowScoreSummaryCard';
// import ChallengeSelection from '../components/ui/ChallengeSelection';
import { useAuth } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext'; 
// import { useChallenges, ChallengeDefinition } from '../hooks/useChallenges'; // Comment out
// Import Firebase auth methods needed for token
import { getAuth, getIdToken } from "firebase/auth";
import { getFunctions, httpsCallable } from 'firebase/functions';

// --- Chat Imports ---
import ChatLayout from '@/components/chat/ChatLayout';
import { Connection, Message } from '@/types';
import { useConnections } from '@/hooks/useConnections';
import { useMessages } from '@/hooks/useMessages';
import { addConnection } from '@/firebase/db'; // Change import path

// This is now the main dashboard page, served at /dashboard/ due to basePath
const IndexPage: NextPage = () => {
  const { currentUser: user, userProfile, loading: authLoading } = useAuth();
  // const { challenges: challengeDefs, loading: challengesLoading, error: challengesError } = useChallenges(); // Comment out
  // const [isChallengeActionLoading, setIsChallengeActionLoading] = useState(false); // Comment out
  const router = useRouter();
  const userId = user?.uid;
  
  // Welcome dialog state
  const { showWelcome, closeWelcomeDialog } = useWelcomeDialog();

  // --- Chat State ---
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>('heartglow-ai'); // Default to general AI
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  // --- End Chat State ---

  // Combined loading state: ONLY auth matters now
  const isLoading = authLoading;

  // Early return for loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">Authenticating...</div>
      </DashboardLayout>
    );
  }

  // Handle case where user is not logged in after loading
  if (!userId) {
     return (
      <DashboardLayout>
         <div className="flex justify-center items-center h-screen">Please log in.</div>
      </DashboardLayout>
     );
  }

  // --- Chat Hooks ---
  const { 
    connections: chatConnections, 
    isLoading: isLoadingConnections, 
    error: connectionsError 
  } = useConnections(userId);
  
  const { 
    messages: chatMessages, 
    isLoading: isLoadingMessages, 
    error: messagesError 
  } = useMessages(userId, selectedConnectionId);
  // --- End Chat Hooks ---

  // --- Existing Dashboard Logic (COMMENTED OUT) ---
  // const activeUserChallenge = userProfile?.activeChallenge;
  // let challengeCardProps = null; 
  // if (activeUserChallenge) { ... }
  // const glowScoreData = { ... };
  // const availableChallengesForSelection = challengeDefs.filter(...);
  // --- End Existing Dashboard Logic ---

  // --- Chat Handlers ---
  const handleSelectConnection = (connectionId: string) => {
    console.log(`Selected connection: ${connectionId}`);
    setSelectedConnectionId(connectionId);
  };

  // NEW: Handler to navigate back to Guides view
  const handleNavigateToGuides = () => {
    console.log('Navigating to Guides view (setting connectionId to null)');
    setSelectedConnectionId(null);
  };

  const handleSaveConnection = async (
    name: string, 
    relationship: string, 
    specificRelationship?: string, 
    goal?: string, 
    notes?: string
  ) => {
    if (!user) {
      console.error("User object not available, cannot save connection.");
      throw new Error("Authentication error."); // Throw error to be caught in modal
    }
    console.log('Attempting to save connection:', { 
      userId: user.uid, 
      name, 
      relationship,
      specificRelationship,
      goal,
      notes
    });
    try {
      // Option 1: Call a cloud function (if you have one)
      // const functions = getFunctions();
      // const callCreateConnection = httpsCallable(functions, 'createConnection');
      // await callCreateConnection({ name, relationship });
      
      // Option 2: Use a client-side utility function (more direct)
      await addConnection(user, { 
        name, 
        relationship,
        specificRelationship,
        relationshipGoal: goal,
        notes 
      }); // Pass user object and all fields
      
      console.log('Connection saved successfully');
      // Optionally: Select the new connection? Or refresh connections list?
      // Refreshing might happen automatically if useConnections hook listens to Firestore changes.
    } catch (error) {
      console.error("Error saving connection:", error);
      // Rethrow the error so the modal can display it
      throw error;
    }
  };

  const handleSendMessage = async (messageText: string) => {
    // Allow sending even if selectedConnectionId is null (for general chat)
    // Only require userId
    if (!userId) { 
      console.error("User not authenticated, cannot send message.");
      // Maybe show an error toast to the user here
      return; 
    }
    
    // If message is empty, do nothing (trim check)
    if (!messageText.trim()) {
        return;
    }

    setIsSendingMessage(true);
    console.log(`Sending message: "${messageText}" for connection: ${selectedConnectionId || 'General AI Chat'}`); // Log which chat
    try {
      const functions = getFunctions();
      const callHandleChatMessage = httpsCallable(functions, 'handleChatMessage');
      // Pass selectedConnectionId (which will be null for general chat)
      const result = await callHandleChatMessage({ connectionId: selectedConnectionId, messageText });
      const resultData = result.data as { success?: boolean; error?: string; messageId?: string };
      if (!resultData?.success) {
        throw new Error("Cloud function reported failure: " + (resultData?.error || 'Unknown error'));
      }
      console.log('Cloud function processed message successfully.');
    } catch (error) { 
      console.error("Error calling handleChatMessage function:", error);
      // TODO: Show error toast to user
    } finally {
      setIsSendingMessage(false);
    }
  };
  // --- End Chat Handlers ---

  // Handle start conversation from welcome dialog
  const handleStartConversation = () => {
    // Select HeartGlow AI chat
    setSelectedConnectionId('heartglow-ai');
  };

  // --- Challenge Handlers (COMMENTED OUT) ---
  // const handleSelectChallenge = async (challengeId: string) => { ... };
  // const handleSkipChallenge = async () => { ... };
  // --- End Challenge Handlers ---
  
  // --- Error Handling for Data Hooks ---
  if (connectionsError) { console.error("Error loading connections:", connectionsError); }
  if (messagesError) { console.error("Error loading messages:", messagesError); }
  // --- End Error Handling ---

  return (
    <>
      <Head>
        <title>HeartGlow AI | Dashboard</title>
        <meta name="description" content="HeartGlow AI Dashboard" />
      </Head>

      <AuthGuard>
        <DashboardLayout onNavigateToGuides={handleNavigateToGuides}>
          {/* Welcome Dialog */}
          <WelcomeDialog 
            open={showWelcome}
            onClose={closeWelcomeDialog}
            onStartConversation={handleStartConversation}
          />

          {/* --- RENDER CHAT INTERFACE --- */}
           <div className="h-[calc(100vh-64px)] -mt-4 -mx-4"> 
             <ChatLayout
               connections={chatConnections}
               messages={chatMessages}
               selectedConnectionId={selectedConnectionId}
               onSelectConnection={handleSelectConnection}
               onSendMessage={handleSendMessage}
               isLoadingConnections={isLoadingConnections}
               isLoadingMessages={isLoadingMessages}
               onSaveConnection={handleSaveConnection}
             />
           </div>
          {/* --- END CHAT INTERFACE --- */}
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default IndexPage; 