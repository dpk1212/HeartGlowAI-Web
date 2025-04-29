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
          <title>HeartGlow AI | Emotional Clarity & Connection</title>
          <meta name="description" content="Turn relationship confusion into connection. HeartGlow helps you find the perfect words, even when emotions run high." />
        </Head>
        {/* Main container - Dark sophisticated background */}
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white relative overflow-hidden font-sans">
          {/* --- Placeholder: Compelling Background Visual --- */}
          {/* Consider a subtle, abstract background video or high-quality image related to connection/clarity */}
          {/* <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10 z-0"> <source src="/path/to/background.mp4" type="video/mp4" /> </video> */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0"></div> {/* Subtle bottom fade for contrast */}

          {/* Login & Logo Row */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-20">
            {/* Logo Placeholder */} 
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-6 w-6 text-purple-300" />
              <span className="font-medium text-lg text-white">HeartGlow</span>
            </div>
            {/* Login Link */} 
            <Link href="/login" legacyBehavior>
              <a className="px-4 py-1.5 text-sm font-medium text-purple-200 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200">
                Login
              </a>
            </Link>
          </div>

          {/* Centered Content Area */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} // Smoother ease-out
             className="z-10 flex flex-col items-center w-full max-w-3xl text-center px-4 relative mt-16 sm:mt-0" // Adjusted max-width and margin-top
          >
             {/* 1. Headline - Punchy & Clear */}
             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-white mb-5 leading-tight tracking-tight">
               Stop Guessing, Start Connecting.
             </h1>

             {/* 2. Subheadline - Elaborate on Problem/Solution */}
             <p className="text-lg md:text-xl text-purple-200/90 mb-10 font-normal max-w-2xl mx-auto leading-relaxed">
               Find emotional clarity when it matters most. HeartGlow's AI guides you to express yourself effectively, turning confusion and conflict into understanding and connection.
             </p>

             {/* 3. Benefits Section - Enhanced Styling */}
             <div className="mb-12 w-full max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-purple-100/90 text-center">
                <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg border border-white/10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                   <p className="text-base font-medium">Craft Clear Messages</p>
                </div>
                 <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg border border-white/10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   <p className="text-base font-medium">Reduce Conflict</p>
                </div>
                 <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg border border-white/10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mb-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                   <p className="text-base font-medium">Build Stronger Bonds</p>
                </div>
             </div>

             {/* 4. Social Proof / Trust Section (Placeholder Refined) */}
             <div className="mb-12 w-full max-w-lg mx-auto p-5 bg-white/5 rounded-lg border border-white/10">
                <p className="text-base text-purple-200/80 italic leading-relaxed">"This actually works. I was skeptical, but HeartGlow helped me say what I needed to say without starting a fight. Game changer for my relationship."</p>
                <p className="mt-3 text-sm font-medium text-white text-right">- Real User Review</p>
                {/* --- Placeholder: Add more testimonials (carousel?) or logos below --- */}
             </div>

             {/* 5. Focused CTA Button - More Polish */}
             <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
               <Button
                 onClick={() => router.push('/login?cta=primer')}
                 size="lg"
                 className="px-12 py-4 text-lg font-semibold rounded-lg shadow-xl transition-colors duration-300 
                            bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 
                            hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 
                            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black 
                            text-white"
               >
                 Unlock Emotional Clarity
               </Button>
              </motion.div>

              {/* Optional: Add subtle note about free/no card needed? */} 
              <p className="mt-4 text-xs text-purple-300/60">Free to start. No credit card required.</p>

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