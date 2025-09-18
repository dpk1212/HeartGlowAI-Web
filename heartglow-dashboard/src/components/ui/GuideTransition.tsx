import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface GuideTransitionProps {
  isVisible: boolean;
  guideTitle: string;
  onComplete: () => void;
}

const GuideTransition: React.FC<GuideTransitionProps> = ({ 
  isVisible, 
  guideTitle, 
  onComplete 
}) => {
  const [stage, setStage] = useState<'loading' | 'preparing' | 'ready'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    // Shorter, more subtle animation sequence
    const timer1 = setTimeout(() => {
      setStage('preparing');
    }, 600);

    const timer2 = setTimeout(() => {
      setStage('ready');
    }, 1000);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 1400);

    // Faster progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3;
      });
    }, 25);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(progressInterval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      >
        {/* Subtle background gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 opacity-60" />

        {/* Main content */}
        <div className="relative z-10 text-center px-8 max-w-md mx-auto">
          {/* Simplified Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
          </motion.div>

          {/* Guide title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-xl font-semibold text-white mb-3 leading-tight px-4"
          >
            {guideTitle}
          </motion.h2>

          {/* Status text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-white/60 mb-6 text-sm"
          >
            {stage === 'loading' && 'Preparing your guide...'}
            {stage === 'preparing' && 'Almost ready...'}
            {stage === 'ready' && 'Opening chat...'}
          </motion.p>

          {/* Simple progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="space-y-3"
          >
            {/* Simplified animated dots */}
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-white/40 rounded-full"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuideTransition;
