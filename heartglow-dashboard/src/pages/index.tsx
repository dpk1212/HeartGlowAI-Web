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

// This is now the main dashboard page, served at /dashboard/ due to basePath
const IndexPage: NextPage = () => {
  const { currentUser: user, userProfile, loading: authLoading } = useAuth();
  // const { challenges: challengeDefs, loading: challengesLoading, error: challengesError } = useChallenges(); // Comment out
  // const [isChallengeActionLoading, setIsChallengeActionLoading] = useState(false); // Comment out
  const router = useRouter();
  const userId = user?.uid;

  // --- Chat State ---
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
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

  const handleSendMessage = async (messageText: string) => {
    if (!selectedConnectionId || !userId) { return; }
    setIsSendingMessage(true);
    try {
      const functions = getFunctions();
      const callHandleChatMessage = httpsCallable(functions, 'handleChatMessage');
      const result = await callHandleChatMessage({ connectionId: selectedConnectionId, messageText });
      const resultData = result.data as { success?: boolean; error?: string; messageId?: string };
      if (!resultData?.success) {
        throw new Error("Cloud function reported failure: " + (resultData?.error || 'Unknown error'));
      }
    } catch (error) { 
      console.error("Error calling handleChatMessage function:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };
  // --- End Chat Handlers ---

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
        <DashboardLayout>
          {/* --- RENDER CHAT INTERFACE --- */}
           <div className="h-[calc(100vh_-_theme(space.16))] -mt-4 -mx-4"> 
             <ChatLayout
               connections={chatConnections}
               messages={chatMessages}
               selectedConnectionId={selectedConnectionId}
               onSelectConnection={handleSelectConnection}
               onSendMessage={handleSendMessage}
               isLoadingConnections={isLoadingConnections}
               isLoadingMessages={isLoadingMessages}
               // TODO: Pass isSendingMessage down
             />
           </div>
          {/* --- END CHAT INTERFACE --- */}

          {/* --- Other Sections Commented Out --- */}
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default IndexPage; 