import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../../types';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface InteractiveBubbleProps {
  message: Message;
}

const InteractiveBubble: React.FC<InteractiveBubbleProps> = ({ message }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedContent, setRevealedContent] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(message.isRevealed || false);

  const handleReveal = async () => {
    if (isRevealing || isRevealed) return;
    
    setIsRevealing(true);
    
    try {
      const functions = getFunctions();
      const revealBubbleContent = httpsCallable(functions, 'revealBubbleContent');
      
      const result = await revealBubbleContent({
        bubbleType: message.bubbleType,
        guideContext: message.guideContext,
        messageId: message.id
      });
      
      const data = result.data as { success: boolean; content: string };
      
      if (data.success && data.content) {
        setRevealedContent(data.content);
        setIsRevealed(true);
      }
    } catch (error) {
      console.error('Error revealing bubble content:', error);
    } finally {
      setIsRevealing(false);
    }
  };

  if (isRevealed && (revealedContent || message.isRevealed)) {
    // Show revealed content
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">
            {message.bubbleType === 'insights' ? '🧠' : '🎯'}
          </span>
          <span className="text-sm font-medium text-white/80">
            {message.bubbleType === 'insights' ? 'Why This Works' : 'Your Best Path Forward'}
          </span>
        </div>
        <div className="text-white/90 leading-relaxed">
          {revealedContent || message.text}
        </div>
      </motion.div>
    );
  }

  // Show clickable bubble
  return (
    <motion.button
      onClick={handleReveal}
      disabled={isRevealing}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-full bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-400/30 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:from-violet-600/30 hover:to-purple-600/30 hover:border-violet-400/50 cursor-pointer"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      
      <div className="relative flex items-center justify-center space-x-3">
        <span className="text-2xl">
          {message.bubbleType === 'insights' ? '🧠' : '🎯'}
        </span>
        <span className="text-white font-medium">
          {isRevealing ? 'Revealing...' : message.text}
        </span>
        {isRevealing && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default InteractiveBubble;
