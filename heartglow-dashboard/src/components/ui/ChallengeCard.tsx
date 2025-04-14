import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import for navigation
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import for calling Cloud Function
import { Gift, Sparkles, MessageSquareText, Users, Zap } from 'lucide-react'; // Import from lucide-react

// Helper function to map icon names to Lucide components
const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'SparklesIcon': return <Sparkles className="w-6 h-6" />;
    case 'GiftIcon': return <Gift className="w-6 h-6" />;
    case 'MessageSquareTextIcon': return <MessageSquareText className="w-6 h-6" />;
    case 'UsersIcon': return <Users className="w-6 h-6" />;
    case 'ZapIcon': return <Zap className="w-6 h-6" />;
    // Add more mappings based on your challengesData icon names
    default: return <Sparkles className="w-6 h-6" />; // Default icon
  }
};

// TODO: Define props based on Phase 1 Data Modeling (challenge data, user progress)
interface ChallengeCardProps {
  title?: string;
  description?: string;
  icon?: string; // Keep icon prop for flexibility, maybe map common names to specific icons later
  progress?: number;
  goal?: number;
  rewardXP?: number;
  rewardUnlock?: string | null;
  isDefinitionLoading?: boolean; // Added for loading state
  hasError?: boolean; // Added for error state
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title = "Loading Challenge...", // Updated placeholder
  description = "Loading details...",
  icon = "🌟", // Default icon
  progress = 0,
  goal = 1, // Ensure goal is at least 1 to avoid division by zero
  rewardXP = 0,
  rewardUnlock = null,
  isDefinitionLoading = false, // Default loading state
  hasError = false, // Default error state
}) => {
  const router = useRouter();
  const functions = getFunctions(); // Get Firebase Functions instance
  const [isSkipping, setIsSkipping] = useState(false); // Add skipping state

  // Prevent division by zero or negative goals
  const safeGoal = Math.max(1, goal || 1);
  const isCompleted = progress >= safeGoal;
  const progressPercent = Math.min((progress / safeGoal) * 100, 100);

  const handleStartChallenge = () => {
    // Navigate to the create page, potentially passing challenge context later
    router.push('/create');
  };

  const handleSkipChallenge = async () => {
    if (isSkipping) return; // Prevent double clicks
    setIsSkipping(true); // Set loading state
    console.log("Attempting to skip challenge...");
    try {
      const skipChallengeFunction = httpsCallable(functions, 'skipCurrentChallenge');
      // const result = await skipChallengeFunction();
      // console.log("Skip challenge function called successfully:", result);
      // TODO: Add user feedback (e.g., toast notification) and state update without reload

      // Set flag in sessionStorage before reloading
      sessionStorage.setItem('skippedChallenge', 'true');
      
      window.location.reload(); // Temporary refresh
    } catch (error) {
      console.error("Error calling skipCurrentChallenge function:", error);
      // TODO: Show user-facing error message
    } finally {
      setIsSkipping(false); // Unset loading state
    }
  };

  if (isDefinitionLoading) {
    // Optional: Render a specific loading skeleton or state
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 animate-pulse min-h-[200px]">
        {/* Skeleton structure */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-5"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-400 dark:bg-gray-600 rounded w-28"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (hasError) {
      // Optional: Render an error state
      return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-red-300 dark:border-red-700 min-h-[200px] flex flex-col justify-center items-center text-center">
              <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error Loading Challenge</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Could not load challenge details. Please try again later.</p>
          </div>
      );
  }

  return (
    // Enhanced card styling: more padding, subtle hover, gradient bg possibility
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-full transition-all duration-300 hover:shadow-xl">
      <div className="flex-grow"> {/* Allow content to grow */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
           <span className="text-2xl mr-3 text-indigo-400">{getIconComponent(icon)}</span> 
           {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-5 text-base">{description}</p>

        {/* Progress Section */} 
        <div className="mb-6">
           <div className="flex justify-between items-center mb-2">
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</p>
             <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{progress}/{safeGoal} {isCompleted ? '✅' : ''}</p>
           </div>
           {/* Thicker Progress Bar with animation */} 
           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                 className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                 style={{ width: `${progressPercent}%` }}
              ></div>
           </div>
        </div>

        {/* Rewards Section - Improved layout and icons */} 
        <div className="mb-6 flex items-center space-x-4 text-sm text-indigo-500 dark:text-indigo-300">
          <span className="flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 text-yellow-500" /> 
            <span className="font-medium">+{rewardXP} XP</span>
          </span>
          {rewardUnlock && (
            <span className="flex items-center border-l border-gray-300 dark:border-gray-600 pl-4">
              <Gift className="w-4 h-4 mr-1.5 text-purple-500" /> {/* Custom Gift Icon */}
              <span className="font-medium">{rewardUnlock.replace('templatePack:', '')} Pack</span>
            </span>
          )}
        </div>
      </div>

      {/* Actions Section - Updated Skip Button */}
      <div className="flex space-x-4 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
        <button
            onClick={handleStartChallenge}
            className={`flex-1 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 ${
              isCompleted
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white hover:from-indigo-700 hover:to-purple-800 shadow-md hover:shadow-lg'
            }`}
            disabled={isCompleted} // Disable if completed
        >
            {isCompleted ? 'Completed' : 'Start Challenge'}
        </button>
        <button
            onClick={handleSkipChallenge}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-900 flex items-center justify-center ${
              isCompleted || isSkipping
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            disabled={isCompleted || isSkipping} // Disable if completed or skipping
        >
          {isSkipping ? (
             // Simple spinner
             <svg className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
             'Skip'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard; 