import { useState } from 'react';
import { motion } from 'framer-motion';

interface ToneStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const ToneStep = ({ onNext, onBack, initialData }: ToneStepProps) => {
  const [selectedTone, setSelectedTone] = useState(initialData?.type || '');
  const [customTone, setCustomTone] = useState(initialData?.custom || '');
  const [showCustom, setShowCustom] = useState(false);

  const tones = [
    { id: 'warm', label: 'Warm', description: 'Friendly and affectionate' },
    { id: 'casual', label: 'Casual', description: 'Relaxed and informal' },
    { id: 'sincere', label: 'Sincere', description: 'Honest and heartfelt' },
    { id: 'playful', label: 'Playful', description: 'Light and fun' },
    { id: 'formal', label: 'Formal', description: 'Professional and respectful' },
    { id: 'reflective', label: 'Reflective', description: 'Thoughtful and introspective' },
    { id: 'custom', label: 'Custom', description: 'Define your own tone' }
  ];

  const handleSubmit = () => {
    onNext({
      tone: {
        type: selectedTone,
        custom: showCustom ? customTone : null
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What tone would you like to use?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Select the tone that best fits your message</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tones.map((tone) => (
          <motion.div
            key={tone.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedTone(tone.id);
              setShowCustom(tone.id === 'custom');
            }}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedTone === tone.id
                ? 'border-heartglow-pink bg-heartglow-pink/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-heartglow-pink'
            }`}
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{tone.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tone.description}</p>
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
            Describe your desired tone
          </label>
          <input
            type="text"
            value={customTone}
            onChange={(e) => setCustomTone(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            placeholder="e.g., Encouraging, Empathetic, etc."
            required
          />
        </motion.div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedTone || (showCustom && !customTone)}
          className={`px-4 py-2 rounded-lg font-medium ${
            !selectedTone || (showCustom && !customTone)
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-heartglow-pink text-white hover:bg-heartglow-pink/90'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ToneStep; 