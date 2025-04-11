import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';
import { useAuth } from '../../context/AuthContext';
import { addConnection } from '../../firebase/db';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

// Relationship options
const RELATIONSHIP_OPTIONS = [
  'Family',
  'Friend',
  'Partner',
  'Colleague',
  'Client',
  'Mentor',
  'Mentee',
  'Neighbor',
  'Other'
];

const AddConnectionPage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIP_OPTIONS[0]);
  const [otherRelationship, setOtherRelationship] = useState('');
  const [specificRelationship, setSpecificRelationship] = useState('');
  const [yearsKnown, setYearsKnown] = useState<number | undefined>();
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [relationshipGoal, setRelationshipGoal] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate form
      if (!name.trim()) {
        setError('Please enter a name');
        return;
      }
      
      // Create connection object
      const newConnection = {
        name: name.trim(),
        relationship,
        ...(relationship === 'Other' && { otherRelationship: otherRelationship.trim() }),
        ...(specificRelationship && { specificRelationship: specificRelationship.trim() }),
        ...(yearsKnown !== undefined && { yearsKnown }),
        ...(communicationStyle && { communicationStyle: communicationStyle.trim() }),
        ...(relationshipGoal && { relationshipGoal: relationshipGoal.trim() }),
        ...(notes && { notes: notes.trim() }),
      };
      
      // Save to Firestore
      await addConnection(currentUser, newConnection);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setName('');
      setRelationship(RELATIONSHIP_OPTIONS[0]);
      setOtherRelationship('');
      setSpecificRelationship('');
      setYearsKnown(undefined);
      setCommunicationStyle('');
      setRelationshipGoal('');
      setNotes('');
      
      // Redirect after short delay
      setTimeout(() => {
        router.push(getRouteWithBasePath('/dashboard'));
      }, 1500);
      
    } catch (err: any) {
      console.error('Error adding connection:', err);
      setError(err.message || 'Failed to add connection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Connection | HeartGlow AI</title>
        <meta name="description" content="Add a new connection to HeartGlow AI" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <Link
                  href={getRouteWithBasePath('/connections')}
                  className="text-heartglow-indigo dark:text-heartglow-pink hover:underline flex items-center mr-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Link>
                <h1 className="text-3xl font-bold text-heartglow-charcoal dark:text-white">
                  Add New Connection
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Add someone special to your connections to easily create personalized messages for them.
              </p>
            </div>

            {/* Form */}
            <motion.div
              className="bg-white dark:bg-heartglow-deepgray rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-heartglow-charcoal dark:text-heartglow-offwhite mb-2">
                    Connection Added Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Redirecting you back to dashboard...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                        placeholder="Enter their name"
                        required
                      />
                    </div>

                    {/* Relationship */}
                    <div>
                      <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="relationship"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                        required
                      >
                        {RELATIONSHIP_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Other Relationship (if "Other" is selected) */}
                    {relationship === 'Other' && (
                      <div>
                        <label htmlFor="otherRelationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Specify Relationship <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="otherRelationship"
                          value={otherRelationship}
                          onChange={(e) => setOtherRelationship(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                          placeholder="Specify their relationship to you"
                          required={relationship === 'Other'}
                        />
                      </div>
                    )}

                    {/* Specific Relationship */}
                    <div className={relationship === 'Other' ? 'col-span-2' : 'col-span-1'}>
                      <label htmlFor="specificRelationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Specific Relationship (Optional)
                      </label>
                      <input
                        type="text"
                        id="specificRelationship"
                        value={specificRelationship}
                        onChange={(e) => setSpecificRelationship(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                        placeholder="E.g. Brother, Boss, Best friend"
                      />
                    </div>

                    {/* Years Known */}
                    <div>
                      <label htmlFor="yearsKnown" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Years Known (Optional)
                      </label>
                      <input
                        type="number"
                        id="yearsKnown"
                        value={yearsKnown || ''}
                        onChange={(e) => setYearsKnown(e.target.value ? parseInt(e.target.value) : undefined)}
                        min="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                        placeholder="How many years have you known them?"
                      />
                    </div>

                    {/* Communication Style */}
                    <div className="col-span-2">
                      <label htmlFor="communicationStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Communication Style (Optional)
                      </label>
                      <input
                        type="text"
                        id="communicationStyle"
                        value={communicationStyle}
                        onChange={(e) => setCommunicationStyle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                        placeholder="How do they prefer to communicate?"
                      />
                    </div>

                    {/* Relationship Goal */}
                    <div className="col-span-2">
                      <label htmlFor="relationshipGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Relationship Goal (Optional)
                      </label>
                      <input
                        type="text"
                        id="relationshipGoal"
                        value={relationshipGoal}
                        onChange={(e) => setRelationshipGoal(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                        placeholder="What do you hope to achieve in this relationship?"
                      />
                    </div>

                    {/* Notes */}
                    <div className="col-span-2">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent"
                        placeholder="Any other details about this person you'd like to remember"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <Link
                      href={getRouteWithBasePath('/dashboard')}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-2 bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Connection'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default AddConnectionPage; 