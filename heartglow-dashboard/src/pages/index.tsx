import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

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
import { useAuth } from '../context/AuthContext';
// Explicitly import the type
import type { AuthContextType } from '../context/AuthContext'; 
import { useChallenges, ChallengeDefinition } from '../hooks/useChallenges';
// Import Firebase auth methods needed for token
import { getAuth, getIdToken } from "firebase/auth";

// This is now the main dashboard page, served at /dashboard/ due to basePath
const IndexPage: NextPage = () => {
  // Use the explicitly imported type for assertion (optional but can help diagnostics)
  const { currentUser: user, userProfile, loading: authLoading } = useAuth();
  const { challenges: challengeDefs, loading: challengesLoading, error: challengesError } = useChallenges();

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
  };

  // --- Skip Challenge Handler (Updated) ---
  const handleSkipChallenge = async () => {
    if (!user) {
      console.error("Cannot skip: User not authenticated");
      // TODO: Show error to user
      return;
    }
    console.log("Attempting to skip challenge via HTTPS...");
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
              console.log("Skip challenge function result (JSON):", result);
          } else {
              // Handle non-JSON success responses if any (shouldn't happen with current function)
              result = await response.text(); 
              console.log("Skip challenge function result (text):", result); 
          }
      } catch (parseError) {
          console.error("Error parsing skip challenge response:", parseError);
          // Decide how to proceed if JSON parsing fails despite response.ok
          // Maybe treat as success but log the parsing error
      }

      // --- IMPORTANT: Refresh user data --- 
      // After successfully skipping, the userProfile state needs to be updated
      // This usually requires triggering a refetch in your AuthContext or manually updating it.
      // For now, let's assume a simple refresh action might be available (e.g., refetchUserProfile)
      // OR trigger a page reload as a basic way to refresh data:
      window.location.reload(); 
      // A more sophisticated approach would be better (e.g., optimistic update + context refetch)

    } catch (error) {
      console.error("Error calling skipCurrentChallenge function:", error);
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
            {/* Conditionally render ChallengeCard based on calculated props */}
            {challengeCardProps ? (
              <ChallengeCard {...challengeCardProps} />
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center min-h-[150px]">
                <p>No active challenge assigned yet.<br/> A new one will appear soon!</p> {/* Updated message */}
              </div>
            )}
            <GlowScoreSummaryCard {...glowScoreData} />
            <QuickTemplateGrid />
            <CoachingEntryCard />
            <ConnectionsCarousel />
            <ComingSoonCard />
            <div className="md:col-span-2">
              <RecentMessagesList />
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default IndexPage; 