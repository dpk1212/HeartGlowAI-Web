import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  const [selectedLength, setSelectedLength] = useState(initialData?.length || '');
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
      setSelectedLength(initialData.length || '');
      setFormatSpecificOptions(initialData.options || {
        emailSubject: '',
        emojiPreference: 'moderate',
        talkingPoints: 3,
        platform: 'general'
      });
    } else {
      // Reset if no initialData
      setSelectedFormat('');
      setSelectedLength('');
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
    { id: 'brief', label: 'Brief', description: '1-2 sentences', icon: '🔹' },
    { id: 'standard', label: 'Standard', description: '1 paragraph', icon: '🔸' },
    { id: 'detailed', label: 'Detailed', description: '2-3 paragraphs', icon: '📝' },
    { id: 'extended', label: 'Extended', description: 'Full letter/email', icon: '📄' }
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
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={formatSpecificOptions.emailSubject}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                emailSubject: e.target.value
              }))}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
              placeholder="Enter email subject"
            />
          </motion.div>
        );
      case 'text':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Emoji Usage
            </label>
            <select
              value={formatSpecificOptions.emojiPreference}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                emojiPreference: e.target.value
              }))}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
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
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Talking Points
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formatSpecificOptions.talkingPoints}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                talkingPoints: parseInt(e.target.value, 10) || 1
              }))}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
            />
          </motion.div>
        );
      case 'social':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <select
              value={formatSpecificOptions.platform}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                platform: e.target.value
              }))}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Format & Length</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Select how your message will be delivered</p>
      </div>

      <div className="space-y-8">
        {/* Format Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
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
                    ? 'border-transparent ring-2 ring-heartglow-pink bg-gradient-to-br from-heartglow-pink/15 via-gray-800/10 to-heartglow-violet/15'
                    : 'border-gray-700 bg-gray-800/40 hover:bg-gray-700/60 hover:border-heartglow-pink/60'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{format.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{format.label}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{format.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Length Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Message Length
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lengths.map((length) => (
              <motion.div
                key={length.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedLength(length.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedLength === length.id
                    ? 'border-transparent ring-2 ring-heartglow-pink bg-gradient-to-br from-heartglow-pink/15 via-gray-800/10 to-heartglow-violet/15'
                    : 'border-gray-700 bg-gray-800/40 hover:bg-gray-700/60 hover:border-heartglow-pink/60'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <span className="text-xl">{length.icon}</span>
                </div>
                <h4 className="font-medium text-center text-gray-900 dark:text-white">{length.label}</h4>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">{length.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Format-Specific Options */}
        {selectedFormat && renderFormatSpecificOptions()}
      </div>

      <div className="flex justify-between mt-8">
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
            !selectedFormat || !selectedLength
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-heartglow-pink hover:bg-heartglow-pink/90'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FormatStep; 