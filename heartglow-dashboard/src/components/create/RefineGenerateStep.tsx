import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlignCenter, AlignLeft, AlignJustify, Paperclip, MessageCircle } from 'lucide-react';

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

// --- Combined Props and Data Structure ---
interface RefineGenerateData {
  format: FormatData | null;
  contextInstructions: string;
  customInstructionsOptions: CustomInstructionsOptions;
}

interface RefineGenerateStepProps {
  onNext: (data: Omit<RefineGenerateData, 'format'> & { format: FormatData }) => void;
  onBack: () => void;
  initialData?: Partial<Pick<RefineGenerateData, 'format' | 'customInstructionsOptions'> & { promptedBy?: string; customInstructionsText?: string }> | null;
}

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

  // Add state for consolidated field, combining initial promptedBy and customInstructionsText
  const initialContext = [initialData?.promptedBy, initialData?.customInstructionsText].filter(Boolean).join('\n\n');
  const [contextInstructions, setContextInstructions] = useState(initialContext);

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

    // Context & Style - Update to handle consolidated field
    const initialContextText = [initialData?.promptedBy, initialData?.customInstructionsText].filter(Boolean).join('\n\n');
    setContextInstructions(initialContextText);
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
      // Pass updated data structure
      onNext({
        format: currentFormat,
        contextInstructions: contextInstructions.trim(),
        customInstructionsOptions,
      });
    } else {
      console.warn("Format not selected"); // Or show UI feedback
    }
  };

  const isNextDisabled = !selectedFormat;

  // --- Render Logic ---

  // Function to render format-specific options - Minor styling tweaks
  const renderFormatSpecificOptions = () => {
     switch (selectedFormat) {
      case 'email':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50">
            <label htmlFor="email-subject" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject (Optional)</label>
            <input
              id="email-subject"
              type="text"
              value={formatSpecificOptions.emailSubject}
              onChange={(e) => setFormatSpecificOptions(prev => ({ ...prev, emailSubject: e.target.value }))}
              className="w-full p-2 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Enter email subject"
            />
          </motion.div>
        );
      case 'text':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50">
            <label htmlFor="emoji-usage" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Emoji Usage</label>
            <select
              id="emoji-usage"
              value={formatSpecificOptions.emojiPreference}
              onChange={(e) => setFormatSpecificOptions(prev => ({ ...prev, emojiPreference: e.target.value }))}
              className="w-full p-2 border rounded-lg bg-white text-gray-900 border-gray-300 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600"
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50">
            <label htmlFor="talking-points" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Number of Talking Points</label>
            <input
              id="talking-points"
              type="number"
              min="1"
              max="10"
              value={formatSpecificOptions.talkingPoints}
              onChange={(e) => setFormatSpecificOptions(prev => ({ ...prev, talkingPoints: parseInt(e.target.value, 10) || 1 }))}
               className="w-full p-2 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
            />
          </motion.div>
        );
      case 'social':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50">
            <label htmlFor="platform" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Platform</label>
            <select
              id="platform"
              value={formatSpecificOptions.platform}
              onChange={(e) => setFormatSpecificOptions(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full p-2 border rounded-lg bg-white text-gray-900 border-gray-300 focus:ring-1 focus:ring-heartglow-pink focus:border-heartglow-pink text-sm dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600"
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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Delivery & Details</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Choose the final format and add specific instructions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="space-y-6 p-6 rounded-xl bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/30 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-heartglow-offwhite mb-3 flex items-center">
               <Paperclip size={18} className="mr-2 text-heartglow-pink"/> Format
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => (
                <motion.div
                  key={format.id}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedFormat(format.id)}
                   className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-150 flex items-center space-x-2 text-sm ${
                     selectedFormat === format.id
                      ? 'border-heartglow-pink bg-heartglow-pink/5 dark:bg-heartglow-pink/10 shadow-md'
                      : 'bg-white border-gray-200 hover:border-heartglow-pink/50 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:border-heartglow-pink/60'
                  }`}
                >
                   <span className="text-lg">{format.icon}</span>
                   <span className="font-medium text-gray-800 dark:text-gray-200">{format.label}</span>
                </motion.div>
              ))}
            </div>
            {renderFormatSpecificOptions()}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-heartglow-offwhite mb-3 flex items-center">
              <AlignJustify size={18} className="mr-2 text-heartglow-violet"/> Length
            </h3>
            <div className="flex flex-wrap gap-2">
              {lengths.map((len) => (
                <motion.button
                  key={len.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLength(len.id)}
                   className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors duration-150 ${
                    selectedLength === len.id
                      ? 'border-transparent ring-2 ring-heartglow-violet bg-heartglow-violet/10 text-heartglow-violet dark:bg-heartglow-violet/20 dark:text-heartglow-violet-light shadow-sm'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                   {len.icon}
                   {len.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-xl bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/30 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-heartglow-offwhite mb-3 flex items-center">
              <MessageCircle size={18} className="mr-2 text-blue-500"/> Context & Instructions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-4">Add background, specific points to include/avoid, or other guidance for the AI.</p>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">Quick Options:</label>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center">
                  <input id="mentionMemory" type="checkbox" checked={customInstructionsOptions.mentionMemory} onChange={() => handleCheckboxChange('mentionMemory')} className="h-4 w-4 text-heartglow-pink border-gray-300 rounded focus:ring-heartglow-pink dark:bg-gray-700 dark:border-gray-600"/>
                  <label htmlFor="mentionMemory" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Mention specific memory/event</label>
                </div>
                <div className="flex items-center">
                  <input id="askQuestion" type="checkbox" checked={customInstructionsOptions.askQuestion} onChange={() => handleCheckboxChange('askQuestion')} className="h-4 w-4 text-heartglow-pink border-gray-300 rounded focus:ring-heartglow-pink dark:bg-gray-700 dark:border-gray-600"/>
                  <label htmlFor="askQuestion" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Include a question</label>
                </div>
              </div>
            </div>

            <textarea
              value={contextInstructions}
              onChange={(e) => setContextInstructions(e.target.value)}
              placeholder="e.g., &#10;• Prompt: Saw their vacation photos.&#10;• Goal: Ask about the trip, say I miss them.&#10;• Avoid mentioning work.&#10;• Mention the funny thing that happened last week."
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y min-h-[120px] dark:bg-gray-700 dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400/70"
              rows={6}
            />
        </div>
      </div>

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
          Generate Message
        </button>
      </div>
    </motion.div>
  );
};

export default RefineGenerateStep;