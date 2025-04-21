import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { currentUser, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle redirecting to Stripe Customer Portal
  const handleManageBilling = async () => {
    if (!currentUser) return; // Should be handled by AuthGuard, but good practice

    setIsLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch('/api/stripe/create-customer-portal-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to create billing session.');
      }

      // Redirect to Stripe
      window.location.href = data.url;

    } catch (err) {
      console.error('Manage Billing Error:', err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      setIsLoading(false); // Stop loading on error before redirect
    }
    // No finally block needed as successful redirect navigates away
  };

  return (
    <>
      <Head>
          <title>Your Profile | HeartGlow AI</title>
      </Head>
      <AuthGuard>
        <DashboardLayout>
          <div className="container mx-auto py-8 px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite mb-8">Your Profile</h1>
              
              <div className="bg-white dark:bg-heartglow-deepgray rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-800">
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-3 text-heartglow-charcoal dark:text-heartglow-offwhite">Account Information</h2>
                  <div className="space-y-2">
                    <p><strong className="text-gray-600 dark:text-gray-400">Email:</strong> {currentUser?.email || 'Not available'}</p>
                    {/* Placeholder for Display Name - Fetch from Firebase Auth User profile if available */}
                    <p><strong className="text-gray-600 dark:text-gray-400">Display Name:</strong> {currentUser?.displayName || 'Not set'}</p> 
                    {/* Placeholder for Profile Picture */}
                    {/* Add logic to display currentUser?.photoURL if available */}
                  </div>
                </div>
                
                {/* --- Billing Section --- */}
                {(userProfile?.isPremium || userProfile?.stripeCustomerId) && ( // Only show if premium or has Stripe ID
                  <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-3 text-heartglow-charcoal dark:text-heartglow-offwhite">Billing Settings</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Manage your subscription, update payment methods, and view invoice history.</p>
                    <button
                      onClick={handleManageBilling}
                      disabled={isLoading}
                      className="inline-flex justify-center items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-heartglow-pink hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:bg-heartglow-pink-dark dark:hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        'Manage Billing'
                      )}
                    </button>
                    {error && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400">Error: {error}</p>
                    )}
                  </div>
                )}
                {/* --- End Billing Section --- */}
                
                {/* Placeholder for Profile Editing Form */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-3 text-heartglow-charcoal dark:text-heartglow-offwhite">Edit Profile (Coming Soon)</h2>
                  <p className="text-gray-600 dark:text-gray-400">Functionality to update display name and profile picture will be added here.</p>
                  {/* Example Input (Disabled) */}
                  <div className="mt-4">
                    <label htmlFor="displayNameInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                    <input 
                      id="displayNameInput" 
                      type="text" 
                      placeholder={currentUser?.displayName || 'Enter display name'} 
                      disabled 
                      className="block w-full max-w-sm rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
} 