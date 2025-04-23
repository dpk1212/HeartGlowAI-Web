import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Welcome dialog that appears on a user's first visit to HeartGlow.
 * Uses localStorage to track whether the user has seen it before.
 * Provides emotional support and guidance for users who may be feeling:
 * - Stuck in a situationship
 * - Unsure how to communicate with a partner
 * - Emotionally overwhelmed
 * - In conflict with someone important
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
      <DialogContent className="rounded-2xl shadow-xl max-w-md p-8 bg-background/90 backdrop-blur border border-muted/20 animate-in fade-in zoom-in-95 duration-500">
        <div className="space-y-6 text-center">

          {/* HEADLINE */}
          <h2 className="text-3xl font-serif text-primary leading-tight">
            You don't have to figure it all out alone 💬
          </h2>

          {/* EMOTIONAL COPY */}
          <p className="text-muted-foreground text-sm italic">
            Whether it's a situationship that's confusing, a relationship that feels tense, or a moment that just deserves better words — you're in the right place.
          </p>

          {/* CORE VALUE COPY */}
          <div className="text-sm text-muted-foreground space-y-3">
            <p>
              HeartGlow helps you express what you're feeling — with clarity, kindness, and courage.
            </p>
            <p>
              We don't just give you the right words. We help you understand yourself as you write them.
            </p>
          </div>

          {/* QUICK EMOTIONAL START */}
          <div className="bg-muted/10 p-4 rounded-xl text-left space-y-2">
            <p className="text-sm font-medium text-foreground">Start by choosing your path:</p>
            <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
              <li>"What even are we?" 💭 (Decode your situationship)</li>
              <li>"I need to say something hard" 🩺 (Navigate conflict gently)</li>
              <li>"They deserve to hear this" ❤️ (Send love with intention)</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-2">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 shadow-glow rounded-xl py-2 text-lg"
              onClick={handleStart}
            >
              Start My Conversation ✨
            </Button>
            <p className="text-xs text-muted-foreground italic">
              "One message. That's all it takes to shift a connection."  
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeDialog; 