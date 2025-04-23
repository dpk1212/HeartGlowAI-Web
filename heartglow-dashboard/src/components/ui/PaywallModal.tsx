import React, { useState } from 'react';
// import { loadStripe, Stripe } from '@stripe/stripe-js'; // Removed Stripe import
import { Dialog } from '@headlessui/react'; // Using Headless UI for modal accessibility
import { CheckIcon, LockClosedIcon, SparklesIcon, UsersIcon, BookmarkIcon, ChatBubbleLeftRightIcon, PencilIcon, LightBulbIcon } from '@heroicons/react/24/outline'; // Replaced BrainIcon with LightBulbIcon
import { useAuth } from '../../context/AuthContext'; // Import useAuth

// Import Firebase Analytics
import { logEvent } from 'firebase/analytics';
import { analytics as firebaseAnalytics } from '../../lib/firebase'; // Import the analytics instance

interface PaywallFeature {
  name: string;
  description?: string; // Optional description for more detailed feature explanation
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Icon component is optional
}

interface PaywallContent {
  title: React.ReactNode;
  description: React.ReactNode;
  features: PaywallFeature[];
  ctaText: string;
  footerText: React.ReactNode;
  dismissText?: string; // Optional override for dismiss button text
  closingMessage?: React.ReactNode; // Added closing message for emotional value
}

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: PaywallContent; // Optional content prop
  isPostWelcome?: boolean; // Flag to indicate if this is shown right after welcome
}

// Default content if no custom content is provided
const defaultFeatures: PaywallFeature[] = [
  { 
    name: 'Save Unlimited Messages', 
    description: 'Never lose a meaningful exchange',
    icon: BookmarkIcon 
  },
  { 
    name: 'Continue Your Coaching Journey', 
    description: 'Get guided support for your relationship growth',
    icon: ChatBubbleLeftRightIcon 
  },
  { 
    name: 'Track & Deepen Your Connections', 
    description: 'See your relationship progress over time',
    icon: UsersIcon 
  },
  { 
    name: 'Grow with GlowScore & Challenges', 
    description: 'Gamified improvement for your communication skills',
    icon: SparklesIcon 
  },
  { 
    name: 'Unlock Premium Tones & Templates', 
    description: 'Access a library of pre-crafted message frameworks',
    icon: PencilIcon 
  },
];

const defaultContent: PaywallContent = {
  title: "Keep Growing. Keep Glowing.",
  description: "You've taken the first step — now unlock the full journey of connection. HeartGlow Premium gives you the space, tools, and support to deepen your relationships — one message, one insight, one meaningful moment at a time.",
  features: defaultFeatures,
  ctaText: "Upgrade to HeartGlow Premium",
  footerText: <>Start your growth for just $4.99/month – Cancel anytime</>, // Example price, adjust as needed
  dismissText: "Not now. Keep exploring for free."
};

