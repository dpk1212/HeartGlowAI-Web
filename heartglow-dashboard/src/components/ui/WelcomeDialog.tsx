import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatBubbleLeftRightIcon, PencilIcon, SparklesIcon } from '@heroicons/react/24/outline';

/**
 * Welcome dialog that appears on a user's first visit to HeartGlow.
 * Uses localStorage to track whether the user has seen it before.
 * Provides emotional support and guidance for users who may be feeling:
 * - Stuck in a situationship
 * - Unsure how to communicate with a partner
 * - Emotionally overwhelmed
 * - In conflict with someone important
 * 
 * Design focuses on creating a warm, elegant, and deeply human experience
 * that feels like a quiet, luxurious room where users can feel everything.
 */
interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  onStartConversation: () => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ 
  open, 
  onClose,
  onStartConversation
}) => {
  const handleStart = () => {
    onStartConversation();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-xl shadow-2xl max-w-[90%] sm:max-w-md p-6 sm:p-8 bg-gradient-to-br from-[#181830]/95 to-[#0D0D1D]/95 backdrop-blur-lg border border-[#3A3A5C]/25 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
        <div className="relative">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FF4F81]/5 blur-[50px] rounded-full pointer-events-none opacity-50"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#8C30F5]/5 blur-[50px] rounded-full pointer-events-none opacity-50"></div>
          
          <div className="space-y-6 text-center relative z-10 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white/95 leading-tight">
              Unlock Better Connections. Today.
            </h2>

            <p className="text-gray-300/90 text-base leading-relaxed max-w-xs sm:max-w-sm">
              Stop guessing. HeartGlow's AI helps you navigate tough talks & express yourself clearly.
            </p>

            <div className="w-full pt-2 pb-1">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="flex flex-col items-center space-y-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-7 w-7 text-heartglow-pink/80" />
                  <span className="text-xs sm:text-sm font-medium text-gray-300/80">Navigate Conflict</span>
                </div>
                <div className="flex flex-col items-center space-y-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <PencilIcon className="h-7 w-7 text-heartglow-pink/80" />
                  <span className="text-xs sm:text-sm font-medium text-gray-300/80">Express Clearly</span>
                </div>
                <div className="flex flex-col items-center space-y-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <SparklesIcon className="h-7 w-7 text-heartglow-pink/80" />
                  <span className="text-xs sm:text-sm font-medium text-gray-300/80">Deepen Bonds</span>
                </div>
              </div>
            </div>

            <div className="w-full pt-3">
              <Button 
                className={cn(
                  "w-full h-12 rounded-full text-white/95 text-[17px] font-medium group transition-all", 
                  "bg-gradient-to-r from-[#FF4F81] via-[#BD4FFF] to-[#8C30F5]",
                  "hover:from-[#FF6B96] hover:via-[#CA5FFF] hover:to-[#9A45FF]",
                  "shadow-[0_0_15px_rgba(255,79,129,0.3)] hover:shadow-[0_0_20px_rgba(255,79,129,0.5)]",
                  "border border-white/10 backdrop-blur-md"
                )}
                onClick={handleStart}
              >
                <span className="flex items-center justify-center">
                  Start Your Connection Journey 
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1 text-xl">→</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog; 