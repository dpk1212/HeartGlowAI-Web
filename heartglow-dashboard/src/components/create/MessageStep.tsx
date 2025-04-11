import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateMessage, MessageGenerationParams } from '../../lib/openai';

interface MessageStepProps {
  onNext: (data: { message: string }) => void;
  onBack: () => void;
  recipient: {
    name: string;
    relationship: string;
  };
  intent: {
    type: string;
    custom?: string;
  };
  format: {
    type: string;
    length: string;
    options?: Record<string, any>;
  };
  tone: string;
  advanced?: {
    intensity: number;
    customInstructions?: string;
  };
}

export default function MessageStep({ onNext, onBack, recipient, intent, format, tone, advanced }: MessageStepProps) {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const params: MessageGenerationParams = {
        recipient: {
          name: recipient.name,
          relationship: recipient.relationship
        },
        intent,
        format,
        tone,
        advanced
      };

      const result = await generateMessage(params);
      setMessage(result.content);
    } catch (err) {
      setError('Failed to generate message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (message.trim()) {
      onNext({ message: message.trim() });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Write your message</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Write a message for {recipient.name} ({recipient.relationship})
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
              isGenerating
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-heartglow-pink text-white hover:bg-heartglow-pink/90'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-64 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent resize-none"
            placeholder="Write your message here..."
          />
          <div className="absolute bottom-4 right-4 text-sm text-gray-500 dark:text-gray-400">
            {message.length} characters
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!message.trim()}
          className={`px-4 py-2 rounded-lg font-medium ${
            message.trim()
              ? 'bg-heartglow-pink text-white hover:bg-heartglow-pink/90'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 