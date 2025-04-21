import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog } from '@headlessui/react'; // Using Headless UI for modal accessibility
import { CheckIcon, LockClosedIcon, SparklesIcon, UsersIcon, BookmarkIcon, ChatBubbleLeftRightIcon, HeartIcon, UserGroupIcon, ChartBarIcon, PencilIcon, BrainIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

// Load Stripe.js with your publishable key (should be public)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaywallFeature {
  name: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Icon component is optional
}

interface PaywallContent {
  title: React.ReactNode;
  description: React.ReactNode;
  features: PaywallFeature[];
  ctaText: string;
  footerText: React.ReactNode;
  dismissText?: string; // Optional override for dismiss button text
}

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: PaywallContent; // Optional content prop
}

// Default content if no custom content is provided
const defaultFeatures: PaywallFeature[] = [
  { name: 'Save Unlimited Messages', icon: BookmarkIcon },
  { name: 'Continue Your Coaching Journey', icon: ChatBubbleLeftRightIcon },
  { name: 'Track & Deepen Your Connections', icon: UsersIcon },
  { name: 'Grow with GlowScore & Challenges', icon: SparklesIcon },
  { name: 'Unlock Premium Tones & Templates', icon: PencilIcon }, // Changed icon
];

const defaultContent: PaywallContent = {
  title: "Keep Growing. Keep Glowing.",
  description: "You've taken the first step — now unlock the full journey of connection. HeartGlow Premium gives you the space, tools, and support to deepen your relationships — one message, one insight, one meaningful moment at a time.",
  features: defaultFeatures,
  ctaText: "Upgrade to HeartGlow Premium",
  footerText: <>Start your growth for just $4.99/month – Cancel anytime</>, // Example price, adjust as needed
  dismissText: "Not now. Keep exploring for free."
};

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, content: customContent }) => {
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use custom content if provided, otherwise use defaults
  const content = customContent || defaultContent;

  const handleUpgradeClick = async () => {
    setIsLoading(true);
    setError(null);

    if (!currentUser) {
        setError('User not authenticated. Please log in again.');
        setIsLoading(false);
        return;
    }

    try {
      // Get Firebase ID token
      const token = await currentUser.getIdToken();
      
      // 1. Call your backend to create a checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token in header
        },
      });

      const sessionData = await response.json();

      if (!response.ok || !sessionData.url) {
        throw new Error(sessionData.error || 'Failed to create checkout session.');
      }

      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
          throw new Error('Stripe.js failed to load.');
      }
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: sessionData.sessionId });

      if (stripeError) {
        console.error('Stripe Redirect Error:', stripeError);
        setError(stripeError.message || 'Could not redirect to Stripe.');
      }
      // If redirection fails or is cancelled, stop loading
      setIsLoading(false);

    } catch (err) {
      console.error('Upgrade Error:', err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      // Handle specific auth errors if getIdToken fails
      if (message.includes('auth/user-token-expired')) {
          setError('Your session has expired. Please log in again.');
      } else {
          setError(message);
      }
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel */}
        <Dialog.Panel className="mx-auto w-full max-w-lg rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
          <Dialog.Title className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-heartglow-pink to-heartglow-violet mb-2">
            {content.title}
          </Dialog.Title>
          <Dialog.Description className="text-center text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
            {content.description}
          </Dialog.Description>

          <div className="space-y-3 mb-8">
            {content.features.map((feature) => (
              <div key={feature.name} className="flex items-start">
                {/* Use a default check icon if no specific icon provided */}
                {feature.icon ? (
                  <feature.icon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
                )}
                <span className="text-gray-700 dark:text-gray-200">{feature.name}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-6 flex items-center justify-center">
             <LockClosedIcon className="h-3 w-3 mr-1.5" />
             Your messages are yours. Always encrypted. Never shared. Private by design.
          </div>

          {error && (
            <div className="my-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/50 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleUpgradeClick}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white font-bold rounded-lg shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              content.ctaText
            )}
          </button>
           <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
             {content.footerText}
           </p>

          <button
            onClick={onClose} // Use the passed onClose handler
            disabled={isLoading}
            className="w-full mt-4 px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-200 ease-in-out disabled:opacity-60"
          >
            {content.dismissText || defaultContent.dismissText}
          </button>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaywallModal; 