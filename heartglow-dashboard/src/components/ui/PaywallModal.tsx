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
    
    // Log analytics event - fix analytics check
    if (analytics) {
      try {
        logEvent(analytics, 'begin_checkout', {
          items: [
            {
              item_name: 'Premium Subscription',
              item_category: 'Subscription',
            },
          ],
          source: source,
        });
      } catch (err) {
        console.error('Error logging analytics event:', err);
      }
    }
    
    try {
      // Navigate to pricing page
      router.push('/pricing');
      onClose();
    } catch (err) {
      console.error('Error initiating upgrade:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    // Log analytics event for dismissing paywall - fix analytics check
    if (analytics) {
      try {
        logEvent(analytics, 'paywall_dismissed', {
          source: source,
        });
      } catch (err) {
        console.error('Error logging analytics event:', err);
      }
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
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Modal positioning */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className={`mx-auto max-w-md rounded-xl ${theme === 'dark' ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-xl'} p-6 w-full transition-all`}>
          {/* Close button - only show if not present on all devices */}
          {!isPresentOnAllDevices && (
            <button
              onClick={handleDismiss}
              className={`absolute top-4 right-4 p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          )}
          
          {/* Title */}
          <Dialog.Title className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {displayContent.title}
          </Dialog.Title>
          
          {/* Description */}
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {displayContent.description}
          </p>
          
          {/* Features list */}
          <div className="space-y-4 mb-6">
            {displayContent.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <svg className={`h-5 w-5 mr-2 mt-0.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.name}</p>
                  {feature.description && (
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{feature.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 active:bg-indigo-800'}
              ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}
          >
            {isLoading ? 'Processing...' : displayContent.ctaText}
          </button>
          
          {/* Error message */}
          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}
          
          {/* Footer text */}
          {displayContent.footerText && (
            <p className={`mt-4 text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {displayContent.footerText}
            </p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PaywallModal; 