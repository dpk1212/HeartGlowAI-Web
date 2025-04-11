import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateMessage, generateMessageDirect, MessageGenerationParams } from '../../lib/openai';
import { motion } from 'framer-motion';

interface MessageOutputProps {
  recipient: {
    name: string;
    relationship: string;
    id?: string;
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

export default function MessageOutput({ 
  recipient,
  intent,
  format,
  tone,
  advanced
}: MessageOutputProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const generate = async () => {
      try {
        setIsGenerating(true);
        setError(null);

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

        // Try cloud function first, fall back to direct OpenAI if needed
        let result;
        try {
          result = await generateMessage(params);
        } catch (cloudError) {
          console.warn('Cloud function failed, falling back to direct OpenAI:', cloudError);
          result = await generateMessageDirect(params);
        }

        setMessage(result.content);
        setInsights(result.insights);
      } catch (err) {
        console.error('Error generating message:', err);
        setError('Failed to generate message. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [recipient, intent, format, tone, advanced]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy message:', err);
      });
  };

  const handleSave = async () => {
    if (!user) {
      setSaveError('You must be logged in to save messages');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const messageData = {
        content: message,
        recipientName: recipient.name,
        recipientId: recipient.id || null,
        relationship: recipient.relationship,
        intent: intent.type,
        tone: tone,
        intensity: advanced?.intensity || 3,
        createdAt: serverTimestamp(),
        insights: insights,
        messageCategory: intent.type,
        messageFormat: format.type,
        messageIntention: intent.custom || intent.type,
        messageConfigTimestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'users', user.uid, 'messages'), messageData);
      
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving message:', error);
      setSaveError('Failed to save message. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Crafting your heartfelt message...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
          {error}
        </h3>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-full px-6 py-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Message Is Ready</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Crafted for {recipient.name} with {format.type === 'email' ? 'an email' : 'a message'} that conveys {intent.type}
        </p>
      </div>

      <div className="bg-white dark:bg-heartglow-deepgray p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-heartglow-charcoal dark:text-heartglow-offwhite">
            Message for {recipient.name}
          </h3>
          <button 
            onClick={handleCopyToClipboard}
            className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
          >
            {isCopied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-800/30 p-5 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{message}</p>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="bg-white dark:bg-heartglow-deepgray p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite">
            Why This Message Works
          </h3>
          <ul className="space-y-3">
            {insights.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="min-w-[20px] h-5 flex items-center justify-center mr-2 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-heartglow-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{insight}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving || !message}
          className={`w-full sm:w-auto px-6 py-3 rounded-full ${
            isSaving || !message
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-violet hover:to-heartglow-indigo text-white'
          } font-medium focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Message
            </>
          )}
        </button>
        
        <button
          onClick={handleCopyToClipboard}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors flex justify-center items-center"
        >
          {isCopied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied to Clipboard
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to Clipboard
            </>
          )}
        </button>
        
        {saveSuccess && (
          <span className="text-green-600 dark:text-green-400 mt-2 sm:mt-0">Message saved successfully!</span>
        )}
        
        {saveError && (
          <span className="text-red-600 dark:text-red-400 mt-2 sm:mt-0">{saveError}</span>
        )}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm flex items-center mx-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Dashboard
        </button>
      </div>
    </motion.div>
  );
} 