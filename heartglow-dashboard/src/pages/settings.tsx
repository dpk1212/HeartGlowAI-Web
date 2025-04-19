import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthGuard from '../components/layout/AuthGuard';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

// Placeholder component for a toggle switch (replace with actual implementation later)
const ToggleSwitchPlaceholder = ({ label }: { label: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-700 dark:text-gray-300">{label}</span>
    <div className="w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full p-1 flex items-center cursor-not-allowed">
      <div className="w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ease-in-out"></div>
    </div>
  </div>
);

export default function SettingsPage() {
  const { currentUser } = useAuth(); // Needed for AuthGuard

  return (
    <>
      <Head>
          <title>Settings | HeartGlow AI</title>
      </Head>
      <AuthGuard>
        <DashboardLayout>
          <div className="container mx-auto py-8 px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite mb-8">Settings</h1>
              
              <div className="bg-white dark:bg-heartglow-deepgray rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-800">
                
                {/* Appearance Settings */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite">Appearance</h2>
                  <div className="space-y-4">
                    <ToggleSwitchPlaceholder label="Dark Mode (Coming Soon)" />
                    {/* Add Theme selection later */}
                  </div>
                </div>
                
                {/* Notification Settings */}
                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite">Notifications (Coming Soon)</h2>
                  <div className="space-y-4">
                    <ToggleSwitchPlaceholder label="Email Notifications" />
                    <ToggleSwitchPlaceholder label="In-App Notifications" />
                  </div>
                </div>

                {/* Account Settings */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite">Account</h2>
                  
                  {currentUser?.isAnonymous && (
                    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-700 dark:text-yellow-200 flex items-start space-x-3">
                       <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                       <div>
                         <p className="font-medium">Save Your Progress!</p>
                         <p className="mt-1">
                           You're currently using a temporary session. Create a permanent account to save your connections, messages, and progress across devices.
                         </p>
                         <Link href="/account/link" passHref className="mt-3 inline-block">
                           <button 
                             className="px-3 py-1.5 border border-yellow-300 dark:border-yellow-600 rounded-md text-sm font-medium text-yellow-800 dark:text-yellow-100 bg-yellow-100 dark:bg-yellow-800/60 hover:bg-yellow-200 dark:hover:bg-yellow-700/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                           >
                             Create Permanent Account
                           </button>
                         </Link>
                       </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {!currentUser?.isAnonymous ? (
                      <>
                        {/* Show these options only for permanent accounts */}
                        <button disabled className="text-sm text-blue-600 hover:underline cursor-not-allowed">Change Password (Coming Soon)</button>
                        <button disabled className="text-sm text-red-600 hover:underline cursor-not-allowed">Delete Account (Coming Soon)</button>
                      </>
                    ) : (
                       <p className="text-sm text-gray-500 dark:text-gray-400">Account options will be available after creating a permanent account.</p>
                    )}
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