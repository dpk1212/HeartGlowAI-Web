import React, { useState } from 'react';
// import { loadStripe, Stripe } from '@stripe/stripe-js'; // Removed Stripe import
import { Dialog } from '@headlessui/react'; // Using Headless UI for modal accessibility
import { CheckIcon, LockClosedIcon, SparklesIcon, UsersIcon, BookmarkIcon, ChatBubbleLeftRightIcon, PencilIcon, LightBulbIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Replaced BrainIcon with LightBulbIcon
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { cn } from '../../lib/utils';
import { Button } from '@/components/ui/button';

// Import Firebase Analytics
import { logEvent } from 'firebase/analytics';
import { analytics } from '../../lib/firebase'; // Import the analytics instance

// Define feature interface
export interface Feature {
  name: string;
  description?: string;
}

// Define custom content interface
export interface PaywallContent {
  title: string;
  description: string;
  features: Feature[];
  ctaText: string;
  footerText?: string;
}

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  isPresentOnAllDevices?: boolean;
  content?: PaywallContent;
}

// Import default content if needed
import { onboardingPaywallContent } from './OnboardingPaywallContent';

const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  source = 'default',
  isPresentOnAllDevices = false,
  content,
}) => {
  const { currentUser } = useAuth(); // Get current user from AuthContext
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { theme } = useTheme();

  // Use provided content or default to onboarding content
  const displayContent = content || onboardingPaywallContent;

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    
    // Log analytics event
    try {
      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, 'begin_checkout', {
          items: [
            {
              item_name: 'Premium Subscription',
              item_category: 'Subscription',
            },
          ],
          source: source,
        });
      }
    } catch (err) {
      console.error('Error logging analytics event:', err);
    }
    
    // --- START: Updated Upgrade Logic ---
    try {
      if (currentUser?.uid) {
        const paymentLink = "https://buy.stripe.com/4gw03z8Tf1cW2sw8ww"; // Use the same link as settings
        const urlWithRef = `${paymentLink}?client_reference_id=${currentUser.uid}`;
        console.log('[PaywallModal] Redirecting to Stripe:', urlWithRef);
        window.location.href = urlWithRef;
        // Keep onClose() in case the redirect fails or for cleanup, 
        // but primary action is now the redirect.
        onClose(); 
      } else {
        console.error('[PaywallModal] User not logged in, cannot upgrade.');
        setError('You must be logged in to upgrade.'); 
        setIsLoading(false); // Stop loading if user isn't logged in
        return; // Prevent further execution
      }
    } catch (err) {
      console.error('[PaywallModal] Error initiating upgrade redirect:', err);
      setError('Something went wrong redirecting to payment. Please try again.');
      setIsLoading(false); // Stop loading on error
    }
    // --- END: Updated Upgrade Logic ---
    // No longer need setIsLoading(false) here if redirect is successful
  };

  const handleDismiss = async () => { // Make function async
    // Log analytics event for dismissing paywall - fix analytics check
    try {
      const analyticsInstance = await analytics; // Await the promise
      if (analyticsInstance) { // Check if instance exists
        logEvent(analyticsInstance, 'paywall_dismissed', { // Use the resolved instance
          source: source,
        });
      } 
    } catch (err) {
      console.error('Error logging analytics event:', err);
    }
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={isPresentOnAllDevices ? () => {} : onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Modal positioning */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Apply dark theme styles: bg-gray-900, border-gray-700 */}
        <Dialog.Panel className={`mx-auto max-w-lg rounded-xl bg-gray-900 border border-gray-700 p-7 sm:p-8 w-full transition-all transform-gpu scale-100 opacity-100 animate-in fade-in zoom-in-95 duration-300`}>
          {/* Close button - update dark theme hover */}
          {!isPresentOnAllDevices && (
            <button
              onClick={handleDismiss}
              className={`absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors`} 
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
          
          {/* Title - update dark theme text color */}
          <Dialog.Title className={`text-2xl sm:text-3xl font-bold mb-3 text-center text-white`}>
            {displayContent.title}
          </Dialog.Title>
          
          {/* Description - update dark theme text color */}
          <p className={`mb-7 text-base text-center max-w-md mx-auto text-gray-300`}>
            {displayContent.description}
          </p>
          
          {/* Features list - update dark theme colors */}
          <div className="space-y-5 mb-8">
            {displayContent.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                {/* Use a consistent check icon - update dark theme color */}
                <CheckIcon className={`h-6 w-6 mr-3 mt-0.5 flex-shrink-0 text-indigo-400`} />
                <div>
                  {/* Slightly bolder feature name */}
                  <p className={`font-semibold text-base text-white`}>{feature.name}</p>
                  {feature.description && (
                    <p className={`text-sm mt-0.5 text-gray-400`}>{feature.description}</p> // Adjusted margin
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Button - Apply gradient style */}
          <div className="w-full pt-2"> {/* Wrapper for button and footer text */} 
            <Button // Using shadcn Button component for consistency if desired, ensure import
              // onClick={handleUpgrade} - Assuming Button handles click or we wrap it
              disabled={isLoading}
              className={cn( // Apply cn helper for conditional classes
                "w-full h-12 rounded-full text-white/95 text-[17px] font-medium group transition-all", 
                "bg-gradient-to-r from-[#FF4F81] via-[#BD4FFF] to-[#8C30F5]",
                "hover:from-[#FF6B96] hover:via-[#CA5FFF] hover:to-[#9A45FF]",
                "shadow-[0_0_15px_rgba(255,79,129,0.3)] hover:shadow-[0_0_20px_rgba(255,79,129,0.5)]",
                "border border-white/10 backdrop-blur-md",
                isLoading ? 'opacity-70 cursor-not-allowed' : '' // Handle loading state
              )}
              onClick={handleUpgrade} // Apply onClick handler here
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                 <span className="flex items-center justify-center">
                   {displayContent.ctaText} 
                   <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1 text-xl">→</span>
                 </span>
              )}
            </Button>
            
            {/* Footer text - Positioned directly below CTA */}
            {displayContent.footerText && (
              <p className={`mt-3 text-xs text-center text-gray-500`}> {/* Reduced size, adjusted margin */}
                {displayContent.footerText}
              </p>
            )}
          </div>
          
          {/* Error message - Keep below footer/CTA group */}
          {error && (
            <p className={`mt-3 text-sm text-center text-red-400`}>
              {error}
            </p>
          )}
          
          {/* Dismiss Text/Button - Optional: Style as a less prominent link/button if needed */}
          {/* Consider adding the dismissText as a subtle link below everything if required by design */} 
          {/* Example: 
           {displayContent.dismissText && (
              <button onClick={handleDismiss} className="mt-4 text-xs text-center text-gray-500 hover:text-gray-300 w-full">
                {displayContent.dismissText}
              </button>
           )}
          */}

        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaywallModal; 