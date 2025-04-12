import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { currentUser } = useAuth();

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