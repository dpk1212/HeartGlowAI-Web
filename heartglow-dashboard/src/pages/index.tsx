import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

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
import { Button } from '@/components/ui/button';

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

  // --- NEW State for Primer Screen ---
  const [showPrimer, setShowPrimer] = useState(true);
  // --- End NEW State ---

  // Combined loading state: ONLY auth matters now
  const isLoading = authLoading;

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E0E1A] to-[#14141F]">
         <p className="text-white/70">Loading HeartGlow...</p>
      </div>
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
  } = useConnections(!showPrimer ? userId : undefined);
  
  const { 
    messages: chatMessages, 
    isLoading: isLoadingMessages, 
    error: messagesError 
  } = useMessages(!showPrimer ? userId : undefined, !showPrimer ? selectedConnectionId : 'disabled'); // Pass 'disabled' or similar if primer shown
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

  const handleNavigateToGuides = () => {
    console.log('Navigating to Guides view (setting connectionId to null)');
    setSelectedConnectionId(null);
  };

  // NEW: Handler to select the general AI chat
  const handleSelectGeneralChat = () => {
    console.log('Selecting General AI Chat view (setting connectionId to heartglow-ai)');
    setSelectedConnectionId('heartglow-ai'); 
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

  // --- NEW: Render Enhanced Primer Screen ---
  if (showPrimer) {
    return (
      <>
        <Head>
          <title>HeartGlow AI | Emotional Clarity</title>
          <meta name="description" content="Turn confusion into connection. Find the perfect words, even when your heart is racing." />
        </Head>
        {/* Main container with new gradient and layout */}
        {/* NOTE: Using placeholder gradient, replace with exact styles from screenshot 1 if possible */}
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white relative overflow-hidden">

          {/* Login Link - Kept but maybe styled differently? */}
          <Link href="/login" legacyBehavior>
            <a className="absolute top-5 right-6 text-sm text-gray-200 hover:text-white transition-colors z-20">
              Login
            </a>
          </Link>

          {/* Replaced Logo with Icon - Kept, maybe repositioned/styled? */}
          <SparklesIcon
            className="absolute top-6 left-6 h-8 w-8 text-white/60 z-20"
            aria-hidden="true"
          />

          {/* Centered Content Area */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, ease: "easeOut" }}
             className="z-10 flex flex-col items-center w-full max-w-md text-center px-4"
          >
             {/* Removed Frosted Glass Card - content directly on gradient */}

             {/* Headline - Updated Text & Style */}
             <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
               Emotional clarity when it matters most.
             </h1>

             {/* Subheadline - Updated Text & Style */}
             <p className="text-lg md:text-xl text-gray-100/90 mb-10 font-light max-w-sm mx-auto">
               Turn confusion into connection. Find the perfect words, even when your heart is racing.
             </p>

             {/* CTA Button - Updated Text, Style & onClick */}
             <Button
               onClick={() => router.push('/login')}
               size="lg"
               className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-3 text-lg font-medium bg-white text-indigo-700 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-indigo-700"
             >
               {/* Consider adding an icon? <SparklesIcon className="w-5 h-5 mr-2 -ml-1 opacity-70" /> */}
               Get Clarity Now
             </Button>

             {/* Removed Micro Text Below Button */}

          </motion.div>
          {/* Download/Rating elements from screenshot 1 are not included as they might be app-specific */}
        </div>
      </>
    );
  }
  // --- End Primer Screen ---

  // --- Render Main Dashboard (only if primer is dismissed) ---
  // AuthGuard will handle redirecting if user is somehow still null here
  return (
    <>
      <Head>
        <title>HeartGlow AI | Dashboard</title>
        <meta name="description" content="HeartGlow AI Dashboard" />
      </Head>
      <AuthGuard>
        <DashboardLayout 
          onNavigateToGuides={handleNavigateToGuides}
          onSelectGeneralChat={handleSelectGeneralChat}
        >
          <WelcomeDialog 
            open={showWelcome}
            onClose={closeWelcomeDialog}
            onStartConversation={handleStartConversation} // Ensure this selects 'heartglow-ai' connection
          />
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
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default IndexPage; 