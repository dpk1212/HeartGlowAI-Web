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
  title: string;
  description: string;
  features: PaywallFeature[];
  ctaText: string;
  footerText: string;
  dismissText?: string;
  closingMessage?: string;
}

/**
 * Custom paywall content for showing immediately after welcome dialog
 * Designed to feel like part of the onboarding flow with a seamless transition
 * Enhanced with more sophisticated visual styling
 */
export const onboardingPaywallContent: PaywallContent = {
  title: 
    "Unlock the Full HeartGlow Experience",
  description: 
    "HeartGlowAI is your unified relationship companion — a powerful, private chat experience that helps you improve how you communicate, resolve tension, build connection, and say the things that matter most.",
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
  ctaText: 
    "Upgrade to Premium ($4.99/month)",
  footerText: 
    "Unlock powerful features. Cancel anytime. Privacy guaranteed.",
  dismissText: "Continue with free access",
  closingMessage: "You don't have to navigate love, conflict, or connection alone anymore. Let HeartGlow guide the way."
};

export default onboardingPaywallContent; 