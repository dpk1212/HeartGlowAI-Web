import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
// Import hooks/components needed to display growth data later
import { useAuth } from '../context/AuthContext';
// Import Lucide icons for visual enhancement
import { BarChart, CheckCheck, History, Sparkles, Flame, Users, MessageSquareText, Lightbulb } from 'lucide-react';

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* GlowScore Overview Card */}
                <div className="md:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700/80">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-400" /> GlowScore Overview
                  </h2>
                  <p className="text-4xl font-bold text-white mb-2">{userProfile.glowScoreXP ?? 0} <span className="text-2xl text-yellow-400">XP</span></p>
                  <p className="text-lg font-medium text-indigo-300 mb-4">Tier: {userProfile.glowScoreTier ?? '🌱 Opening Up'}</p>
                  {/* Placeholder for a simple progress bar towards next tier? */}
                  {/* <div className="w-full bg-gray-700 rounded-full h-2 mt-2"> <div className="bg-indigo-500 h-2 rounded-full" style={{width: '30%'}}></div> </div> */}
                </div>

                {/* Key Metrics Card */}
                <div className="md:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700/80">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-blue-400" /> Key Metrics
                  </h2>
                  <div className="space-y-3 text-gray-300">
                    <p className="flex items-center"><Flame className="w-4 h-4 mr-2 text-red-500" /> Current Streak: {userProfile.currentStreak ?? 0} Days</p>
                    <p className="flex items-center"><MessageSquareText className="w-4 h-4 mr-2 text-green-500" /> Total Messages Sent: {userProfile.totalMessageCount ?? 0}</p>
                    <p className="flex items-center"><Users className="w-4 h-4 mr-2 text-blue-500" /> Connections Reached (This Week): {userProfile.metrics?.uniqueConnectionsMessagedWeekly?.length ?? 0}</p>
                    <p className="flex items-center"><Lightbulb className="w-4 h-4 mr-2 text-purple-500" /> Reflections Completed: {userProfile.metrics?.reflectionsCompletedCount ?? 0}</p>
                  </div>
                </div>

                {/* Challenge History Card */}
                <div className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700/80">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <History className="w-5 h-5 mr-2 text-orange-400" /> Challenge History
                  </h2>
                  {(userProfile.challengeHistory && userProfile.challengeHistory.length > 0) ? (
                    <ul className="space-y-2">
                      {userProfile.challengeHistory.slice(-10).reverse().map((entry: any, index: number) => ( // Show last 10, newest first
                        <li key={index} className="text-gray-300 flex items-center text-sm p-2 bg-gray-700/50 rounded-md">
                          <CheckCheck size={16} className={`mr-2 ${entry.status === 'completed' ? 'text-green-400' : 'text-gray-500'}`} />
                          <span className="font-medium mr-2">{entry.challengeId}:</span> 
                          <span>Status: {entry.status}</span>
                          {/* Add dates if available: assignedDate, completedDate? */}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No challenges completed or skipped yet.</p>
                  )}
                  {/* TODO: Add pagination or link to full history if needed */}
                </div>
                
                {/* Placeholder for Future: Tone Analysis Card */}
                {/* <div className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700/80">
                  <h2 className="text-xl font-semibold text-white mb-4">Tone Analysis (Coming Soon)</h2>
                  <p className="text-gray-400">Insights into the emotional tones you use most often.</p>
                </div> */}
                
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