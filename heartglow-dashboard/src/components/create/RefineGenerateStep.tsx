import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, FileText, AlignCenter, AlignLeft, AlignJustify } from 'lucide-react';

// --- Types and Constants from FormatStep ---
interface FormatData {
  type: string;
  length: string;
  options?: Record<string, any>;
}

const formats = [
  { id: 'text', label: 'Text Message', icon: '📱', description: 'Simple message for direct delivery' },
  { id: 'email', label: 'Email', icon: '📧', description: 'Formal message with subject line' },
  { id: 'conversation', label: 'In-Person Conversation', icon: '💬', description: 'Talking points for face-to-face' },
  { id: 'card', label: 'Greeting Card', icon: '💌', description: 'Perfect for celebration or gratitude' },
  { id: 'social', label: 'Social Media', icon: '🌐', description: 'Public post or direct message' },
  { id: 'letter', label: 'Letter', icon: '✉️', description: 'Traditional format for deep connection' }
];

const lengths = [
  { id: 'Very short (1-2 sentences)', label: 'Very Short', description: '1-2 sentences', icon: <AlignCenter size={16}/> },
  { id: 'Short (approx. 1 paragraph)', label: 'Short', description: '~1 paragraph', icon: <AlignLeft size={16}/> },
  { id: 'Medium (approx. 2 paragraphs)', label: 'Medium', description: '~2 paragraphs', icon: <AlignJustify size={16}/> },
  { id: 'Long (3+ paragraphs)', label: 'Long', description: '3+ paragraphs', icon: <FileText size={16}/> }
];

// --- Types and Constants from ContextStyleStep ---
interface CustomInstructionsOptions {
  mentionMemory?: boolean;
  askQuestion?: boolean;
}

interface ContextStyleData {
  promptedBy: string;
  messageGoal: string;
  formalityLevel: number;
  emotionalDepth: number;
  customInstructionsText: string;
  customInstructionsOptions: CustomInstructionsOptions;
}

// --- Combined Props and Data Structure ---
interface RefineGenerateData {
  format: FormatData | null;
  promptedBy: string;
  messageGoal: string;
  formalityLevel: number;
  emotionalDepth: number;
  customInstructionsText: string;
  customInstructionsOptions: CustomInstructionsOptions;
}

interface RefineGenerateStepProps {
  onNext: (data: Omit<RefineGenerateData, 'format'> & { format: FormatData }) => void; // Ensure format is not null on next
  onBack: () => void;
  initialData?: Partial<RefineGenerateData> | null;
}

// Helper component for sliders (from ContextStyleStep)
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
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider-thumb"
        />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-28 text-right">
          {getThumbLabel(value, type)}
        </span>
      </div>
    </div>
  );
};

