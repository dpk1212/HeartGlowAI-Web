import React, { useState } from 'react';
import { ChallengeDefinition } from '../../hooks/useChallenges'; // Assuming type is exported here
import { Gift, Sparkles, MessageSquareText, Users, Zap, CheckCircle } from 'lucide-react'; // Add CheckCircle

// Helper to get icon (simplified version, can be expanded)
const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'SparklesIcon': return <Sparkles className="w-8 h-8" />;
    case 'GiftIcon': return <Gift className="w-8 h-8" />;
    case 'MessageSquareTextIcon': return <MessageSquareText className="w-8 h-8" />;
    case 'UsersIcon': return <Users className="w-8 h-8" />;
    case 'ZapIcon': return <Zap className="w-8 h-8" />;
    // Add more mappings based on your challengesData icon names
    default: return <Sparkles className="w-8 h-8" />; // Default icon
  }
};

interface ChallengeSelectionProps {
  availableChallenges: ChallengeDefinition[];
  onSelectChallenge: (challengeId: string) => Promise<void>; // Make it async
  isLoading: boolean; // Prop to know if selection is in progress
}

const ChallengeSelection: React.FC<ChallengeSelectionProps> = ({
  availableChallenges,
  onSelectChallenge,
  isLoading,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = async (id: string) => {
    if (isLoading) return; // Prevent multiple clicks while loading
    setSelectedId(id); // Visually indicate selection
    try {
      await onSelectChallenge(id);
      // Success! The parent component (index.tsx) should handle the UI update
      // by reacting to the userProfile change.
    } catch (error) {
      console.error("Error selecting challenge from component:", error);
      setSelectedId(null); // Reset visual selection on error
      // TODO: Show user-facing error message
    }
  };

  // Display only the first 3 challenges for selection
  const challengesToShow = availableChallenges.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[200px]">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Choose Your Next Challenge</h3>
      {availableChallenges.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No new challenges available right now. Check back later!</p>
      ) : (
        <div className="space-y-4">
          {challengesToShow.map((challenge) => (
            <div 
              key={challenge.id}
              className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600/50 flex items-center space-x-4"
            >
              <div className="flex-shrink-0 text-indigo-500 dark:text-indigo-400">
                {getIconComponent(challenge.icon)}
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{challenge.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{challenge.description}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">+ {challenge.rewardXP || 0} XP</p>
              </div>
              <button 
                onClick={() => handleSelect(challenge.id)}
                disabled={isLoading && selectedId === challenge.id} // Disable specific button during its loading
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex-shrink-0 ${
                    isLoading && selectedId === challenge.id
                    ? 'bg-gray-300 dark:bg-gray-500 text-gray-500 dark:text-gray-300 cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isLoading && selectedId === challenge.id ? (
                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 ) : (
                   'Select'
                 )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengeSelection; 