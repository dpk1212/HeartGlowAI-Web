import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { generateMessage, generateMessageDirect, MessageGenerationParams } from '../../lib/openai';
import { motion } from 'framer-motion';
import { addConnection, updateConnectionWithMessage, deleteConnection } from '../../firebase/db';
import { Copy, Check, ClipboardCopy, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ChallengeDefinition, useChallenges } from '../../hooks/useChallenges';
import { useRouter } from 'next/router';

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
  const [isCopied, setIsCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, userProfile } = useAuth();
  const { challenges: challengeDefs } = useChallenges();
  const [applyToChallenge, setApplyToChallenge] = useState(true);
  const router = useRouter();

  const activeUserChallenge = userProfile?.activeChallenge;
  const activeChallengeDefinition = activeUserChallenge 
      ? challengeDefs.find(def => def.id === activeUserChallenge.challengeId) 
      : null;

  const autoSaveMessage = async (generatedMessage: string, generatedInsights: string[]) => {
    if (!currentUser) {
      console.warn('[autoSaveMessage] No user logged in, cannot save message.');
      return; 
    }
    if (!generatedMessage) {
      console.warn('[autoSaveMessage] No message content generated, cannot save.');
      return;
    }

    console.log('[autoSaveMessage] Attempting to save message for user:', currentUser.uid);
    
    try {
      const messageData = {
        content: generatedMessage,
        recipientName: recipient.name,
        recipientId: recipient.id || null,
        relationship: recipient.relationship,
        intent: intent.type,
        tone: tone,
        intensity: advanced?.intensity || 3,
        createdAt: serverTimestamp(),
        insights: generatedInsights,
        messageCategory: intent.type,
        messageFormat: format.type,
        messageIntention: intent.custom || intent.type,
        messageConfigTimestamp: new Date().toISOString(),
        appliedToChallenge: !!activeUserChallenge && applyToChallenge,
      };
      
      console.log('[autoSaveMessage] Saving data:', messageData);
      const messagesCollectionRef = collection(db, 'users', currentUser.uid, 'messages');
      const docRef = await addDoc(messagesCollectionRef, messageData);
      console.log('[autoSaveMessage] Message auto-saved successfully with ID:', docRef.id);

      // --- Increment User totalMessageCount --- 
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, { totalMessageCount: increment(1) });
      console.log('[autoSaveMessage] Incremented user totalMessageCount.');
      // ----------------------------------------

      // --- Update Connection --- 
      if (recipient.id) { // Only update if we have a connection ID
         await updateConnectionWithMessage(currentUser, recipient.id);
      } else {
          console.warn('[autoSaveMessage] No recipient.id found, cannot update connection message count.');
      }
      // ----------------------

    } catch (saveError) {
      console.error('[autoSaveMessage] Error auto-saving message or updating counts:', saveError);
    }
  };

  useEffect(() => {
    const generateAndSave = async () => {
      let generatedContent = '';
      let generatedInsights: string[] = [];
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

        let result;
        try {
          console.log('[generateAndSave] Calling generateMessage cloud function...');
          result = await generateMessage(params);
          console.log('[generateAndSave] Cloud function result:', result);
        } catch (cloudError) {
          console.warn('[generateAndSave] Cloud function failed, falling back to direct OpenAI:', cloudError);
          result = await generateMessageDirect(params);
          console.log('[generateAndSave] Direct OpenAI result:', result);
        }
        
        if (result && result.content) {
          generatedContent = result.content;
          generatedInsights = result.insights || [];
          setMessage(generatedContent);
          setInsights(generatedInsights);
        } else {
           throw new Error('Invalid response from generation function');
        }

      } catch (err) {
        console.error('Error generating message:', err);
        setError('Failed to generate message. Please try again.');
      } finally {
        setIsGenerating(false);
        // if (!error && generatedContent) {
        //    await autoSaveMessage(generatedContent, generatedInsights); // <-- REMOVE AUTOSAVE CALL
        // }
      }
    };

    generateAndSave();
  // }, [recipient, intent, format, tone, advanced, currentUser]); // Dependencies might need adjustment if autoSaveMessage is removed
  }, [recipient, intent, format, tone, advanced]); // Remove currentUser from dependencies if only used in autoSave

  // Handler for the new Save button
  const handleConfirmSave = async () => {
    if (!message) {
      console.error("No message content to save.");
      // Maybe show an error to the user
      return;
    }
    console.log("handleConfirmSave triggered. applyToChallenge state:", applyToChallenge);
    // Call the existing save logic, which now reads the current checkbox state
    await autoSaveMessage(message, insights);

    // --- Check for Challenge Completion and Set Flag ---
    if (applyToChallenge && activeUserChallenge) {
      // Check if THIS message completes the challenge 
      // (Simple check: assume progress increases by 1, compare with goal)
      // A more robust check might involve querying the DB or getting updated userProfile
      const definition = challengeDefs.find(d => d.id === activeUserChallenge.challengeId);
      const goal = definition?.criteria?.value ?? activeUserChallenge.goal ?? 1;
      const currentProgress = activeUserChallenge.progress ?? 0;
      if (currentProgress + 1 >= Number(goal)) {
        console.log('[handleConfirmSave] Challenge appears completed. Setting sessionStorage flag.');
        sessionStorage.setItem('challengeCompleted', 'true');
      }
    }
    // -------------------------------------------------

    // Optionally, copy after saving or navigate
    handleCopyToClipboard(message); // Example: Copy after saving
    // Optionally navigate or show success message
    // alert("Message saved!"); // Placeholder feedback - REMOVED

    // Navigate back to dashboard after save
    router.push('/');
  };

  const handleCopyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        // TODO: Show error toast?
      });
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 max-w-md mx-auto">
        <motion.div 
           animate={{ rotate: 360 }} 
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           className="w-16 h-16 mb-6 rounded-full border-4 border-gray-600 border-t-heartglow-pink"
         />
        <h2 className="text-xl font-semibold text-gray-300 mb-2">Crafting your heartfelt message...</h2>
        <p className="text-gray-400">This may take just a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-md mx-auto bg-gray-800/50 border border-red-500/30 rounded-xl p-8">
        <div className="w-16 h-16 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-semibold text-red-400 mb-3">
          {error}
        </h3>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-gray-100 font-medium rounded-lg px-6 py-2.5 transition-colors"
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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-3xl mx-auto py-8 md:py-12 space-y-8"
    >
      <div className="text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-transparent bg-clip-text mb-2">
            Your Message Is Ready
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-lg text-gray-400">
            Crafted for {recipient.name} with {format.type === 'email' ? 'an email' : 'a message'} that conveys {intent.type}
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-700/80">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-white">
            Message for {recipient.name}
          </h3>
          <button 
            onClick={() => handleCopyToClipboard(message)}
            className={`text-sm px-3 py-1.5 rounded-full transition-all duration-200 flex items-center focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 focus:ring-offset-gray-900 ${isCopied ? 'bg-green-600/80 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
            aria-label={isCopied ? "Copied!" : "Copy message"}
          >
            {isCopied ? (
              <Check size={16} className="mr-1.5" />
            ) : (
              <Copy size={16} className="mr-1.5" />
            )}
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-700 min-h-[150px]">
          <p className="whitespace-pre-wrap text-gray-200 text-base md:text-lg leading-relaxed">{message}</p>
        </div>
      </motion.div>

      {insights.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-700/80">
          <h3 className="text-xl font-semibold mb-5 text-white">
            Why This Message Works
          </h3>
          <ul className="space-y-4">
            {insights.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start text-gray-300 text-base"
              >
                <CheckCircle size={20} className="w-5 h-5 mr-3 mt-1 text-heartglow-pink flex-shrink-0" />
                <span>{insight}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {activeUserChallenge && activeChallengeDefinition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex items-center justify-center my-6 p-4 bg-gray-800/60 border border-gray-700 rounded-lg"
        >
          <input
            type="checkbox"
            id="applyChallengeCheckbox"
            checked={applyToChallenge}
            onChange={(e) => setApplyToChallenge(e.target.checked)}
            className="w-5 h-5 rounded text-heartglow-pink bg-gray-700 border-gray-600 focus:ring-heartglow-pink dark:focus:ring-offset-gray-800"
          />
          <label htmlFor="applyChallengeCheckbox" className="ml-3 text-sm font-medium text-gray-300">
            Count this message towards the challenge: <span className="font-semibold text-indigo-300">{activeChallengeDefinition.name}</span>
          </label>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + (insights.length * 0.1) }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700/50 mt-8"
      >
        {/* Main Save Button (replaces Copy) */}
        <button 
          // onClick={() => handleCopyToClipboard(message)}
          onClick={handleConfirmSave} // Call the new save handler
          className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-900 shadow-md hover:shadow-lg bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white hover:from-heartglow-pink/90 hover:to-heartglow-violet/90'}`}
          // className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-900 shadow-md hover:shadow-lg ${isCopied ? 'bg-green-600/90 hover:bg-green-700 text-white' : 'bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white hover:from-heartglow-pink/90 hover:to-heartglow-violet/90'}`}
        >
          {/* {isCopied ? (
            <Check size={20} className="mr-2" />
          ) : (
            <ClipboardCopy size={20} className="mr-2" />
          )} */}
          {/* {isCopied ? 'Copied to Clipboard!' : 'Copy to Clipboard'} */}
          <ClipboardCopy size={20} className="mr-2" /> {/* Keep icon */}
          Save & Copy Message
        </button>

        {/* Return to Dashboard Link - REMOVE THIS or change its behavior */}
        <Link 
          href="/" // Keep href for non-JS users, but button handles primary nav
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Return to Dashboard
        </Link>
      </motion.div>
    </motion.div>
  );
} 