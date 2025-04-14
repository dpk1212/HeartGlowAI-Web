import React from 'react';

// TODO: Define props based on Phase 1 Data Modeling (challenge data, user progress)
interface ChallengeCardProps {
  // placeholder props
  title?: string;
  description?: string;
  progress?: number;
  goal?: number;
  rewardXP?: number;
  rewardUnlock?: string | null;
  onStart?: () => void;
  onSkip?: () => void;
  onTrackProgress?: () => void; // Or maybe this is implicit in the display?
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title = "This Week's Challenge", // Default placeholders
  description = "Reconnect with someone you haven't spoken to in a while.",
  progress = 0,
  goal = 2,
  rewardXP = 50,
  rewardUnlock = "Gratitude Template Pack",
  onStart = () => console.log('Start Challenge'),
  onSkip = () => console.log('Skip Challenge'),
  onTrackProgress = () => console.log('Track Progress'),
}) => {
  const isCompleted = progress >= goal;

  // TODO: Implement UI based on the design guide
  // - Card layout, text, progress bar/indicator, buttons, completion animation
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{/* TODO: Add Icon/Emoji */} {title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>

      {/* Placeholder for Progress */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Progress: {progress}/{goal} messages sent {isCompleted ? '✅' : ''}</p>
        {/* TODO: Add a visual progress bar */}
      </div>

      {/* Placeholder for Rewards */}
      <div className="mb-4 text-sm text-indigo-600 dark:text-indigo-400">
        <span>Reward: +{rewardXP} XP</span>
        {rewardUnlock && <span> | 🔓 Unlock: {rewardUnlock}</span>}
      </div>

      {/* Placeholder for Actions */}
      <div className="flex space-x-3">
        <button onClick={onStart} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium">Start Challenge</button>
        <button onClick={onSkip} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-medium">Skip</button>
        {/* <button onClick={onTrackProgress} className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm">Track Progress</button> */} 
      </div>

      {isCompleted && (
        <p className="mt-3 text-green-600 dark:text-green-400 font-medium">Challenge Completed! 🎉</p>
        // TODO: Add confetti effect 
      )}
    </div>
  );
};

export default ChallengeCard; 