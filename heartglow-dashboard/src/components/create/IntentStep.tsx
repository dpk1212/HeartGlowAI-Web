import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface IntentStepProps {
  onNext: (data: { intent: { type: string; custom?: string; } }) => void;
  onBack: () => void;
  initialData?: { type: string; custom?: string; };
}

const intents = [
  {
    id: 'check-in',
    title: 'Check In',
    description: "A simple message to see how they're doing",
    icon: '👋',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'Express appreciation for their presence in your life',
    icon: '🙏',
    color: 'from-heartglow-pink to-heartglow-violet'
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Offer help or encouragement during tough times',
    icon: '💪',
    color: 'from-green-400 to-teal-500'
  },
  {
    id: 'celebration',
    title: 'Celebration',
    description: 'Share joy for their achievements or milestones',
    icon: '🎉',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'reconnection',
    title: 'Reconnection',
    description: 'Reach out after some time apart',
    icon: '🤝',
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'custom',
    title: 'Custom',
    description: 'Write your own message with a specific purpose',
    icon: '✍️',
    color: 'from-gray-400 to-gray-600'
  }
];

export default function IntentStep({ onNext, onBack, initialData }: IntentStepProps) {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(initialData?.type || null);
  const [customIntent, setCustomIntent] = useState(initialData?.type === 'custom' ? initialData.custom || '' : '');
  const [showCustom, setShowCustom] = useState(initialData?.type === 'custom');

  useEffect(() => {
    if (initialData) {
      setSelectedIntent(initialData.type);
      const isCustom = initialData.type === 'custom';
      setShowCustom(isCustom);
      if (isCustom) {
        setCustomIntent(initialData.custom || '');
      }
    } else {
      setSelectedIntent(null);
      setCustomIntent('');
      setShowCustom(false);
    }
  }, [initialData]);

  const handleSelect = (intentId: string) => {
    setSelectedIntent(intentId);
    setShowCustom(intentId === 'custom');
  };

  const handleNext = () => {
    if (selectedIntent) {
      onNext({ 
        intent: {
          type: selectedIntent,
          custom: selectedIntent === 'custom' ? customIntent : undefined
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What's the purpose of your message?</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Select the intent that best matches your goal</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {intents.map((intent) => (
          <motion.div
            key={intent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedIntent === intent.id
                ? 'border-heartglow-pink bg-heartglow-pink/5 dark:bg-heartglow-pink/10 ring-2 ring-heartglow-pink'
                : 'border-gray-200 dark:border-gray-700 hover:border-heartglow-pink'
            }`}
            onClick={() => handleSelect(intent.id)}
          >
            <div className="flex items-start">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${intent.color} text-white text-2xl mr-3 shadow-sm`}>
                {intent.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{intent.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{intent.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showCustom && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your custom intent
          </label>
          <textarea
            value={customIntent}
            onChange={(e) => setCustomIntent(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
            placeholder="e.g., Invite to an event, ask for a favor..."
            rows={3}
            required={showCustom}
          />
        </motion.div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedIntent || (showCustom && !customIntent.trim())}
          className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink ${
            !selectedIntent || (showCustom && !customIntent.trim())
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-heartglow-pink hover:bg-heartglow-pink/90'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 