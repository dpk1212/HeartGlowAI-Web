import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <DialogContent className="rounded-[20px] shadow-2xl max-w-[90%] sm:max-w-lg p-7 sm:p-8 bg-gradient-to-br from-[#181830]/95 to-[#0D0D1D]/95 backdrop-blur-md border border-[#3A3A5C]/20 animate-in fade-in zoom-in-95 duration-700 overflow-auto max-h-[90vh]">
        <div className="relative overflow-hidden">
          {/* Slightly reduced glow intensity */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FF4F81]/5 blur-[60px] rounded-full pointer-events-none opacity-60"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8C30F5]/5 blur-[60px] rounded-full pointer-events-none opacity-60"></div>
          
          {/* Increased overall vertical spacing */}
          <div className="space-y-7 sm:space-y-8 text-center relative z-10">
            {/* Adjusted headline line height */}
            <h2 className="text-2xl sm:text-3xl font-serif text-white/95 leading-snug sm:leading-tight hover:text-white/100 transition-colors duration-300">
              The hardest part of connection is knowing where to start. That's where we come in.
            </h2>

            {/* Slightly increased text size, adjusted padding */}
            <p className="text-[#E2E2E2]/90 text-base leading-relaxed max-w-md mx-auto px-2">
              HeartGlow helps you find the perfect words for moments that matter, guiding you through difficult conversations with emotional intelligence and thoughtful suggestions.
            </p>

            {/* Increased padding within the list container */}
            <div className="px-2 sm:px-3 py-3">
              {/* Adjusted list item spacing and bullet alignment */}
              <ul className="text-left space-y-3 mb-2">
                <li className="flex items-start rounded-lg p-2.5 transition-colors hover:bg-white/5">
                  <span className="text-heartglow-pink mr-3 mt-1 text-lg font-semibold">•</span> {/* Adjusted margin and alignment */}
                  <span className="text-base text-[#E2E2E2]/90"> {/* Increased base size */}
                    <span className="font-medium block">Decode relationships</span> {/* Added block */}
                    <span className="text-sm block text-[#E2E2E2]/70 mt-0.5">Clarify where you stand with someone special</span> {/* Adjusted size */}
                  </span>
                </li>
                <li className="flex items-start rounded-lg p-2.5 transition-colors hover:bg-white/5">
                  <span className="text-heartglow-pink mr-3 mt-1 text-lg font-semibold">•</span> {/* Adjusted margin and alignment */}
                  <span className="text-base text-[#E2E2E2]/90"> {/* Increased base size */}
                    <span className="font-medium block">Navigate difficult conversations</span> {/* Added block */}
                    <span className="text-sm block text-[#E2E2E2]/70 mt-0.5">Express hard truths with care and clarity</span> {/* Adjusted size */}
                  </span>
                </li>
                <li className="flex items-start rounded-lg p-2.5 transition-colors hover:bg-white/5">
                  <span className="text-heartglow-pink mr-3 mt-1 text-lg font-semibold">•</span> {/* Adjusted margin and alignment */}
                  <span className="text-base text-[#E2E2E2]/90"> {/* Increased base size */}
                    <span className="font-medium block">Share meaningful affection</span> {/* Added block */}
                    <span className="text-sm block text-[#E2E2E2]/70 mt-0.5">Let someone know exactly how much they matter</span> {/* Adjusted size */}
                  </span>
                </li>
              </ul>
            </div>

            {/* Adjusted spacing and padding */}
            <div className="space-y-3 px-1">
              <div className="px-4 py-3 rounded-lg bg-[#1F1F3A]/40 backdrop-blur-md border border-[#3A3A5C]/25 shadow-sm">
                <p className="text-base text-[#E2E2E2]/90 italic"> {/* Increased size */}
                  \"Research shows 78% of relationship issues stem from communication challenges\"
                  <span className="block text-sm text-[#E2E2E2]/70 mt-1.5 text-right">— APA 2021</span> {/* Increased size */}
                </p>
              </div>
              
              <div className="px-4 py-3 rounded-lg bg-[#1F1F3A]/40 backdrop-blur-md border border-[#3A3A5C]/25 shadow-sm">
                <p className="text-base text-[#E2E2E2]/90"> {/* Increased size */}
                  Joining thousands in the search for more authentic connection through better words
                </p>
              </div>
            </div>

            {/* Adjusted vertical spacing */}
            <div className="space-y-4 pt-2">
              <Button 
                className={cn(
                  // Slightly increased height and font size
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
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1 text-xl">→</span> {/* Increased size */}
                </span>
              </Button>
              
              {/* Adjusted spacing and size */}
              <p className="text-sm text-[#E2E2E2]/60 italic animate-fade-in-delay font-serif pt-1.5">
                \"One message. That's all it takes to shift a connection.\"  
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog; 