const PaywallModal: React.FC<PaywallModalProps> = ({ 
  isOpen, 
  onClose, 
  content: customContent,
  isPostWelcome = false
}) => {
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use custom content if provided, otherwise use defaults
  const content = customContent || defaultContent;

  // --- Analytics Helper (Simplified for this component) ---
  const logPaywallEvent = async (eventName: string, params?: { [key: string]: any }) => {
    try {
      const analyticsInstance = await firebaseAnalytics; // Resolve the promise
      if (analyticsInstance) {
        logEvent(analyticsInstance, eventName, params);
        console.log(`[Firebase Analytics] Logged paywall event: ${eventName}`, params);
      } else {
        console.warn('[Firebase Analytics] Analytics not supported or initialized.');
      }
    } catch (error) {
      console.error('[Firebase Analytics] Error logging paywall event:', error);
    }
  };

  const handleUpgradeClick = async () => {
    setIsLoading(true);
    setError(null);
    logPaywallEvent('paywall_action', { 
      action_description: 'click_upgrade_cta',
      is_post_welcome: isPostWelcome 
    });

    if (!currentUser) {
        setError('User not authenticated. Please log in again.');
        setIsLoading(false);
        return;
    }
    
    // Ensure stripePromise is not needed here - currently uses direct link
    // if (!stripePromise) {
    //     setError('Payment system is not available. Please try again later.');
    //     setIsLoading(false);
    //     return;
    // }

    const paymentLinkUrl = `https://buy.stripe.com/4gw03z8Tf1cW2sw8ww?client_reference_id=${currentUser.uid}`;
    console.log('Redirecting to Stripe Payment Link:', paymentLinkUrl);
    window.location.href = paymentLinkUrl;
    setIsLoading(false); // Set loading false after initiating redirect
  };

  // Background and animation classes enhanced for when shown after welcome
  const panelClasses = isPostWelcome 
    ? "mx-auto w-full max-w-[90%] sm:max-w-lg rounded-[20px] bg-gradient-to-br from-[#181830]/95 to-[#0D0D1D]/95 p-6 sm:p-7 shadow-2xl border border-[#3A3A5C]/20 animate-in fade-in zoom-in-95 duration-700 overflow-auto max-h-[90vh]"
    : "mx-auto w-full max-w-[90%] sm:max-w-lg rounded-[20px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 sm:p-7 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-auto max-h-[90vh]";

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className={`fixed inset-0 ${isPostWelcome ? 'bg-black/60' : 'bg-black/40 dark:bg-black/60'} backdrop-blur-sm`} aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel */}
        <Dialog.Panel className={panelClasses}>
          {/* Ambient glow effect for post-welcome version */}
          {isPostWelcome && (
            <>
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FF4F81]/10 blur-[50px] rounded-full pointer-events-none opacity-70"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8C30F5]/10 blur-[50px] rounded-full pointer-events-none opacity-70"></div>
            </>
          )}
          
          <div className="relative z-10">
            <Dialog.Title className={`text-2xl sm:text-3xl font-bold text-center ${isPostWelcome ? 'text-white/95' : 'text-transparent bg-clip-text bg-gradient-to-r from-heartglow-pink to-heartglow-violet'} mb-4`}>
              {content.title}
            </Dialog.Title>
            <Dialog.Description className={`text-center ${isPostWelcome ? 'text-[#E2E2E2]/90' : 'text-gray-600 dark:text-gray-300'} mb-6 whitespace-pre-line text-sm`}>
              {content.description}
            </Dialog.Description>

            <div className="space-y-3 mb-6">
              {content.features.map((feature) => (
                <div 
                  key={feature.name} 
                  className={`flex items-start p-2 rounded-lg ${isPostWelcome ? 'hover:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'} transition-colors`}
                >
                  {/* Use a default check icon if no specific icon provided */}
                  {feature.icon ? (
                    <feature.icon className={`h-5 w-5 ${isPostWelcome ? 'text-heartglow-pink' : 'text-green-500'} mr-3 mt-0.5 flex-shrink-0`} aria-hidden="true" />
                  ) : (
                    <CheckIcon className={`h-5 w-5 ${isPostWelcome ? 'text-heartglow-pink' : 'text-green-500'} mr-3 mt-0.5 flex-shrink-0`} aria-hidden="true" />
                  )}
                  <div>
                    <span className={isPostWelcome ? 'text-[#E2E2E2]/90' : 'text-gray-700 dark:text-gray-200'}>
                      {feature.name}
                    </span>
                    {feature.description && (
                      <span className={`block text-xs ${isPostWelcome ? 'text-[#E2E2E2]/70' : 'text-gray-500 dark:text-gray-400'} mt-0.5`}>
                        {feature.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {content.closingMessage && (
              <div className={`text-center ${isPostWelcome ? 'text-[#E2E2E2]/80 italic' : 'text-gray-600 dark:text-gray-300 italic'} mb-5 text-sm`}>
                "{content.closingMessage}"
              </div>
            )}
            
            <div className={`text-center text-xs ${isPostWelcome ? 'text-[#E2E2E2]/70' : 'text-gray-500 dark:text-gray-400'} mb-5 flex items-center justify-center`}>
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
              className={`w-full px-6 py-3 ${isPostWelcome 
                ? "bg-gradient-to-r from-[#FF4F81] via-[#BD4FFF] to-[#8C30F5] hover:from-[#FF6B96] hover:via-[#CA5FFF] hover:to-[#9A45FF] shadow-[0_0_15px_rgba(255,79,129,0.3)] hover:shadow-[0_0_20px_rgba(255,79,129,0.5)]" 
                : "bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:opacity-90"} text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group`}
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
                <span className="flex items-center justify-center">
                  {content.ctaText}
                  {isPostWelcome && <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>}
                </span>
              )}
            </button>
             <p className={`text-center text-xs ${isPostWelcome ? 'text-[#E2E2E2]/70' : 'text-gray-500 dark:text-gray-400'} mt-3`}>
               {content.footerText}
             </p>

            <button
              onClick={onClose} // Use the passed onClose handler
              disabled={isLoading}
              className={`w-full mt-4 px-6 py-2 text-sm ${isPostWelcome 
                ? 'text-[#E2E2E2]/60 hover:text-white/80' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'} font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-200 ease-in-out disabled:opacity-60`}
            >
              {content.dismissText || defaultContent.dismissText}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaywallModal; 