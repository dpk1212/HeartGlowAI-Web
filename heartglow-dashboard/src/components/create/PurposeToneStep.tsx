import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Types and Constants from IntentStep ---
const intents = [
  { id: 'check-in', title: 'Check In', description: "Simple message to see how they're doing", icon: '👋', color: 'from-blue-400 to-blue-600' },
  { id: 'gratitude', title: 'Gratitude', description: 'Express appreciation', icon: '🙏', color: 'from-heartglow-pink to-heartglow-violet' },
  { id: 'support', title: 'Support', description: 'Offer help or encouragement', icon: '💪', color: 'from-green-400 to-teal-500' },
  { id: 'celebration', title: 'Celebration', description: 'Share joy for achievements', icon: '🎉', color: 'from-yellow-400 to-orange-500' },
  { id: 'reconnection', title: 'Reconnection', description: 'Reach out after time apart', icon: '🤝', color: 'from-purple-400 to-indigo-500' },
  { id: 'custom_intent', title: 'Custom Intent', description: 'Define your specific purpose', icon: '✍️', color: 'from-gray-400 to-gray-600' }
];

interface IntentData {
  type: string;
  custom?: string;
}

// --- Types and Constants from ToneStep ---
const tones = [
  { id: 'warm', label: 'Warm', description: 'Friendly and affectionate' },
  { id: 'casual', label: 'Casual', description: 'Relaxed and informal' },
  { id: 'sincere', label: 'Sincere', description: 'Honest and heartfelt' },
  { id: 'playful', label: 'Playful', description: 'Light and fun' },
  { id: 'formal', label: 'Formal', description: 'Professional and respectful' },
  { id: 'reflective', label: 'Reflective', description: 'Thoughtful and introspective' },
  { id: 'custom_tone', label: 'Custom Tone', description: 'Define your own tone' }
];

// --- Combined Props and Data Structure ---
interface PurposeToneData {
  intent: IntentData | null;
  tone: string | null;
}

interface PurposeToneStepProps {
  onNext: (data: PurposeToneData) => void;
  onBack: () => void;
  initialData?: Partial<PurposeToneData> | null;
}

const PurposeToneStep: React.FC<PurposeToneStepProps> = ({ onNext, onBack, initialData }) => {
  // --- State Management ---
  const [selectedIntent, setSelectedIntent] = useState<string | null>(initialData?.intent?.type || null);
  const [customIntent, setCustomIntent] = useState(initialData?.intent?.type === 'custom_intent' ? initialData.intent.custom || '' : '');
  const [showCustomIntent, setShowCustomIntent] = useState(initialData?.intent?.type === 'custom_intent');

  const isStandardTone = (toneId: string | null | undefined): boolean =>
    !!toneId && tones.some(t => t.id === toneId && t.id !== 'custom_tone');

  const initialIsCustomTone = initialData?.tone ? !isStandardTone(initialData.tone) : false;
  const [selectedTone, setSelectedTone] = useState<string | null>(initialIsCustomTone ? 'custom_tone' : initialData?.tone || null);
  const [customTone, setCustomTone] = useState(initialIsCustomTone ? initialData?.tone || '' : '');
  const [showCustomTone, setShowCustomTone] = useState(initialIsCustomTone);

  // --- Effects to handle initial data ---
  useEffect(() => {
    if (initialData) {
      // Intent
      const intentType = initialData.intent?.type || null;
      setSelectedIntent(intentType);
      const isCustomIntent = intentType === 'custom_intent';
      setShowCustomIntent(isCustomIntent);
      setCustomIntent(isCustomIntent ? initialData.intent?.custom || '' : '');

      // Tone
      const toneValue = initialData.tone || null;
      const isCustomTone = toneValue ? !isStandardTone(toneValue) : false;
      setSelectedTone(isCustomTone ? 'custom_tone' : toneValue);
      setShowCustomTone(isCustomTone);
      setCustomTone(isCustomTone ? toneValue || '' : '');

    } else {
      // Reset if no initialData
      setSelectedIntent(null);
      setCustomIntent('');
      setShowCustomIntent(false);
      setSelectedTone(null);
      setCustomTone('');
      setShowCustomTone(false);
    }
  }, [initialData]);


  // --- Event Handlers ---
  const handleIntentSelect = (intentId: string) => {
    setSelectedIntent(intentId);
    setShowCustomIntent(intentId === 'custom_intent');
  };

  const handleToneSelect = (toneId: string) => {
    setSelectedTone(toneId);
    setShowCustomTone(toneId === 'custom_tone');
    if (toneId !== 'custom_tone') {
      setCustomTone(''); // Clear custom tone if a standard one is selected
    }
  };

  const handleSubmit = () => {
    const finalIntent: IntentData | null = selectedIntent
      ? {
          type: selectedIntent,
          custom: selectedIntent === 'custom_intent' ? customIntent.trim() : undefined
        }
      : null;

    const finalTone: string | null = selectedTone
      ? (showCustomTone ? customTone.trim() : selectedTone)
      : null;

    if (finalIntent && finalTone) {
      onNext({ intent: finalIntent, tone: finalTone });
    } else {
       console.warn("Intent or Tone not selected"); // Or show UI feedback
    }
  };

  const isNextDisabled = !selectedIntent || (showCustomIntent && !customIntent.trim()) || !selectedTone || (showCustomTone && !customTone.trim());

  // --- Render Logic ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 dark:text-heartglow-offwhite"
    >
      {/* Intent Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Purpose</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">What's the main goal of your message?</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {intents.map((intent) => (
            <motion.div
              key={intent.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-start ${
                selectedIntent === intent.id
                  ? 'border-transparent ring-2 ring-heartglow-pink bg-gradient-to-br from-heartglow-pink/10 via-white to-heartglow-violet/10 dark:from-heartglow-pink/40 dark:to-heartglow-violet/40'
                  : 'bg-white border-gray-200 hover:border-heartglow-pink/80 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-heartglow-pink'
              }`}
              onClick={() => handleIntentSelect(intent.id)}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${intent.color} text-white text-xl mr-3 shadow-sm flex-shrink-0`}>
                {intent.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-heartglow-offwhite">{intent.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{intent.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {showCustomIntent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <label htmlFor="custom-intent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe your custom intent:
            </label>
            <textarea
              id="custom-intent"
              value={customIntent}
              onChange={(e) => setCustomIntent(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent resize-none dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="e.g., Invite to an event, ask for a favor..."
              rows={2}
              required={showCustomIntent}
            />
          </motion.div>
        )}
      </div>

       {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-700"/>

      {/* Tone Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tone</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">How should the message feel?</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tones.map((tone) => (
            <motion.div
              key={tone.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToneSelect(tone.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedTone === tone.id
                  ? 'border-transparent ring-2 ring-heartglow-violet bg-gradient-to-br from-heartglow-violet/10 via-white to-heartglow-pink/10 dark:from-heartglow-violet/40 dark:to-heartglow-pink/40'
                  : 'bg-white border-gray-200 hover:border-heartglow-violet/80 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-heartglow-violet'
              }`}
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-heartglow-offwhite">{tone.label}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{tone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {showCustomTone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4"
          >
            <label htmlFor="custom-tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe your desired tone:
            </label>
            <input
              id="custom-tone"
              type="text"
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-violet focus:border-transparent dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="e.g., Encouraging, Empathetic..."
              required={showCustomTone}
            />
          </motion.div>
        )}
      </div>


      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isNextDisabled}
          className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink ${
            isNextDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : 'bg-heartglow-pink hover:bg-heartglow-pink/90'
          }`}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default PurposeToneStep; 