import React from 'react';
// Assuming Icons component exists or can be created
import { XpIcon, FireIcon, UsersIcon, MessageIcon, LightbulbIcon, ArrowRightIcon } from './Icons'; 

// TODO: Define props based on Phase 1 Data Modeling (user glowscore data)
interface GlowScoreSummaryCardProps {
  // placeholder props
  glowScoreXP?: number;
  currentTier?: string;
  streak?: number;
  connectionsReached?: number;
  messagesSentThisWeek?: number;
  reflectionsCompleted?: number;
  onViewGrowth?: () => void;
}

const GlowScoreSummaryCard: React.FC<GlowScoreSummaryCardProps> = ({
  glowScoreXP = 0, // Default to 0 if undefined
  currentTier = "🌱 Opening Up",
  streak = 0,
  connectionsReached = 0,
  messagesSentThisWeek = 0,
  reflectionsCompleted = 0,
  onViewGrowth = () => console.log('View My Emotional Growth clicked'), // Updated log
}) => {

  // Function to get tier color/style - customize as needed
  const getTierChipStyle = (tierName?: string): string => {
    // Example: Use colors based on tier, add more tiers
    if (tierName?.includes('Legacy Builder')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (tierName?.includes('HeartGuide')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    if (tierName?.includes('Communicator in Bloom')) return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
    if (tierName?.includes('Making Moves')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'; // Default for Opening Up
  };

  // TODO: Implement UI based on the design guide
  // - Card layout, dynamic tier display, metrics list, link/button
  return (
    // Enhanced card styling
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-full transition-all duration-300 hover:shadow-xl">
      {/* Title Section */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your GlowScore</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
           <XpIcon className="w-6 h-6 mr-2 text-yellow-500" /> 
           {glowScoreXP} XP
        </p>
      </div>

      {/* Tier Chip */}
      <div className="mb-6">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTierChipStyle(currentTier)}`}>
          {currentTier}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700 dark:text-gray-300 mb-6">
        <div className="flex items-center">
          <FireIcon className="w-4 h-4 mr-2 text-red-500" />
          <span>Streak: {streak} Days</span>
        </div>
        <div className="flex items-center">
          <UsersIcon className="w-4 h-4 mr-2 text-blue-500" />
          <span>Connections: {connectionsReached}</span>
        </div>
        <div className="flex items-center">
          <MessageIcon className="w-4 h-4 mr-2 text-green-500" />
          <span>Messages (Week): {messagesSentThisWeek}</span>
        </div>
        <div className="flex items-center">
          <LightbulbIcon className="w-4 h-4 mr-2 text-purple-500" />
          <span>Reflections: {reflectionsCompleted}</span>
        </div>
      </div>

      {/* Action Button - Styled properly */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
        <button 
          onClick={onViewGrowth} 
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          View My Emotional Growth 
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </button>
      </div>
       {/* TODO: Add motivational moments/text based on tier/progress */} 
    </div>
  );
};

export default GlowScoreSummaryCard; 