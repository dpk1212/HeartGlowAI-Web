import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
import HeroSection from '../components/ui/HeroSection';
import QuickTemplateGrid from '../components/ui/QuickTemplateGrid';
import ConnectionsCarousel from '../components/ui/ConnectionsCarousel';
import RecentMessagesList from '../components/ui/RecentMessagesList';
import ComingSoonCard from '../components/ui/ComingSoonCard';
import CoachingEntryCard from '../components/ui/CoachingEntryCard';
import ChallengeCard from '../components/ui/ChallengeCard';
import GlowScoreSummaryCard from '../components/ui/GlowScoreSummaryCard';
import ChallengeSelection from '../components/ui/ChallengeSelection';
import { useAuth } from '../context/AuthContext';
// Explicitly import the type
import type { AuthContextType } from '../context/AuthContext'; 
import { useChallenges, ChallengeDefinition } from '../hooks/useChallenges';
// Import Firebase auth methods needed for token
import { getAuth, getIdToken } from "firebase/auth";
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import for calling selectChallenge
import Confetti from 'react-confetti'; // Import confetti library
import useWindowSize from '../hooks/useWindowSize'; // Import hook for confetti dimensions

// This is now the main dashboard page, served at /dashboard/ due to basePath
const IndexPage: NextPage = () => {
  // Use the explicitly imported type for assertion (optional but can help diagnostics)
  const { currentUser: user, userProfile, loading: authLoading } = useAuth();
  const { challenges: challengeDefs, loading: challengesLoading, error: challengesError } = useChallenges();
  const [isChallengeActionLoading, setIsChallengeActionLoading] = useState(false); // Loading state for select/skip
  const router = useRouter(); // Import and use useRouter for navigation
  const { width, height } = useWindowSize(); // Get window size for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevChallengeId, setPrevChallengeId] = useState<string | null | undefined>(undefined);

  // Effect to detect challenge completion for animation
  useEffect(() => {
    // --- Check for immediate completion flag FIRST ---
    const completedFlagValue = sessionStorage.getItem('challengeCompleted');
    const completedTimestamp = sessionStorage.getItem('challengeCompletedTimestamp');
    
    console.log(`[ConfettiEffect] Checking sessionStorage for challengeCompleted flag. Value: ${completedFlagValue}, Timestamp: ${completedTimestamp}`);
    
    if (completedFlagValue === 'true') {
      // Check if the completion flag is fresh (within last 5 minutes)
      const isTimestampValid = completedTimestamp && 
          (Date.now() - parseInt(completedTimestamp)) < 5 * 60 * 1000;
      
      if (!completedTimestamp || isTimestampValid) {
        console.log('[ConfettiEffect] Detected valid completion flag. Triggering confetti!');
        setShowConfetti(true);
      } else {
        console.log('[ConfettiEffect] Found stale completion flag. Ignoring.');
      }
      
      // Clear the flags regardless
      sessionStorage.removeItem('challengeCompleted');
      sessionStorage.removeItem('challengeCompletedTimestamp');
      
      // Return early - we've handled the direct flag case
      return;
    }
    // ----------------------------------------------------

    // No direct completion flag present, check for challenge state changes
    const currentChallengeId = userProfile?.activeChallenge?.challengeId;
    
    console.log("[ConfettiEffect] Running state change check.", { 
        prevChallengeId,
        currentChallengeId,
        authLoading,
        profileExists: !!userProfile 
    });

    // Only proceed with checks if we have loaded user data
    if (authLoading || prevChallengeId === undefined) {
      console.log('[ConfettiEffect] Still loading or first render, skipping state change check');
      
      // Initialize prevChallengeId on first load, but don't trigger effects
      if (!authLoading && prevChallengeId === undefined) {
        console.log('[ConfettiEffect] Setting initial challenge ID:', currentChallengeId ?? null);
        setPrevChallengeId(currentChallengeId ?? null);
      }
      return;
    }

    // Important: Check if previously there WAS an active challenge and now there is NONE
    // This would indicate a completed challenge (unless it was skipped)
    if (prevChallengeId && !currentChallengeId) {
      console.log('[ConfettiEffect] Potential completion detected: Had previous challenge, now have none.');
      
      // Check if this was due to a skip action
      const wasSkipped = sessionStorage.getItem('skippedChallenge') === 'true';
      
      if (wasSkipped) {
        console.log('[ConfettiEffect] Challenge was explicitly skipped, suppressing confetti.');
        sessionStorage.removeItem('skippedChallenge'); // Clear the skip flag
      } else {
        // Not skipped - must have been completed! Show confetti
        console.log('[ConfettiEffect] Challenge completed naturally. Triggering confetti!');
        setShowConfetti(true);
      }
    }

    // Always update previous challenge ID for the next state change check
    // (but only when user data is fully loaded to avoid false positives)
    if (!authLoading && currentChallengeId !== prevChallengeId) {
      console.log('[ConfettiEffect] Updating prevChallengeId from', prevChallengeId, 'to', currentChallengeId ?? null);
      setPrevChallengeId(currentChallengeId ?? null);
    }
  }, [userProfile?.activeChallenge, authLoading, prevChallengeId]); // Dependencies

  // Combined loading state: wait for both user profile and challenge definitions
  const isLoading = authLoading || challengesLoading;

  // Early return for loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          Loading Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  // Data is loaded, proceed with calculations
  const activeUserChallenge = userProfile?.activeChallenge;
  let challengeCardProps = null; // Initialize as null

  if (activeUserChallenge) {
    // Find the definition only if the user has an active challenge
    const activeChallengeDefinition = challengeDefs.find(def => def.id === activeUserChallenge.challengeId);

    // Safely determine the goal, prioritizing the active challenge data, 
    // but using definition criteria value only if it's numeric and relevant.
    let goalValue = activeUserChallenge.goal ?? 1;
    if (activeChallengeDefinition?.criteria?.type === 'sendMessageToMultiple' && 
        typeof activeChallengeDefinition.criteria.value === 'number') {
        goalValue = activeChallengeDefinition.criteria.value;        
    }
    goalValue = Math.max(1, goalValue); // Ensure goal is at least 1

    // Create props for the ChallengeCard
    challengeCardProps = {
      title: activeChallengeDefinition?.name ?? activeUserChallenge.challengeId,
      description: activeChallengeDefinition?.description ?? (challengesError ? "Error loading details" : "Loading details..."),
      icon: activeChallengeDefinition?.icon,
      progress: activeUserChallenge.progress ?? 0, // Provide default value
      goal: goalValue, // Use the safely determined goalValue
      rewardXP: activeChallengeDefinition?.rewardXP ?? activeUserChallenge.rewardXP ?? 0,
      rewardUnlock: activeChallengeDefinition?.rewardUnlock ?? activeUserChallenge.rewardUnlock,
      // Add a loading state specifically for the card if definition is missing after load
      isDefinitionLoading: !activeChallengeDefinition && !challengesError,
      // Add error state if needed
      hasError: !!challengesError
    };
  }

  // Prepare GlowScore data (can be done even if challenge is loading)
  const glowScoreData = {
     glowScoreXP: userProfile?.glowScoreXP ?? 0,
     currentTier: userProfile?.glowScoreTier ?? '🌱 Opening Up',
     streak: userProfile?.currentStreak ?? 0,
     connectionsReached: userProfile?.metrics?.uniqueConnectionsMessagedWeekly?.length ?? 0,
     messagesSentThisWeek: userProfile?.metrics?.weeklyMessageCount ?? 0,
     reflectionsCompleted: userProfile?.metrics?.reflectionsCompletedCount ?? 0,
     // Add the navigation handler
     onViewGrowth: () => router.push('/growth') 
  };

  // Filter available challenges for selection (exclude recent history)
  const challengeHistoryIds = userProfile?.challengeHistory?.slice(-5).map((h: any) => h.challengeId) || [];
  const availableChallengesForSelection = challengeDefs.filter(
      (def) => !challengeHistoryIds.includes(def.id) && def.id !== activeUserChallenge?.challengeId
  );

  // --- Select Challenge Handler ---
  const handleSelectChallenge = async (challengeId: string) => {
    if (!user) {
      console.error("Cannot select: User not authenticated");
      // TODO: Show error to user
      return;
    }
    setIsChallengeActionLoading(true);
    console.log(`Attempting to select challenge ${challengeId}...`);
    try {
      const functions = getFunctions();
      const selectChallengeFunction = httpsCallable(functions, 'selectChallenge');
      const result = await selectChallengeFunction({ challengeId });
      console.log("Select challenge function result:", result);
      // SUCCESS! 
      // Ideally, update AuthContext state here instead of reloading.
      // For now, Firestore listener in AuthContext should pick up the change,
      // but a manual refetch or optimistic update would be better.
      // Let the listener handle it for now (might have slight delay).
      // window.location.reload(); // Avoid reload if listener works
    } catch (error) {
      console.error("Error calling selectChallenge function:", error);
      // TODO: Show error to user
    } finally {
      setIsChallengeActionLoading(false);
    }
  };

  // --- Skip Challenge Handler (Updated) ---
  const handleSkipChallenge = async () => {
    if (!user) {
      console.error("Cannot skip: User not authenticated");
      // TODO: Show error to user
      return;
    }
    
    // IMPORTANT: Set skip flag BEFORE making the API call
    // This ensures the confetti effect won't trigger even if the page refreshes
    console.log('[handleSkipChallenge] Setting skippedChallenge flag in sessionStorage');
    sessionStorage.setItem('skippedChallenge', 'true');
    
    console.log("[handleSkipChallenge] Attempting to skip challenge via HTTPS...");
    try {
      const idToken = await getIdToken(user); // Get the ID token
      const functionUrl = `https://us-central1-heartglowai.cloudfunctions.net/skipCurrentChallenge`; // Ensure function name is correct

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        // No body needed for skip, based on current function
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      // Attempt to parse JSON, handle potential errors
      let result = {};
      try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
              result = await response.json();
              console.log("[handleSkipChallenge] Skip challenge function result (JSON):", result);
          } else {
              // Handle non-JSON success responses if any (shouldn't happen with current function)
              result = await response.text(); 
              console.log("[handleSkipChallenge] Skip challenge function result (text):", result); 
          }
      } catch (parseError) {
          console.error("Error parsing skip challenge response:", parseError);
          // Decide how to proceed if JSON parsing fails despite response.ok
          // Maybe treat as success but log the parsing error
      }

      // The AuthContext listener should update the profile eventually.
      console.log("[handleSkipChallenge] Skip successful, navigating back to dashboard");
      router.push('/'); // Navigate to base path (which is /dashboard)
      
    } catch (error) {
      console.error("Error calling skipCurrentChallenge function:", error);
      // Remove the flag if the skip failed
      sessionStorage.removeItem('skippedChallenge');
      // TODO: Show error to user
    }
  };
  // --- End Skip Challenge Handler ---

  // Make sure to pass handleSkipChallenge to the ChallengeCard if it accepts it
  /* // Removed - ChallengeCard uses its own internal handler
  if (challengeCardProps) {
      challengeCardProps.onSkip = handleSkipChallenge; // Add the handler to props
  }
  */

  return (
    <>
      <Head>
        <title>HeartGlow AI | Dashboard</title>
        <meta name="description" content="HeartGlow AI Dashboard - Craft messages with emotional intelligence" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <HeroSection />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HeartGlow Guide spanning both columns right after hero section */}
            <div className="md:col-span-2">
              <CoachingEntryCard />
            </div>
            
            {/* Conditionally render ChallengeCard or ChallengeSelection */}
            {activeUserChallenge ? (
              // Pass challengeCardProps if it exists (means active challenge is loaded)
              challengeCardProps ? <ChallengeCard {...challengeCardProps} /> : <div>Loading challenge card...</div>
            ) : challengesLoading ? (
              // Show loading state while challenges are loading for selection
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 animate-pulse min-h-[200px]">
                 <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
                 <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                 <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ) : (
              // Show selection component if no active challenge and definitions are loaded
              <ChallengeSelection 
                availableChallenges={availableChallengesForSelection} 
                onSelectChallenge={handleSelectChallenge} 
                isLoading={isChallengeActionLoading}
              />
            )}
            <GlowScoreSummaryCard {...glowScoreData} />
            <QuickTemplateGrid />
            <ConnectionsCarousel />
            <ComingSoonCard />
            <div className="md:col-span-2">
              <RecentMessagesList />
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>

      {/* Confetti Animation Overlay */} 
      {showConfetti && 
        <Confetti 
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          onConfettiComplete={() => setShowConfetti(false)} // Stop rendering when complete
        />
      }
    </>
  );
};

export default IndexPage; 