import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { generateMessage, MessageGenerationParams } from '../../lib/openai';
import { motion } from 'framer-motion';
import { addConnection, updateConnectionWithMessage, deleteConnection } from '../../firebase/db';
import { Copy, Check, ClipboardCopy, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { ChallengeDefinition, useChallenges } from '../../hooks/useChallenges';
import { useRouter } from 'next/router';

interface MessageOutputProps {
  recipient: {
    id: string;
    name: string;
    relationship: string;
  } | null;
  connectionData: {
    specificRelationship?: string;
    yearsKnown?: number;
    communicationStyle?: string;
    relationshipGoal?: string;
    lastMessageDate?: any;
  } | null;
  intent: {
    type: string;
    custom?: string;
  } | null;
  format: {
    type: string;
    length: string;
    options?: Record<string, any>;
  } | null;
  tone: string | null;
  promptedBy?: string;
  messageGoal?: string;
  formalityLevel?: number;
  emotionalDepth?: number;
  customInstructionsText?: string;
  customInstructionsOptions?: Record<string, boolean>;
}

export default function MessageOutput({ 
  recipient,
  connectionData,
  intent,
  format,
  tone,
  promptedBy,
  messageGoal,
  formalityLevel,
  emotionalDepth,
  customInstructionsText,
  customInstructionsOptions
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
    if (!currentUser || !recipient) {
      console.warn('[autoSaveMessage] No user or recipient, cannot save message.');
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
        intent: intent?.type || 'unknown',
        tone: tone || 'neutral',
        formality: formalityLevel ?? 3,
        depth: emotionalDepth ?? 3,
        promptContext: promptedBy || null,
        goalContext: messageGoal || null,
        createdAt: serverTimestamp(),
        insights: generatedInsights,
        messageCategory: intent?.type || 'unknown',
        messageFormat: format?.type || 'unknown',
        messageLength: format?.length || 'unknown',
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
      if (!recipient || !intent || !format || !tone) {
        setError("Missing required information to generate message.");
        setIsGenerating(false);
        return; 
      }
      try {
        setIsGenerating(true);
        setError(null);

        const params: MessageGenerationParams = {
          recipient: {
            name: recipient.name,
            relationship: recipient.relationship,
            id: recipient.id
          },
          connectionData: connectionData || {},
          intent,
          format,
          tone,
          promptedBy: promptedBy || '',
          messageGoal: messageGoal || '',
          style: {
             formality: formalityLevel || 3,
             depth: emotionalDepth || 3,
             length: format.length
          },
          customInstructions: {
             text: customInstructionsText || '',
             options: customInstructionsOptions || {}
          }
        };

        let result;
        try {
          console.log('[generateAndSave] Calling generateMessage cloud function with params:', params);
          result = await generateMessage(params);
          console.log('[generateAndSave] Cloud function result:', result);
        } catch (cloudError) {
          console.warn('[generateAndSave] Cloud function failed, falling back:', cloudError);
          throw cloudError;
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
      }
    };

    generateAndSave();
  }, [
      recipient,
      connectionData,
      intent,
      format,
      tone,
      promptedBy,
      messageGoal,
      formalityLevel,
      emotionalDepth,
      customInstructionsText,
      customInstructionsOptions
  ]);

  const handleConfirmSave = async () => {
    if (!message || !recipient) {
      console.error("No message content or recipient to save.");
      return;
    }
    console.log("handleConfirmSave triggered. applyToChallenge state:", applyToChallenge);
    await autoSaveMessage(message, insights);

    if (applyToChallenge && activeUserChallenge) {
      const definition = challengeDefs.find(d => d.id === activeUserChallenge.challengeId);
      const goal = definition?.criteria?.value ?? activeUserChallenge.goal ?? 1;
      const currentProgress = activeUserChallenge.progress ?? 0;
      console.log(`[handleConfirmSave] Checking challenge completion: Progress=${currentProgress}, Goal=${goal}`);
      if (currentProgress + 1 >= Number(goal)) {
        console.log('[handleConfirmSave] Challenge appears completed. Setting sessionStorage flag...');
        sessionStorage.setItem('challengeCompleted', 'true');
        console.log('[handleConfirmSave] sessionStorage flag set.');
      } else {
        console.log('[handleConfirmSave] Challenge not yet completed by this message.');
      }
    }

    handleCopyToClipboard(message);
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

  const recipientName = recipient?.name || 'them';

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
            Crafted for {recipientName} with {format?.type === 'email' ? 'an email' : 'a message'} that conveys {intent?.type || 'your intention'}
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-xl shadow-lg border border-gray-700/80">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-white">
            Message for {recipientName}
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

      {/* Insights Section */}
      {insights && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 md:p-8 rounded-xl shadow-md border border-gray-700/60"
        >
          <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
          <ul className="space-y-3 list-disc list-inside text-gray-300 text-sm">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4 mt-8"
      >
        <Link href="/">
          <button
            className="inline-flex items-center justify-center px-8 py-3 border border-gray-600 text-base font-medium rounded-full shadow-sm text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition-all duration-150 ease-in-out"
          >
            <ArrowLeft size={20} className="mr-2" />
            Return to Dashboard
          </button>
        </Link>
        <button
          onClick={handleConfirmSave}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-pink/90 hover:to-heartglow-violet/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink focus:ring-offset-gray-900 transition-all duration-150 ease-in-out transform hover:scale-105"
        >
          <CheckCircle size={20} className="mr-2" />
          Done - Save & Copy Message
        </button>
      </motion.div>

    </motion.div>
  );
}