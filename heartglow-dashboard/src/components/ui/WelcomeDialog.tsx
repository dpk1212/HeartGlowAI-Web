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
      <DialogContent className="rounded-[24px] shadow-2xl max-w-md p-8 bg-gradient-to-br from-[#181830]/95 to-[#0D0D1D]/95 backdrop-blur-md border border-[#3A3A5C]/20 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative overflow-hidden">
          {/* Ambient glow effect in corners */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FF4F81]/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#8C30F5]/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="space-y-7 text-center relative z-10">
            {/* HEADLINE - Serif, elegant */}
            <h2 className="text-3xl font-serif text-white/95 leading-tight hover:text-white/100 transition-colors duration-300 py-1">
              You don't have to figure it all out alone 💬
            </h2>

            {/* EMOTIONAL COPY - Whisper-like */}
            <p className="text-[#E2E2E2]/80 text-sm italic font-light leading-relaxed">
              Whether it's a situationship that's confusing, a relationship that feels tense, or a moment that just deserves better words — you're in the right place.
            </p>

            {/* CORE VALUE COPY - Clean with breathing space */}
            <div className="text-sm text-[#E2E2E2]/90 space-y-4 leading-relaxed">
              <p>
                HeartGlow helps you express what you're feeling — with clarity, kindness, and courage.
              </p>
              <p>
                We don't just give you the right words. We help you understand yourself as you write them.
              </p>
            </div>

            {/* EMOTION OPTIONS - Pill-like cards instead of bullets */}
            <div className="flex flex-col gap-3 py-2">
              <p className="text-sm font-medium text-white/90 text-left mb-1">Start by choosing your path:</p>
              
              <button className="text-left px-4 py-3 rounded-xl bg-[#1F1F3A]/40 hover:bg-[#1F1F3A]/70 border border-[#3A3A5C]/30 hover:border-[#3A3A5C]/50 transition-all duration-300 group">
                <span className="flex items-center text-[#E2E2E2]/90 group-hover:text-white/95">
                  <span className="mr-2 text-lg">💭</span>
                  <span className="text-sm">"What even are we?" <span className="text-xs opacity-70 ml-1">(Decode your situationship)</span></span>
                </span>
              </button>
              
              <button className="text-left px-4 py-3 rounded-xl bg-[#1F1F3A]/40 hover:bg-[#1F1F3A]/70 border border-[#3A3A5C]/30 hover:border-[#3A3A5C]/50 transition-all duration-300 group">
                <span className="flex items-center text-[#E2E2E2]/90 group-hover:text-white/95">
                  <span className="mr-2 text-lg">🩺</span>
                  <span className="text-sm">"I need to say something hard" <span className="text-xs opacity-70 ml-1">(Navigate conflict gently)</span></span>
                </span>
              </button>
              
              <button className="text-left px-4 py-3 rounded-xl bg-[#1F1F3A]/40 hover:bg-[#1F1F3A]/70 border border-[#3A3A5C]/30 hover:border-[#3A3A5C]/50 transition-all duration-300 group">
                <span className="flex items-center text-[#E2E2E2]/90 group-hover:text-white/95">
                  <span className="mr-2 text-lg">❤️</span>
                  <span className="text-sm">"They deserve to hear this" <span className="text-xs opacity-70 ml-1">(Send love with intention)</span></span>
                </span>
              </button>
            </div>

            {/* CTA - Glowing, rounded pill */}
            <div className="space-y-3 mt-6">
              <Button 
                className={cn(
                  "w-full h-12 rounded-full text-white/95 text-lg font-medium",
                  "bg-gradient-to-r from-[#FF4F81] via-[#BD4FFF] to-[#8C30F5]",
                  "hover:from-[#FF6B96] hover:via-[#CA5FFF] hover:to-[#9A45FF]",
                  "shadow-[0_0_15px_rgba(255,79,129,0.4)] hover:shadow-[0_0_20px_rgba(255,79,129,0.6)]",
                  "border border-white/10 transition-all duration-300"
                )}
                onClick={handleStart}
              >
                Start My Conversation ✨
              </Button>
              
              {/* Delayed appearance quote */}
              <p className="text-xs text-[#E2E2E2]/60 italic animate-fade-in-delay">
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