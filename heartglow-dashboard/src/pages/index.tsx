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
import { useChallenges, ChallengeDefinition } from '../hooks/useChallenges';

// This is now the main dashboard page, served at /dashboard/ due to basePath
const IndexPage: NextPage = () => {
  const { userProfile, loading: authLoading } = useAuth();
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

    // Create props for the ChallengeCard
    challengeCardProps = {
      title: activeChallengeDefinition?.name ?? activeUserChallenge.challengeId,
      description: activeChallengeDefinition?.description ?? (challengesError ? "Error loading details" : "Loading details..."),
      icon: activeChallengeDefinition?.icon,
      progress: activeUserChallenge.progress ?? 0, // Provide default value
      goal: activeChallengeDefinition?.criteria?.value ?? activeUserChallenge.goal ?? 1, // Use definition criteria if possible, fallback
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