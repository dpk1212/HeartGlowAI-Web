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
    name: 'Unlimited Message History & Drafts', 
    description: 'Never lose a meaningful conversation again',
    icon: BookmarkIcon 
  },
  { 
    name: 'AI-Powered Relationship Coaching', 
    description: 'Get personalized guidance for growth and connection',
    icon: ChatBubbleLeftRightIcon 
  },
  { 
    name: 'Advanced Connection Insights', 
    description: 'Track relationship progress with detailed analytics',
    icon: UsersIcon 
  },
  { 
    name: 'Exclusive Tones & Templates', 
    description: 'Access premium message frameworks for any situation',
    icon: SparklesIcon 
  },
  { 
    name: 'Priority AI Generation', 
    description: 'Get faster, higher-quality message crafting',
    icon: LightBulbIcon 
  },
];

const defaultContent: PaywallContent = {
  title: "Ready to Deepen Your Connections?",
  description: "You've experienced the power of thoughtful communication. HeartGlow Premium helps you build meaningful relationships that last — one message, one conversation, one moment at a time.",
  features: defaultFeatures,
  ctaText: "Start 7-Day Free Trial",
  footerText: <>Premium features, zero risk • Cancel anytime</>,
  dismissText: "Continue with limited access",
  closingMessage: "Every relationship worth having deserves the words to make it thrive."
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

  // Enhanced background and animation classes for dark mode experience
  const panelClasses = isPostWelcome || !customContent
    ? "mx-auto w-full max-w-[90%] sm:max-w-lg rounded-[20px] bg-gradient-to-br from-[#181830]/95 to-[#0D0D1D]/95 p-6 sm:p-7 shadow-2xl border border-[#3A3A5C]/20 animate-in fade-in zoom-in-95 duration-700 overflow-auto max-h-[90vh]"
    : "mx-auto w-full max-w-[90%] sm:max-w-lg rounded-[20px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 sm:p-7 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-auto max-h-[90vh]";

  // Determine if we should use the dark themed styling (for the screenshot version)
  const isDarkTheme = isPostWelcome || !customContent;

  // Force display on both mobile and desktop for new users
  const isPresentOnAllDevices = true; // This ensures the component renders on all device types

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Enhanced backdrop with more blur */}
      <div className={`fixed inset-0 ${isDarkTheme ? 'bg-black/70' : 'bg-black/40 dark:bg-black/60'} backdrop-blur-md`} aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel */}
        <Dialog.Panel className={panelClasses}>
          {/* Enhanced ambient glow effects for dark theme */}
          {isDarkTheme && (
            <>
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FF4F81]/15 blur-[60px] rounded-full pointer-events-none opacity-70"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8C30F5]/15 blur-[60px] rounded-full pointer-events-none opacity-70"></div>
            </>
          )}
          
          <div className="relative z-10">
            {/* Enhanced title with gradient text for dark theme */}
            <Dialog.Title className={`text-2xl sm:text-3xl font-bold text-center ${isDarkTheme 
              ? 'bg-gradient-to-r from-[#FF4F81] to-[#9747FF] bg-clip-text text-transparent' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-heartglow-pink to-heartglow-violet'} mb-4`}>
              {content.title}
            </Dialog.Title>
            
            <Dialog.Description className={`text-center ${isDarkTheme ? 'text-[#E2E2E2]/90' : 'text-gray-600 dark:text-gray-300'} mb-6 whitespace-pre-line text-sm`}>
              {content.description}
            </Dialog.Description>

            {/* Enhanced feature list with better spacing and hover effects */}
            <div className="space-y-4 mb-6">
              {content.features.map((feature) => (
                <div 
                  key={feature.name} 
                  className={`flex items-start p-2.5 rounded-xl ${isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'} transition-colors`}
                >
                  {/* Enhanced icon container with consistent styling */}
                  <div className={`flex-shrink-0 rounded-lg p-1.5 mr-3 mt-0.5 ${isDarkTheme ? 'text-white/90' : 'text-gray-900/90'}`}>
                    {feature.icon ? (
                      <feature.icon className={`h-5 w-5 ${isDarkTheme ? 'text-heartglow-pink' : 'text-green-500'}`} aria-hidden="true" />
                    ) : (
                      <CheckIcon className={`h-5 w-5 ${isDarkTheme ? 'text-heartglow-pink' : 'text-green-500'}`} aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <span className={isDarkTheme ? 'text-[#E2E2E2]/90' : 'text-gray-700 dark:text-gray-200'}>
                      {feature.name}
                    </span>
                    {feature.description && (
                      <span className={`block text-xs ${isDarkTheme ? 'text-[#E2E2E2]/70' : 'text-gray-500 dark:text-gray-400'} mt-0.5`}>
                        {feature.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {content.closingMessage && (
              <div className={`text-center ${isDarkTheme ? 'text-[#E2E2E2]/80 italic' : 'text-gray-600 dark:text-gray-300 italic'} mb-5 text-sm`}>
                "{content.closingMessage}"
              </div>
            )}
            
            {/* Enhanced privacy notice with better alignment */}
            <div className={`text-center text-xs ${isDarkTheme ? 'text-[#E2E2E2]/70' : 'text-gray-500 dark:text-gray-400'} mb-5 flex items-center justify-center`}>
               <LockClosedIcon className="h-3 w-3 mr-1.5" />
               Your messages are yours. Always encrypted. Never shared. Private by design.
            </div>

            {error && (
              <div className="my-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/50 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Enhanced CTA button with gradient effect matching the screenshot */}
            <button
              onClick={handleUpgradeClick}
              disabled={isLoading}
              className={`w-full px-6 py-3.5 ${isDarkTheme 
                ? "bg-gradient-to-r from-[#FF4F81] via-[#BD4FFF] to-[#8C30F5] hover:from-[#FF6B96] hover:via-[#CA5FFF] hover:to-[#9A45FF] shadow-[0_0_15px_rgba(255,79,129,0.3)] hover:shadow-[0_0_20px_rgba(255,79,129,0.5)]" 
                : "bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:opacity-90"} text-white font-bold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group`}
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
                  {isDarkTheme && <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>}
                </span>
              )}
            </button>
            
            {/* Enhanced footer text */}
            <p className={`text-center text-xs ${isDarkTheme ? 'text-[#E2E2E2]/70' : 'text-gray-500 dark:text-gray-400'} mt-3`}>
              {content.footerText}
            </p>

            {/* Enhanced dismiss button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className={`w-full mt-5 px-6 py-2 text-sm ${isDarkTheme 
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