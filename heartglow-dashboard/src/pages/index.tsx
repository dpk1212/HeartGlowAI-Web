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
  // --- ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP --- 
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const userId = currentUser?.uid;
  const { showWelcome, closeWelcomeDialog } = useWelcomeDialog();
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>('heartglow-ai');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showPrimer, setShowPrimer] = useState(true);

  // Call useConnections and useMessages unconditionally here
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

  // --- Effect to hide primer for logged-in (non-anonymous) users ---
  useEffect(() => {
    if (!authLoading && currentUser && !currentUser.isAnonymous) {
      setShowPrimer(false); 
    }
  }, [authLoading, currentUser]);

  // --- RENDER LOGIC using state from hooks --- 

  // 1. Auth Loading State
  if (authLoading) { // Check auth loading FIRST
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E0E1A] to-[#14141F]">
         <p className="text-white/70">Loading HeartGlow...</p>
      </div>
    );
  }

  // 2. Primer Screen State (Only show if auth is done AND showPrimer is true)
  if (showPrimer) {
    return (
      <>
        <Head>
          <title>HeartGlow AI | Emotional Clarity</title>
          <meta name="description" content="Turn confusion into connection. Find the perfect words, even when your heart is racing." />
        </Head>
        {/* Main container with updated gradient and layout */}
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#4C1D95] via-[#2E1065] to-[#1C1917] text-white relative overflow-hidden">
          {/* Subtle Grain/Noise Overlay - Removed as asset is missing */}
          {/* <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.04] pointer-events-none mix-blend-soft-light"></div> */}
          {/* Optional: Add a subtle radial glow from center */}
          <div className="absolute inset-0 radial-gradient-glow opacity-30 pointer-events-none"></div> 

          {/* Login Link */}
          <Link href="/login" legacyBehavior>
            <a className="absolute top-6 right-8 text-sm text-indigo-200 hover:text-white transition-colors z-20">
              Login
            </a>
          </Link>

          {/* Icon */}
          <SparklesIcon
            className="absolute top-6 left-8 h-7 w-7 text-indigo-200/80 z-20" /* Adjusted size/color */
            aria-hidden="true"
          />

          {/* Centered Content Area */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, ease: "easeOut" }}
             className="z-10 flex flex-col items-center w-full max-w-md text-center px-4"
          >
             {/* Headline - Enhanced Typography */}
             <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-indigo-300 mb-5 leading-tight tracking-tight shadow-sm">
               Emotional clarity when it matters most.
             </h1>

             {/* Subheadline - Enhanced Typography */}
             <p className="text-lg md:text-xl text-indigo-200/90 mb-10 font-light max-w-lg mx-auto leading-relaxed"> {/* Increased max-width, adjusted color/leading */}
               Turn confusion into connection. Find the perfect words, even when your heart is racing.
             </p>

             {/* CTA Button - Enhanced Style */}
             <Button
               onClick={() => router.push('/login')}
               size="lg"
               className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-3 text-lg font-medium rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1917] 
                          bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
                          hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 
                          focus:ring-purple-400 
                          text-white 
                          animate-pulse-slow" /* Added gradient, refined hover/focus, added pulse animation */
             >
               {/* Optional: Add icon back? <SparklesIcon className="w-5 h-5 mr-2 -ml-1" /> */}
               Get Clarity Now
             </Button>
          </motion.div>
        </div>
      </>
    );
  }
  // --- End Primer Screen ---

  // 3. Redirect Logic (Only if NOT showing primer AND userId is missing - defensive check)
  if (!userId) { // Should ideally not be reached if AuthGuard works, but safe check
      console.warn("IndexPage: Render attempted without userId after auth/primer checks. Redirecting.");
      router.push('/login'); 
      return ( // Return a minimal loading/redirect indicator
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E0E1A] to-[#14141F]">
              <p className="text-white/70">Redirecting...</p>
          </div>
      ); 
  }

  // --- If we reach here, authLoading is false, showPrimer is false, and userId MUST be valid ---

  // 4. Connection Error State
  if (connectionsError) {
    console.error("Error loading connections:", connectionsError);
    return (
      <DashboardLayout onNavigateToGuides={() => {}} onSelectGeneralChat={() => {}}> 
         <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Failed to Load Connections</h2>
            <p className="text-gray-400 mb-4">There was an error loading your connections. Please try refreshing the page.</p>
            <p className="text-xs text-gray-500">Error: {typeof connectionsError === 'string' ? connectionsError : (connectionsError as Error)?.message || 'Unknown error'}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Refresh Page</Button>
         </div>
      </DashboardLayout>
    );
  }

  // 5. Connections Loading State
  if (isLoadingConnections) {
    return (
      <DashboardLayout onNavigateToGuides={() => {}} onSelectGeneralChat={() => {}}> 
         <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-gray-400">Loading your connections...</p>
         </div>
      </DashboardLayout>
    );
  }

  // 6. Messages Error State (Currently only console logging)
  if (messagesError) {
     console.error("Error loading messages:", messagesError);
     // Consider adding UI feedback here later if needed
  }

  // --- Handler Functions --- (These can stay below hooks)
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
    if (!currentUser) {
      console.error("User object not available, cannot save connection.");
      throw new Error("Authentication error."); // Throw error to be caught in modal
    }
    console.log('Attempting to save connection:', { 
      userId: currentUser.uid, 
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
      await addConnection(currentUser, { 
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

  // Handle start conversation from welcome dialog
  const handleStartConversation = () => {
    // Select HeartGlow AI chat
    setSelectedConnectionId('heartglow-ai');
  };

  // --- FINAL RENDER: Main Dashboard --- 
  // All checks passed, render the main layout
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