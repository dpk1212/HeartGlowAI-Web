import { useState } from 'react';
import { motion } from 'framer-motion';

interface IntentStepProps {
  onNext: (data: { intent: string }) => void;
  onBack: () => void;
}

const intents = [
  {
    id: 'check-in',
    title: 'Check In',
    description: "A simple message to see how they're doing",
    icon: '👋'
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'Express appreciation for their presence in your life',
    icon: '🙏'
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Offer help or encouragement during tough times',
    icon: '💪'
  },
  {
    id: 'celebration',
    title: 'Celebration',
    description: 'Share joy for their achievements or milestones',
    icon: '🎉'
  },
  {
    id: 'reconnection',
    title: 'Reconnection',
    description: 'Reach out after some time apart',
    icon: '🤝'
  },
  {
    id: 'custom',
    title: 'Custom',
    description: 'Write your own message with a specific purpose',
    icon: '✍️'
  }
];

export default function IntentStep({ onNext, onBack }: IntentStepProps) {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  const handleSelect = (intentId: string) => {
    setSelectedIntent(intentId);
  };

  const handleNext = () => {
    if (selectedIntent) {
      onNext({ intent: selectedIntent });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What's the purpose of your message?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Select the intent that best matches your goal</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {intents.map((intent) => (
          <motion.div
            key={intent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedIntent === intent.id
                ? 'border-heartglow-pink bg-heartglow-pink/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-heartglow-pink'
            }`}
            onClick={() => handleSelect(intent.id)}
          >
            <div className="flex items-start space-x-4">
              <span className="text-2xl">{intent.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{intent.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{intent.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedIntent}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedIntent
              ? 'bg-heartglow-pink text-white hover:bg-heartglow-pink/90'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 