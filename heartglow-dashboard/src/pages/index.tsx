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
          <title>Never Overthink a Message Again | HeartGlow AI</title>
          <meta name="description" content="HeartGlow AI gives you instant emotional scripts, clarity guides, and coaching tools for your hardest conversations. Speak your truth and reconnect with confidence." />
        </Head>
        {/* Main container - Focused, cleaner background */}
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-950 via-black to-gray-900 text-white relative overflow-hidden font-sans">
          {/* Optional Subtle Background Pattern/Texture */}
          {/* <div className="absolute inset-0 bg-[url('/path/to/subtle-pattern.svg')] opacity-[0.03] z-0"></div> */}
          
          {/* Login & Logo Row */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-20">
            {/* Logo */} 
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-6 w-6 text-purple-300" />
              <span className="font-medium text-lg text-white">HeartGlow</span>
            </div>
            {/* Login Link */} 
            <Link href="/login?mode=login" legacyBehavior>
              <a className="px-4 py-1.5 text-sm font-medium text-purple-200 bg-white/5 rounded-md border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200">
                Login
              </a>
            </Link>
          </div>

          {/* Centered Content Area */} 
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
             className="z-10 flex flex-col items-center w-full max-w-4xl text-center px-4 relative mt-16 sm:mt-0"
          >
             {/* --- HERO IMAGE (Replaces Headline/Subheadline Text) --- */}
             <motion.img 
                src="/assets/primer-hero.png" 
                alt="HeartGlow - Stop Guessing, Start Connecting. AI guides for emotional clarity." 
                className="w-full max-w-xl md:max-w-2xl mb-10 rounded-lg shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              />
             {/* --- END HERO IMAGE --- */}
             
             {/* Product Description (Moved from removed subheadline) */}
             <p className="text-lg md:text-xl text-purple-200/80 mb-12 font-normal max-w-3xl mx-auto leading-relaxed">
               HeartGlow provides instant <strong className="text-white">emotional scripts, clarity guides,</strong> and <strong className="text-white">coaching tools</strong> — so you can speak your truth, reconnect, and move forward with confidence.
             </p>

             {/* --- VISUAL PLACEHOLDER REMOVED --- */}

             {/* 3. Benefit Blocks (Rewritten) */}
             <div className="mb-12 w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-purple-100/90 text-left">
                 {/* Benefit 1 - Updated Icon? Maybe check lucide-react for better ones */}
                 <div className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 space-x-3 min-h-[80px]">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                   <p className="text-base font-medium">Get real scripts for <strong className="text-white">real conversations</strong></p>
                 </div>
                 {/* Benefit 2 */} 
                 <div className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 space-x-3">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   <p className="text-base font-medium">Reconnect <strong className="text-white">without overthinking</strong></p>
                </div>
                 {/* Benefit 3 */} 
                 <div className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 space-x-3">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                   <p className="text-base font-medium">Track <strong className="text-white">emotional growth</strong> with AI insights</p>
                </div>
                 {/* Benefit 4 */} 
                 <div className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 space-x-3">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   <p className="text-base font-medium">New frameworks & guides <strong className="text-white">added weekly</strong></p>
                </div>
             </div>

             {/* 4. Ethical Social Proof (Placeholder - Replaces Quote) */}
             <div className="mb-12 w-full max-w-2xl mx-auto">
                 <p className="text-sm text-purple-200/70 italic">
                    Guides crafted for real-life challenges: apologies, boundaries, reconnections, expressing needs, and more.
                 </p>
             </div>

             {/* 5. Focused CTA Button & Conversion Booster */}
             <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex flex-col items-center">
               <Button
                 onClick={() => router.push('/login?cta=primer')}
                 size="lg"
                 className="px-12 py-4 text-lg font-semibold rounded-lg shadow-xl transition-colors duration-300 
                            bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 
                            hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 
                            focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black 
                            text-white mb-3"
               >
                 Unlock Emotional Clarity
               </Button>
              {/* Conversion Booster - More Prominent */}
              <p className="text-sm text-purple-300/80 font-medium">Free to start. No credit card required.</p>
             </motion.div>

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