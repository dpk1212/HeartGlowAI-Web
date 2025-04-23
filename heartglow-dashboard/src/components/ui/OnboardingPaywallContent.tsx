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
    "Unlock Confident Communication",
  description: 
    "Stop guessing, start connecting. Premium delivers deeper insights and unlimited guidance.",
  features: [
    { 
      name: 'Unlimited AI Guidance for Any Situation',
      description: 'Navigate every conversation with AI support',
      icon: ChatBubbleLeftRightIcon 
    },
    { 
      name: 'Effortless Message Crafting & Analysis',
      description: 'Express yourself perfectly and understand dynamics',
      icon: PencilIcon 
    },
    { 
      name: 'Track Your Relational Growth Score',
      description: 'See how your communication improves over time',
      icon: LightBulbIcon 
    },
  ],
  ctaText: 
    "Upgrade & Transform ($4.99/month)",
  footerText: 
    "Cancel anytime. Privacy guaranteed.",
  dismissText: "Stay on Free Plan",
  closingMessage: "You don't have to navigate love, conflict, or connection alone anymore. Let HeartGlow guide the way."
};

export default onboardingPaywallContent; 