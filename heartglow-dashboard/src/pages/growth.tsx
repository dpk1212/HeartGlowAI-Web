import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
// Import hooks/components needed to display growth data later
import { useAuth } from '../context/AuthContext';

const GrowthPage: NextPage = () => {
  const { userProfile, loading } = useAuth();

  // TODO: Fetch additional historical data if needed

  return (
    <>
      <Head>
        <title>HeartGlow AI | My Growth</title>
        <meta name="description" content="Track your emotional growth journey with HeartGlow AI" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-heartglow-pink to-heartglow-violet mb-8">
              My Emotional Growth
            </h1>

            {loading ? (
              <div className="text-center text-gray-400">Loading growth data...</div>
            ) : userProfile ? (
              <div className="space-y-6">
                {/* Placeholder Content - Replace with actual data display */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-md border border-gray-700/50">
                  <h2 className="text-xl font-semibold text-white mb-4">GlowScore Overview</h2>
                  <p>Current Score: {userProfile.glowScoreXP ?? 0} XP</p>
                  <p>Current Tier: {userProfile.glowScoreTier ?? 'N/A'}</p>
                  {/* Add charts or trends here later */}
                </div>

                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-md border border-gray-700/50">
                  <h2 className="text-xl font-semibold text-white mb-4">Challenge History</h2>
                  {userProfile.challengeHistory && userProfile.challengeHistory.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {userProfile.challengeHistory.map((entry: any, index: number) => (
                        <li key={index}>{entry.challengeId} ({entry.status})</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No challenges completed or skipped yet.</p>
                  )}
                </div>
                
                {/* Add more sections for metrics, tone analysis, etc. */}
                
              </div>
            ) : (
              <div className="text-center text-red-400">Could not load user profile data.</div>
            )}
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default GrowthPage; 