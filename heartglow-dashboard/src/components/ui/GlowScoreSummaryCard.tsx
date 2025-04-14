import React from 'react';

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
  glowScoreXP = 220, // Default placeholders
  currentTier = "✨ Communicator in Bloom",
  streak = 5,
  connectionsReached = 6,
  messagesSentThisWeek = 12,
  reflectionsCompleted = 4,
  onViewGrowth = () => console.log('View My Emotional Growth'),
}) => {

  // TODO: Implement UI based on the design guide
  // - Card layout, dynamic tier display, metrics list, link/button
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Your GlowScore: {glowScoreXP} XP ✨</h3>
      <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">{currentTier}</p>

      {/* Placeholder for Metrics */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
        <p>🔥 Streak: {streak} Days</p>
        <p>🤝 Connections Reached: {connectionsReached}</p>
        <p>✉️ Messages Sent (This Week): {messagesSentThisWeek}</p>
        <p>💡 Reflections Completed: {reflectionsCompleted}</p>
      </div>

      {/* Placeholder for Action */} 
      <div>
        <button onClick={onViewGrowth} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
          View My Emotional Growth →
        </button>
      </div>
       {/* TODO: Add motivational moments/text based on tier/progress */} 
    </div>
  );
};

export default GlowScoreSummaryCard; 