const RefineGenerateStep: React.FC<RefineGenerateStepProps> = ({ onNext, onBack, initialData }) => {
  // --- State Management ---
  // Format State
  const [selectedFormat, setSelectedFormat] = useState(initialData?.format?.type || '');
  const [selectedLength, setSelectedLength] = useState(initialData?.format?.length || 'Short (approx. 1 paragraph)');
  const [formatSpecificOptions, setFormatSpecificOptions] = useState(
    initialData?.format?.options || {
      emailSubject: '',
      emojiPreference: 'moderate',
      talkingPoints: 3,
      platform: 'general'
    }
  );

  // Context & Style State
  const [promptedBy, setPromptedBy] = useState(initialData?.promptedBy || '');
  const [messageGoal, setMessageGoal] = useState(initialData?.messageGoal || '');
  const [formalityLevel, setFormalityLevel] = useState(initialData?.formalityLevel || 3);
  const [emotionalDepth, setEmotionalDepth] = useState(initialData?.emotionalDepth || 3);
  const [customInstructionsText, setCustomInstructionsText] = useState(initialData?.customInstructionsText || '');
  const [customInstructionsOptions, setCustomInstructionsOptions] = useState<CustomInstructionsOptions>(
    initialData?.customInstructionsOptions || { mentionMemory: false, askQuestion: false }
  );

  // --- Effects to handle initial data ---
  useEffect(() => {
    // Format
    setSelectedFormat(initialData?.format?.type || '');
    setSelectedLength(initialData?.format?.length || 'Short (approx. 1 paragraph)');
    setFormatSpecificOptions(initialData?.format?.options || {
      emailSubject: '', emojiPreference: 'moderate', talkingPoints: 3, platform: 'general'
    });

    // Context & Style
    setPromptedBy(initialData?.promptedBy || '');
    setMessageGoal(initialData?.messageGoal || '');
    setFormalityLevel(initialData?.formalityLevel || 3);
    setEmotionalDepth(initialData?.emotionalDepth || 3);
    setCustomInstructionsText(initialData?.customInstructionsText || '');
    setCustomInstructionsOptions(initialData?.customInstructionsOptions || { mentionMemory: false, askQuestion: false });

  }, [initialData]);

  // --- Event Handlers ---
  const handleCheckboxChange = (option: keyof CustomInstructionsOptions) => {
    setCustomInstructionsOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmit = () => {
    const currentFormat: FormatData | null = selectedFormat
      ? {
          type: selectedFormat,
          length: selectedLength,
          options: formatSpecificOptions,
        }
      : null;

    if (currentFormat) {
      onNext({
        format: currentFormat,
        promptedBy,
        messageGoal,
        formalityLevel,
        emotionalDepth,
        customInstructionsText,
        customInstructionsOptions,
      });
    } else {
      console.warn("Format not selected"); // Or show UI feedback
    }
  };

  const isNextDisabled = !selectedFormat;

  // --- Render Logic ---

  // Function to render format-specific options (from FormatStep)
  const renderFormatSpecificOptions = () => {
     switch (selectedFormat) {
      case 'email':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <label htmlFor="email-subject" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject (Optional)</label>
            <input
              id="email-subject"
              type="text"
              value={formatSpecificOptions.emailSubject}
              onChange={(e) => setFormatSpecificOptions(prev => ({ ...prev, emailSubject: e.target.value }))}
              className="w-full p-2 border rounded-md bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Enter email subject"
            />
          </motion.div>
        );
      case 'text':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <label htmlFor="emoji-usage" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Emoji Usage</label>
            <select
              id="emoji-usage"
              value={formatSpecificOptions.emojiPreference}
              onChange={(e) => setFormatSpecificOptions(prev => ({ ...prev, emojiPreference: e.target.value }))}
              className="w-full p-2 border rounded-md bg-white text-gray-900 border-gray-300 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600"
            >
              <option value="moderate">Moderate</option>
              <option value="minimal">Minimal</option>
              <option value="frequent">Frequent</option>
              <option value="none">None</option>
            </select>
          </motion.div>
        );
      case 'conversation':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <label htmlFor="talking-points" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Number of Talking Points</label>
            <input
              id="talking-points"
              type="number"
              min="1"
              max="10"
              value={formatSpecificOptions.talkingPoints}
              onChange={(e) => setFormatSpecificOptions(prev => ({ ...prev, talkingPoints: parseInt(e.target.value, 10) || 1 }))}
               className="w-full p-2 border rounded-md bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
            />
          </motion.div>
        );
      case 'social':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <label htmlFor="platform" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Platform</label>
            <select
              id="platform"
              value={formatSpecificOptions.platform}
              onChange={(e) => setFormatSpecificOptions(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full p-2 border rounded-md bg-white text-gray-900 border-gray-300 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600"
            >
              <option value="general">General</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 dark:text-heartglow-offwhite"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Refine & Generate</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Adjust the format, style, and add final details.</p>
      </div>

      {/* Combined Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Column: Format & Length */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-heartglow-offwhite mb-3">
              Format
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => (
                <motion.div
                  key={format.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedFormat(format.id)}
                   className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 flex items-center space-x-2 text-sm ${
                     selectedFormat === format.id
                      ? 'border-transparent ring-2 ring-heartglow-pink bg-heartglow-pink/5 dark:bg-heartglow-pink/10'
                      : 'bg-white border-gray-200 hover:border-heartglow-pink/80 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                   <span className="text-lg">{format.icon}</span>
                   <span className="font-medium text-gray-800 dark:text-gray-200">{format.label}</span>
                </motion.div>
              ))}
            </div>
            {/* Render specific options based on selected format */}
            {renderFormatSpecificOptions()}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-heartglow-offwhite mb-3">
              Length
            </h3>
            <div className="flex flex-wrap gap-3">
              {lengths.map((len) => (
                <motion.button
                  key={len.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLength(len.id)}
                   className={`px-3 py-2 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 ${
                    selectedLength === len.id
                      ? 'border-transparent ring-1 ring-heartglow-violet bg-heartglow-violet/10 text-heartglow-violet dark:bg-heartglow-violet/20 dark:text-heartglow-violet-light'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 dark:bg-heartglow-deepgray dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                   {len.icon}
                   {len.label} ({len.description})
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Context & Style */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-heartglow-offwhite mb-3">
              Style & Nuance
            </h3>
            <div className="space-y-4">
              <LabelledSlider
                  label="Formality"
                  value={formalityLevel}
                  onChange={setFormalityLevel}
                  helpText="How formal or casual?"
              />
              <LabelledSlider
                  label="Emotional Depth"
                  value={emotionalDepth}
                  onChange={setEmotionalDepth}
                  helpText="How personal or lighthearted?"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-heartglow-offwhite mb-3">
              Context (Optional)
            </h3>
            <div className="space-y-3">
               <div>
                <label htmlFor="promptedBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What prompted this?
                </label>
                <input
                  id="promptedBy"
                  type="text"
                  value={promptedBy}
                  onChange={(e) => setPromptedBy(e.target.value)}
                  placeholder="e.g., Saw their post, upcoming birthday..."
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>
               <div>
                <label htmlFor="messageGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Main goal for this message?
                </label>
                <input
                  id="messageGoal"
                  type="text"
                  value={messageGoal}
                  onChange={(e) => setMessageGoal(e.target.value)}
                  placeholder="e.g., Make them feel appreciated..."
                  className="w-full p-2 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

           <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-heartglow-offwhite mb-3">
              Specific Guidance (Optional)
            </h3>
            <div className="space-y-2 mb-3">
              <div className="flex items-center">
                <input id="mentionMemory" type="checkbox" checked={customInstructionsOptions.mentionMemory} onChange={() => handleCheckboxChange('mentionMemory')} className="h-4 w-4 text-heartglow-pink border-gray-300 rounded focus:ring-heartglow-pink dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="mentionMemory" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Mention a specific memory/event</label>
              </div>
              <div className="flex items-center">
                <input id="askQuestion" type="checkbox" checked={customInstructionsOptions.askQuestion} onChange={() => handleCheckboxChange('askQuestion')} className="h-4 w-4 text-heartglow-pink border-gray-300 rounded focus:ring-heartglow-pink dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="askQuestion" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Include a question</label>
              </div>
            </div>
            <textarea
              value={customInstructionsText}
              onChange={(e) => setCustomInstructionsText(e.target.value)}
              placeholder="Any other specific instructions? e.g., Mention the weather, keep it under 50 words..."
              className="w-full p-2 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm resize-none dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
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
          Generate Message
        </button>
      </div>
    </motion.div>
  );
};

export default RefineGenerateStep; 