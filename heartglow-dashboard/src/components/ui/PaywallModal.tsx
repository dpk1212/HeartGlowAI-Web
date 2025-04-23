import React, { useState } from 'react';
// import { loadStripe, Stripe } from '@stripe/stripe-js'; // Removed Stripe import
import { Dialog } from '@headlessui/react'; // Using Headless UI for modal accessibility
import { CheckIcon, LockClosedIcon, SparklesIcon, UsersIcon, BookmarkIcon, ChatBubbleLeftRightIcon, PencilIcon, LightBulbIcon, XMarkIcon } from '@heroicons/react/24/outline'; // Replaced BrainIcon with LightBulbIcon
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';

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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" /> {/* Slightly darker backdrop */}
      
      {/* Modal positioning */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Apply dark theme styles more directly, increase padding, adjust max-width */}
        <Dialog.Panel className={`mx-auto max-w-lg rounded-xl ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg'} p-7 sm:p-8 w-full transition-all transform-gpu scale-100 opacity-100 animate-in fade-in zoom-in-95 duration-300`}>
          {/* Close button - only show if not present on all devices */}
          {!isPresentOnAllDevices && (
            <button
              onClick={handleDismiss}
              className={`absolute top-3 right-3 p-1.5 rounded-full ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'} transition-colors`}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
          
          {/* Title - Increase size, add spacing */}
          <Dialog.Title className={`text-2xl sm:text-3xl font-bold mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {displayContent.title}
          </Dialog.Title>
          
          {/* Description - Increase size, center, add spacing */}
          <p className={`mb-7 text-base text-center max-w-md mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {displayContent.description}
          </p>
          
          {/* Features list - Improve layout and icon display */}
          <div className="space-y-5 mb-8">
            {displayContent.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                {/* Use a consistent check icon */}
                <CheckIcon className={`h-6 w-6 mr-3 mt-0.5 flex-shrink-0 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <div>
                  <p className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.name}</p>
                  {feature.description && (
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{feature.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Button - Increase size and prominence */}
          <button
            onClick={handleUpgrade} // Functionality will be updated next
            disabled={isLoading}
            className={`w-full py-3.5 px-5 rounded-lg text-lg font-semibold transition duration-150 ease-in-out flex items-center justify-center
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 active:bg-indigo-800 transform hover:scale-[1.02]'}
              ${theme === 'dark' ? 'bg-indigo-600 text-white shadow-md hover:shadow-lg' : 'bg-indigo-600 text-white shadow-md hover:shadow-lg'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : displayContent.ctaText}
          </button>
          
          {/* Error message - Standard styling */}
          {error && (
            <p className="mt-3 text-sm text-center text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          
          {/* Footer text - Adjust spacing and size */}
          {displayContent.footerText && (
            <p className={`mt-5 text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {displayContent.footerText.replace('\n', ' ')} {/* Replace newline with space for single line display */}
            </p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaywallModal; 