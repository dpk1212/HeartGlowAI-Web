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
      <DialogContent className="rounded-[20px] shadow-2xl max-w-[90%] sm:max-w-md p-6 sm:p-7 bg-gradient-to-br from-[#181830]/95 to-[#0D0D1D]/95 backdrop-blur-md border border-[#3A3A5C]/20 animate-in fade-in zoom-in-95 duration-700 overflow-auto max-h-[90vh]">
        <div className="relative overflow-hidden">
          {/* Ambient glow effect in corners - refined for better visual effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FF4F81]/10 blur-[50px] rounded-full pointer-events-none opacity-70"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8C30F5]/10 blur-[50px] rounded-full pointer-events-none opacity-70"></div>
          
          <div className="space-y-6 sm:space-y-7 text-center relative z-10">
            {/* HEADLINE - Refined typography */}
            <h2 className="text-2xl sm:text-3xl font-serif text-white/95 leading-tight hover:text-white/100 transition-colors duration-300">
              The hardest part of connection is knowing where to start. That's where we come in.
            </h2>

            {/* STREAMLINED VALUE PROP - Enhanced styling */}
            <p className="text-[#E2E2E2]/90 text-sm leading-relaxed max-w-sm mx-auto px-1">
              HeartGlow helps you find the perfect words for moments that matter, guiding you through difficult conversations with emotional intelligence and thoughtful suggestions.
            </p>

            {/* KEY USE CASES - Refined card-style bullets */}
            <div className="px-1 sm:px-2 py-2">
              <ul className="text-left space-y-2.5 mb-1">
                <li className="flex items-start rounded-lg p-2 transition-colors hover:bg-white/5">
                  <span className="text-heartglow-pink mr-2.5 mt-0.5 text-lg">•</span>
                  <span className="text-sm text-[#E2E2E2]/90">
                    <span className="font-medium">Decode relationships</span> 
                    <span className="text-xs block text-[#E2E2E2]/70 mt-0.5">Clarify where you stand with someone special</span>
                  </span>
                </li>
                <li className="flex items-start rounded-lg p-2 transition-colors hover:bg-white/5">
                  <span className="text-heartglow-pink mr-2.5 mt-0.5 text-lg">•</span>
                  <span className="text-sm text-[#E2E2E2]/90">
                    <span className="font-medium">Navigate difficult conversations</span>
                    <span className="text-xs block text-[#E2E2E2]/70 mt-0.5">Express hard truths with care and clarity</span>
                  </span>
                </li>
                <li className="flex items-start rounded-lg p-2 transition-colors hover:bg-white/5">
                  <span className="text-heartglow-pink mr-2.5 mt-0.5 text-lg">•</span>
                  <span className="text-sm text-[#E2E2E2]/90">
                    <span className="font-medium">Share meaningful affection</span>
                    <span className="text-xs block text-[#E2E2E2]/70 mt-0.5">Let someone know exactly how much they matter</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* SOCIAL PROOF SECTION - Refined card styling */}
            <div className="space-y-2.5">
              <div className="px-4 py-2.5 rounded-lg bg-[#1F1F3A]/30 backdrop-blur-md border border-[#3A3A5C]/20 shadow-sm">
                <p className="text-sm text-[#E2E2E2]/90 italic">
                  "Research shows 78% of relationship issues stem from communication challenges"
                  <span className="block text-xs text-[#E2E2E2]/70 mt-1 text-right">— APA 2021</span>
                </p>
              </div>
              
              <div className="px-4 py-2.5 rounded-lg bg-[#1F1F3A]/30 backdrop-blur-md border border-[#3A3A5C]/20 shadow-sm">
                <p className="text-sm text-[#E2E2E2]/90">
                  Joining thousands in the search for more authentic connection through better words
                </p>
              </div>
            </div>

            {/* UPDATED CTA - Refined button styling */}
            <div className="space-y-3 mt-4">
              <Button 
                className={cn(
                  "w-full h-11 rounded-full text-white/95 text-base font-medium group transition-all",
                  "bg-gradient-to-r from-[#FF4F81] via-[#BD4FFF] to-[#8C30F5]",
                  "hover:from-[#FF6B96] hover:via-[#CA5FFF] hover:to-[#9A45FF]",
                  "shadow-[0_0_15px_rgba(255,79,129,0.3)] hover:shadow-[0_0_20px_rgba(255,79,129,0.5)]",
                  "border border-white/10 backdrop-blur-md"
                )}
                onClick={handleStart}
              >
                <span className="flex items-center justify-center">
                  Start Your Connection Journey 
                  <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Button>
              
              {/* KEPT QUOTE - With enhanced styling */}
              <p className="text-xs text-[#E2E2E2]/60 italic animate-fade-in-delay font-serif pt-1">
                "One message. That's all it takes to shift a connection."  
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog; 