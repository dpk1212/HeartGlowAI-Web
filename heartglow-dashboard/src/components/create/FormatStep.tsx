import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlignCenter, AlignLeft, AlignJustify } from 'lucide-react';

// Define more specific types
interface FormatData {
  type: string;
  length: string;
  options?: Record<string, any>;
}

interface FormatStepProps {
  onNext: (data: { format: FormatData }) => void; // Use specific type
  onBack: () => void;
  initialData?: FormatData | null; // Use specific type, allow null
}

const FormatStep = ({ onNext, onBack, initialData }: FormatStepProps) => {
  // Initialize state from initialData
  const [selectedFormat, setSelectedFormat] = useState(initialData?.type || '');
  const [selectedLength, setSelectedLength] = useState(initialData?.length || 'Standard (1 paragraph)');
  const [formatSpecificOptions, setFormatSpecificOptions] = useState(
    initialData?.options || { // Initialize options from initialData or defaults
      emailSubject: '',
      emojiPreference: 'moderate',
      talkingPoints: 3,
      platform: 'general'
    }
  );

  // Update state if initialData changes
  useEffect(() => {
    if (initialData) {
      setSelectedFormat(initialData.type || '');
      setSelectedLength(initialData.length || 'Standard (1 paragraph)');
      setFormatSpecificOptions(initialData.options || {
        emailSubject: '',
        emojiPreference: 'moderate',
        talkingPoints: 3,
        platform: 'general'
      });
    } else {
      // Reset if no initialData
      setSelectedFormat('');
      setSelectedLength('Standard (1 paragraph)');
      setFormatSpecificOptions({
        emailSubject: '',
        emojiPreference: 'moderate',
        talkingPoints: 3,
        platform: 'general'
      });
    }
  }, [initialData]);

  const formats = [
    { id: 'text', label: 'Text Message', icon: '📱', description: 'Simple message for direct delivery' },
    { id: 'email', label: 'Email', icon: '📧', description: 'Formal message with subject line' },
    { id: 'conversation', label: 'In-Person Conversation', icon: '💬', description: 'Talking points for face-to-face' },
    { id: 'card', label: 'Greeting Card', icon: '💌', description: 'Perfect for celebration or gratitude' },
    { id: 'social', label: 'Social Media', icon: '🌐', description: 'Public post or direct message' },
    { id: 'letter', label: 'Letter', icon: '✉️', description: 'Traditional format for deep connection' }
  ];

  const lengths = [
    { id: 'Very short (1-2 sentences)', label: 'Very Short', description: '1-2 sentences', icon: <AlignCenter size={20}/> },
    { id: 'Short (approx. 1 paragraph)', label: 'Short', description: '~1 paragraph', icon: <AlignLeft size={20}/> },
    { id: 'Medium (approx. 2 paragraphs)', label: 'Medium', description: '~2 paragraphs', icon: <AlignJustify size={20}/> },
    { id: 'Long (3+ paragraphs)', label: 'Long', description: '3+ paragraphs', icon: <FileText size={20}/> }
  ];

  const handleSubmit = () => {
    onNext({
      format: {
        type: selectedFormat,
        length: selectedLength,
        options: formatSpecificOptions
      }
    });
  };

  const renderFormatSpecificOptions = () => {
    switch (selectedFormat) {
      case 'email':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-heartglow-deepgray dark:border-gray-600"
          >
            <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Subject
            </label>
            <input
              id="email-subject"
              type="text"
              value={formatSpecificOptions.emailSubject}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                emailSubject: e.target.value
              }))}
              className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
              placeholder="Enter email subject"
            />
          </motion.div>
        );
      case 'text':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-heartglow-deepgray dark:border-gray-600"
          >
            <label htmlFor="emoji-usage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Emoji Usage
            </label>
            <select
              id="emoji-usage"
              value={formatSpecificOptions.emojiPreference}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                emojiPreference: e.target.value
              }))}
              className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600"
            >
              <option value="none">No emojis</option>
              <option value="minimal">Minimal emojis</option>
              <option value="moderate">Moderate emojis</option>
              <option value="frequent">Frequent emojis</option>
            </select>
          </motion.div>
        );
      case 'conversation':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-heartglow-deepgray dark:border-gray-600"
          >
            <label htmlFor="talking-points" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Talking Points
            </label>
            <input
              id="talking-points"
              type="number"
              min="1"
              max="10"
              value={formatSpecificOptions.talkingPoints}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                talkingPoints: parseInt(e.target.value, 10) || 1
              }))}
              className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600 dark:placeholder-gray-400"
            />
          </motion.div>
        );
      case 'social':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-heartglow-deepgray dark:border-gray-600"
          >
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <select
              id="platform"
              value={formatSpecificOptions.platform}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                platform: e.target.value
              }))}
              className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-heartglow-deepgray dark:text-heartglow-offwhite dark:border-gray-600"
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
    <div className="space-y-8 dark:text-heartglow-offwhite">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Format & Length</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Select how your message will be delivered</p>
      </div>

      <div className="space-y-8">
        {/* Format Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-heartglow-offwhite mb-4">
            Message Format
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {formats.map((format) => (
              <motion.div
                key={format.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedFormat === format.id
                    ? 'border-transparent ring-2 ring-heartglow-pink bg-gradient-to-br from-heartglow-pink/10 via-white to-heartglow-violet/10 dark:from-heartglow-pink/40 dark:to-heartglow-violet/40' 
                    : 'bg-white border-gray-200 hover:border-heartglow-pink/80 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-heartglow-pink' 
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{format.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-heartglow-offwhite">{format.label}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{format.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Length Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-heartglow-offwhite mb-4">
            Message Length
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lengths.map((length) => (
              <motion.div
                key={length.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLength(length.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 flex flex-col items-center justify-between h-full ${
                  selectedLength === length.id
                    ? 'border-transparent ring-2 ring-heartglow-pink bg-gradient-to-br from-heartglow-pink/10 via-white to-heartglow-violet/10 dark:from-heartglow-pink/40 dark:to-heartglow-violet/40' 
                    : 'bg-white border-gray-200 hover:border-heartglow-pink/80 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-heartglow-pink' 
                }`}
              >
                <div className="flex flex-col items-center text-center flex-grow justify-center">
                  <div className="mb-3 text-heartglow-indigo dark:text-heartglow-pink">
                    {length.icon}
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-heartglow-offwhite mb-1">{length.label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{length.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Format-Specific Options */}
        {selectedFormat && renderFormatSpecificOptions()}
      </div>

      <div className="flex justify-between mt-12">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedFormat || !selectedLength}
          className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink ${
            selectedFormat && selectedLength
              ? 'bg-heartglow-pink hover:bg-heartglow-pink/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FormatStep; 