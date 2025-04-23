import React from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  PencilIcon, 
  BrainIcon 
} from '@heroicons/react/24/outline';
import type { PaywallContent } from './PaywallModal';

/**
 * Custom paywall content for showing immediately after welcome dialog
 * Designed to feel like part of the onboarding flow with a seamless transition
 */
export const onboardingPaywallContent: PaywallContent = {
  title: (
    <span className="text-gradient-primary">
      Great relationships don't just happen. They're built — one message, one moment, one conversation at a time.
    </span>
  ),
  description: (
    <span>
      HeartGlowAI is your unified relationship companion — a powerful, private chat experience that helps you improve how you communicate, resolve tension, build connection, and say the things that matter most.
    </span>
  ),
  features: [
    { 
      name: 'Real-time chat guidance for navigating love, conflict, and confusion',
      icon: ChatBubbleLeftRightIcon 
    },
    { 
      name: 'Message crafting & emotional framing — no more overthinking',
      icon: PencilIcon 
    },
    { 
      name: 'Ongoing coaching & insight to grow in every relationship you care about',
      icon: BrainIcon 
    },
  ],
  ctaText: "Start Free — Begin Your Premium Journey",
  footerText: (
    <span className="space-y-1">
      <span className="block">7-day free trial · Cancel anytime · Privacy guaranteed</span>
      <span className="block text-xs italic mt-2">It's not just what you say. It's how you grow through saying it.</span>
    </span>
  ),
  dismissText: "Continue with free access",
  closingMessage: "You don't have to navigate love, conflict, or connection alone anymore. Let HeartGlow guide the way."
};

export default onboardingPaywallContent; 