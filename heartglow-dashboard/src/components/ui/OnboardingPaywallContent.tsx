import React from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  PencilIcon, 
  LightBulbIcon 
} from '@heroicons/react/24/outline';

// Define the PaywallContent interface locally to avoid circular dependencies
interface PaywallFeature {
  name: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PaywallContent {
  title: React.ReactNode;
  description: React.ReactNode;
  features: PaywallFeature[];
  ctaText: string;
  footerText: React.ReactNode;
  dismissText?: string;
  closingMessage?: React.ReactNode;
}

/**
 * Custom paywall content for showing immediately after welcome dialog
 * Designed to feel like part of the onboarding flow with a seamless transition
 * Enhanced with more sophisticated visual styling
 */
export const onboardingPaywallContent: PaywallContent = {
  title: (
    <span className="text-gradient-primary font-serif">
      Great relationships don't just happen. They're built — one message, one moment, one conversation at a time.
    </span>
  ),
  description: (
    <span className="leading-relaxed">
      HeartGlowAI is your unified relationship companion — a powerful, private chat experience that helps you improve how you communicate, resolve tension, build connection, and say the things that matter most.
    </span>
  ),
  features: [
    { 
      name: 'Real-time chat guidance for navigating love, conflict, and confusion',
      description: 'Get instant help crafting messages that convey your feelings accurately',
      icon: ChatBubbleLeftRightIcon 
    },
    { 
      name: 'Message crafting & emotional framing — no more overthinking',
      description: 'Turn complex feelings into clear, compassionate communication',
      icon: PencilIcon 
    },
    { 
      name: 'Ongoing coaching & insight to grow in every relationship you care about',
      description: 'Build better communication patterns over time with personalized guidance',
      icon: LightBulbIcon 
    },
  ],
  ctaText: "Start Free — Begin Your Premium Journey",
  footerText: (
    <span className="space-y-1">
      <span className="block font-medium">7-day free trial · Cancel anytime · Privacy guaranteed</span>
      <span className="block text-xs italic mt-2.5">It's not just what you say. It's how you grow through saying it.</span>
    </span>
  ),
  dismissText: "Continue with free access",
  closingMessage: "You don't have to navigate love, conflict, or connection alone anymore. Let HeartGlow guide the way."
};

export default onboardingPaywallContent; 