import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Smile, MessageSquare, Edit3, AlignHorizontalSpaceBetween, BarChartHorizontal } from 'lucide-react';

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
  formalityLevel: number;
  emotionalDepth: number;
  messageGoal: string;
}

interface PurposeToneStepProps {
  onNext: (data: PurposeToneData) => void;
  onBack: () => void;
  initialData?: Partial<PurposeToneData> | null;
}

// Helper component for sliders - Minor styling tweaks
const LabelledSlider = ({ label, value, onChange, min = 1, max = 5, helpText, icon: Icon }: { label: string, value: number, onChange: (value: number) => void, min?: number, max?: number, helpText?: string, icon?: React.ElementType }) => {
  const getThumbLabel = (level: number, type: 'formality' | 'depth'): string => {
     if (type === 'formality') {
       const labels = ['Very Casual', 'Casual', 'Neutral', 'Formal', 'Very Formal'];
       return labels[level - 1] || 'Neutral';
     } else { // depth
       const labels = ['Lighthearted', 'Warm', 'Personal', 'Deeply Personal', 'Vulnerable'];
       return labels[level - 1] || 'Personal';
     }
  };
  const type = label.toLowerCase().includes('formality') ? 'formality' : 'depth';
  return (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
        {Icon && <Icon size={16} className="mr-2 opacity-70"/>}
        {label}
        {helpText && (
          <span className="ml-2 group relative">
            <Info size={14} className="text-gray-400 cursor-help"/>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
              {helpText}
            </span>
          </span>
        )}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-heartglow-violet/50"
        />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-28 text-right tabular-nums">
          {getThumbLabel(value, type)}
        </span>
      </div>
    </div>
  );
};

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

  // Add state for new fields
  const [formalityLevel, setFormalityLevel] = useState(initialData?.formalityLevel || 3);
  const [emotionalDepth, setEmotionalDepth] = useState(initialData?.emotionalDepth || 3);
  const [messageGoal, setMessageGoal] = useState(initialData?.messageGoal || '');

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

      // New fields
      setFormalityLevel(initialData.formalityLevel || 3);
      setEmotionalDepth(initialData.emotionalDepth || 3);
      setMessageGoal(initialData.messageGoal || '');

    } else {
      // Reset if no initialData
      setSelectedIntent(null);
      setCustomIntent('');
      setShowCustomIntent(false);
      setSelectedTone(null);
      setCustomTone('');
      setShowCustomTone(false);
      // Reset new fields
      setFormalityLevel(3);
      setEmotionalDepth(3);
      setMessageGoal('');
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
      // Pass all fields including the new ones
      onNext({
         intent: finalIntent,
         tone: finalTone,
         formalityLevel,
         emotionalDepth,
         messageGoal
      });
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
      className="space-y-8 dark:text-heartglow-offwhite"
    >
      {/* Section Wrapper Function for Consistency */}
      const SectionWrapper: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
        <div className="space-y-4 p-6 rounded-xl bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/30 shadow-sm">
          <div className="text-left mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
               {/* Add appropriate icon based on title? Hardcoded for now */}
               {title === 'Purpose' && <Edit3 size={20} className="mr-2 text-heartglow-pink"/>}
               {title === 'Tone' && <Smile size={20} className="mr-2 text-heartglow-violet"/>}
               {title === 'Style' && <BarChartHorizontal size={20} className="mr-2 text-blue-500"/>}
               {title === 'Refine Goal' && <MessageSquare size={20} className="mr-2 text-green-500"/>}
               {title}
             </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          {children}
        </div>
      );

      {/* Intent Section */}
      <SectionWrapper title="Purpose" description="What's the main goal of your message?">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {intents.map((intent) => (
            <motion.div
              key={intent.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-start space-x-3 ${
                selectedIntent === intent.id
                  ? 'border-heartglow-pink bg-heartglow-pink/5 dark:bg-heartglow-pink/10 shadow-md'
                  : 'bg-white border-gray-200 hover:border-heartglow-pink/50 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:border-heartglow-pink/60'
              }`}
              onClick={() => handleIntentSelect(intent.id)}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${intent.color} text-white text-lg shadow-sm flex-shrink-0 mt-0.5`}>
                {intent.icon}
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-heartglow-offwhite">{intent.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{intent.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {showCustomIntent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50"
          >
            <label htmlFor="custom-intent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe your custom intent:
            </label>
            <textarea
              id="custom-intent"
              value={customIntent}
              onChange={(e) => setCustomIntent(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent resize-none text-sm dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="e.g., Invite to an event, ask for a favor..."
              rows={2}
              required={showCustomIntent}
            />
          </motion.div>
        )}
      </SectionWrapper>

      {/* Tone Section */}
      <SectionWrapper title="Tone" description="How should the message feel?">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tones.map((tone) => (
            <motion.div
              key={tone.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToneSelect(tone.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedTone === tone.id
                  ? 'border-heartglow-violet bg-heartglow-violet/5 dark:bg-heartglow-violet/10 shadow-md'
                  : 'bg-white border-gray-200 hover:border-heartglow-violet/50 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:border-heartglow-violet/60'
              }`}
            >
              <div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-heartglow-offwhite">{tone.label}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{tone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {showCustomTone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50"
          >
            <label htmlFor="custom-tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe your desired tone:
            </label>
            <input
              id="custom-tone"
              type="text"
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-violet focus:border-transparent text-sm dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="e.g., Encouraging, Empathetic..."
              required={showCustomTone}
            />
          </motion.div>
        )}
      </SectionWrapper>

      {/* Style Sliders Section */}
      <SectionWrapper title="Style" description="Adjust the feeling of the message.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <LabelledSlider
                label="Formality"
                icon={AlignHorizontalSpaceBetween}
                value={formalityLevel}
                onChange={setFormalityLevel}
                helpText="How formal or casual?"
             />
             <LabelledSlider
                label="Emotional Depth"
                icon={BarChartHorizontal}
                value={emotionalDepth}
                onChange={setEmotionalDepth}
                helpText="How personal or lighthearted?"
             />
          </div>
      </SectionWrapper>

      {/* Message Goal Section */}
      <SectionWrapper title="Refine Goal" description="Optionally add more detail to the selected purpose.">
          <input
            id="messageGoal"
            type="text"
            value={messageGoal}
            onChange={(e) => setMessageGoal(e.target.value)}
            placeholder="e.g., Make them smile, ensure they understand the deadline..."
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
          />
      </SectionWrapper>

      {/* Navigation Buttons - Add subtle top margin */}
      <div className="flex justify-between mt-10 pt-6 border-t border-gray-200 dark:border-gray-700/50">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isNextDisabled}
          className={`inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-900 ${
            isNextDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
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