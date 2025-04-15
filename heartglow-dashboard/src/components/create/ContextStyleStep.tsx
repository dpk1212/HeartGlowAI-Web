import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

// Define interfaces for the data this step handles
interface CustomInstructionsOptions {
  mentionMemory?: boolean;
  askQuestion?: boolean;
  // Add other specific guidance options here
}

interface ContextStyleData {
  promptedBy: string;
  messageGoal: string;
  formalityLevel: number;
  emotionalDepth: number;
  customInstructionsText: string;
  customInstructionsOptions: CustomInstructionsOptions;
}

interface ContextStyleStepProps {
  onNext: (data: ContextStyleData) => void;
  onBack: () => void;
  initialData?: Partial<ContextStyleData> | null;
}

// Helper component for sliders
const LabelledSlider = ({ label, value, onChange, min = 1, max = 5, helpText }: { label: string, value: number, onChange: (value: number) => void, min?: number, max?: number, helpText?: string }) => {
  
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
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
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
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-thumb" // Add slider-thumb class for custom styling if needed
        />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-28 text-right">
          {getThumbLabel(value, type)}
        </span>
      </div>
    </div>
  );
};

const ContextStyleStep: React.FC<ContextStyleStepProps> = ({ onNext, onBack, initialData }) => {
  const [promptedBy, setPromptedBy] = useState(initialData?.promptedBy || '');
  const [messageGoal, setMessageGoal] = useState(initialData?.messageGoal || '');
  const [formalityLevel, setFormalityLevel] = useState(initialData?.formalityLevel || 3);
  const [emotionalDepth, setEmotionalDepth] = useState(initialData?.emotionalDepth || 3);
  const [customInstructionsText, setCustomInstructionsText] = useState(initialData?.customInstructionsText || '');
  const [customInstructionsOptions, setCustomInstructionsOptions] = useState<CustomInstructionsOptions>(
    initialData?.customInstructionsOptions || { mentionMemory: false, askQuestion: false }
  );

  // Update state if initialData changes (e.g., navigating back)
  useEffect(() => {
    setPromptedBy(initialData?.promptedBy || '');
    setMessageGoal(initialData?.messageGoal || '');
    setFormalityLevel(initialData?.formalityLevel || 3);
    setEmotionalDepth(initialData?.emotionalDepth || 3);
    setCustomInstructionsText(initialData?.customInstructionsText || '');
    setCustomInstructionsOptions(initialData?.customInstructionsOptions || { mentionMemory: false, askQuestion: false });
  }, [initialData]);

  const handleCheckboxChange = (option: keyof CustomInstructionsOptions) => {
    setCustomInstructionsOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmit = () => {
    onNext({
      promptedBy,
      messageGoal,
      formalityLevel,
      emotionalDepth,
      customInstructionsText,
      customInstructionsOptions,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 dark:text-heartglow-offwhite"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Context & Style</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Add details to personalize the message further.</p>
      </div>

      {/* Prompted By Input */}
      <div>
        <label htmlFor="promptedBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          What prompted this message? (Optional)
        </label>
        <input
          id="promptedBy"
          type="text"
          value={promptedBy}
          onChange={(e) => setPromptedBy(e.target.value)}
          placeholder="e.g., Saw their post, thinking of them, upcoming birthday..."
          className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      
      {/* Message Goal Input */}
      <div>
        <label htmlFor="messageGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Main goal for this message? (Optional)
        </label>
        <input
          id="messageGoal"
          type="text"
          value={messageGoal}
          onChange={(e) => setMessageGoal(e.target.value)}
          placeholder="e.g., Make them feel appreciated, get them to reply..."
          className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabelledSlider 
              label="Formality" 
              value={formalityLevel} 
              onChange={setFormalityLevel} 
              helpText="How formal or casual should the language be?" 
          />
          <LabelledSlider 
              label="Emotional Depth" 
              value={emotionalDepth} 
              onChange={setEmotionalDepth} 
              helpText="How personal or lighthearted should the message feel?" 
          />
      </div>

      {/* Custom Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Specific Guidance (Optional)
        </label>
        <div className="space-y-2 mb-3">
          {/* Checkbox examples */}
          <div className="flex items-center">
            <input
              id="mentionMemory"
              type="checkbox"
              checked={customInstructionsOptions.mentionMemory}
              onChange={() => handleCheckboxChange('mentionMemory')}
              className="h-4 w-4 text-heartglow-pink border-gray-300 rounded focus:ring-heartglow-pink dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="mentionMemory" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Mention a specific memory/event
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="askQuestion"
              type="checkbox"
              checked={customInstructionsOptions.askQuestion}
              onChange={() => handleCheckboxChange('askQuestion')}
              className="h-4 w-4 text-heartglow-pink border-gray-300 rounded focus:ring-heartglow-pink dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="askQuestion" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Include a question for them
            </label>
          </div>
          {/* Add more checkboxes as needed */}
        </div>
        <textarea
          value={customInstructionsText}
          onChange={(e) => setCustomInstructionsText(e.target.value)}
          rows={3}
          className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400 resize-none"
          placeholder="Any other specific instructions for the AI? (e.g., 'Avoid talking about work', 'Keep it optimistic')"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          // Add disabled logic if needed (e.g., based on required fields if any)
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-heartglow-pink hover:bg-heartglow-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink transition-colors"
        >
          Generate Message
        </button>
      </div>
    </motion.div>
  );
};

export default ContextStyleStep; 