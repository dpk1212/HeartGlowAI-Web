import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ToneStepProps {
  onNext: (data: { tone: string }) => void;
  onBack: () => void;
  initialData?: string | null;
}

const tones = [
  { id: 'warm', label: 'Warm', description: 'Friendly and affectionate' },
  { id: 'casual', label: 'Casual', description: 'Relaxed and informal' },
  { id: 'sincere', label: 'Sincere', description: 'Honest and heartfelt' },
  { id: 'playful', label: 'Playful', description: 'Light and fun' },
  { id: 'formal', label: 'Formal', description: 'Professional and respectful' },
  { id: 'reflective', label: 'Reflective', description: 'Thoughtful and introspective' },
  { id: 'custom', label: 'Custom', description: 'Define your own tone' }
];

const ToneStep = ({ onNext, onBack, initialData }: ToneStepProps) => {
  const isStandardTone = (toneId: string | null | undefined): boolean => 
    !!toneId && tones.some(t => t.id === toneId && t.id !== 'custom');

  const initialIsCustom = initialData ? !isStandardTone(initialData) : false;
  const [selectedTone, setSelectedTone] = useState<string | null>(initialIsCustom ? 'custom' : initialData || null);
  const [customTone, setCustomTone] = useState(initialIsCustom ? initialData || '' : '');
  const [showCustom, setShowCustom] = useState(initialIsCustom);

  useEffect(() => {
    const isCustom = initialData ? !isStandardTone(initialData) : false;
    setSelectedTone(isCustom ? 'custom' : initialData || null);
    setShowCustom(isCustom);
    setCustomTone(isCustom ? initialData || '' : '');
  }, [initialData]);

  const handleSubmit = () => {
    let finalTone = '';
    if (selectedTone) {
      finalTone = showCustom ? customTone.trim() : selectedTone;
    }
    if (finalTone) {
      onNext({ tone: finalTone });
    }
  };

  return (
    <div className="space-y-8 dark:text-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What tone would you like to use?</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Select the tone that best fits your message</p>
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
              if (tone.id !== 'custom') {
                setCustomTone('');
              }
            }}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedTone === tone.id
                ? 'border-transparent ring-2 ring-heartglow-pink bg-gradient-to-br from-heartglow-pink/10 via-white to-heartglow-violet/10 dark:from-heartglow-pink/25 dark:via-black/10 dark:to-heartglow-violet/25' 
                : 'bg-white border-gray-200 hover:border-heartglow-pink/80 dark:bg-gray-800/40 dark:border-gray-700 dark:hover:bg-gray-700/60 dark:hover:border-heartglow-pink/60'
            }`}
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{tone.label}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tone.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {showCustom && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6"
        >
          <label htmlFor="custom-tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your desired tone
          </label>
          <input
            id="custom-tone"
            type="text"
            value={customTone}
            onChange={(e) => setCustomTone(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent 
                      dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
            placeholder="e.g., Encouraging, Empathetic..."
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
          onClick={handleSubmit}
          disabled={!selectedTone || (showCustom && !customTone.trim())}
          className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink ${
            !selectedTone || (showCustom && !customTone.trim())
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : 'bg-heartglow-pink hover:bg-heartglow-pink/90'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ToneStep; 