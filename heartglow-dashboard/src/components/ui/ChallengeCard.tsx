import React from 'react';
import { useRouter } from 'next/router'; // Import for navigation
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import for calling Cloud Function

// TODO: Define props based on Phase 1 Data Modeling (challenge data, user progress)
interface ChallengeCardProps {
  title?: string;
  description?: string;
  icon?: string; // Added icon prop
  progress?: number;
  goal?: number;
  rewardXP?: number;
  rewardUnlock?: string | null;
  // Removed onStart, onSkip props as handlers will be internal or use context
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title = "Loading Challenge...", // Updated placeholder
  description = "Loading details...",
  icon = "🌟", // Default icon
  progress = 0,
  goal = 1, // Ensure goal is at least 1 to avoid division by zero
  rewardXP = 0,
  rewardUnlock = null,
}) => {
  const router = useRouter();
  const functions = getFunctions(); // Get Firebase Functions instance

  const isCompleted = progress >= (goal || 1);
  const progressPercent = goal > 0 ? Math.min((progress / goal) * 100, 100) : 0;

  const handleStartChallenge = () => {
    // Navigate to the create page, potentially passing challenge context later
    router.push('/create');
  };

  const handleSkipChallenge = async () => {
    console.log("Attempting to skip challenge...");
    try {
       const skipChallengeFunction = httpsCallable(functions, 'skipChallenge');
       // No data needed to be passed if the function uses auth context for userId
       const result = await skipChallengeFunction();
       console.log("Skip challenge function called successfully:", result);
       // TODO: Add user feedback (e.g., toast notification)
       // UI will update automatically when AuthContext detects the profile change
    } catch (error) {
        console.error("Error calling skipChallenge function:", error);
        // TODO: Show user-facing error message
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-full"> {/* Added flex for layout */}
      <div className="flex-grow"> {/* Allow content to grow */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
           <span className="text-xl mr-2">{icon}</span> {/* Display Icon */}
           {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{description}</p>

        {/* Progress Section */} 
        <div className="mb-4">
           <div className="flex justify-between items-center mb-1">
             <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</p>
             <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{progress}/{goal} {isCompleted ? '✅' : ''}</p>
           </div>
           {/* Simple Progress Bar */} 
           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                 className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                 style={{ width: `${progressPercent}%` }}
              ></div>
           </div>
        </div>

        {/* Rewards Section */} 
        <div className="mb-4 text-sm text-indigo-600 dark:text-indigo-400">
          <span>Reward: +{rewardXP} XP</span>
          {rewardUnlock && <span className="ml-1"> | 🔓 <span className="font-medium">{rewardUnlock.replace('templatePack:', '')} Pack</span></span>}
        </div>
      </div>

      {/* Actions Section - Pushed to bottom */} 
      <div className="flex space-x-3 mt-auto pt-4"> {/* Added mt-auto to push down */}
        <button
            onClick={handleStartChallenge}
            className={`px-4 py-2 rounded text-sm font-medium ${isCompleted ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            disabled={isCompleted} // Disable if completed
        >
            {isCompleted ? 'Completed' : 'Start Challenge'}
        </button>
        <button
            onClick={handleSkipChallenge}
            className={`px-4 py-2 rounded text-sm font-medium ${isCompleted ? 'bg-gray-400 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
            disabled={isCompleted} // Disable if completed
        >
            Skip
        </button>
      </div>

      {/* Removed explicit completed message, handled by button state and checkmark */} 
    </div>
  );
};

export default ChallengeCard; 