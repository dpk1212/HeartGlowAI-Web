import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';
import { useAuth } from '../../context/AuthContext';
import { addConnection } from '../../firebase/db';
import { getRouteWithBasePath } from '../../lib/utils';

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

// Define options for interactive inputs
const YEARS_KNOWN_OPTIONS = [
  { value: undefined, label: 'Select range (Optional)' },
  { value: 0, label: 'Less than a year' },
  { value: 1, label: '1-3 years' },
  { value: 3, label: '3-5 years' },
  { value: 5, label: '5-10 years' },
  { value: 10, label: '10+ years' },
];

const COMMUNICATION_STYLE_TAGS = [
  'Prefers Texts', 'Likes Emojis', 'Quick Replies', 'Thoughtful Messages', 'Formal Tone', 'Casual Tone', 'Humorous', 'Direct', 'Avoids Calls'
];

const RELATIONSHIP_GOAL_TAGS = [
  'Strengthen Bond', 'Offer Support', 'Stay Updated', 'Collaborate', 'Mentor/Guide', 'Learn From'
];

const AddConnectionPage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  // State for progressive disclosure
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIP_OPTIONS[0]);
  const [otherRelationship, setOtherRelationship] = useState('');
  const [specificRelationship, setSpecificRelationship] = useState('');
  // Update yearsKnown to match new options
  const [yearsKnown, setYearsKnown] = useState<number | undefined>(undefined);
  // Communication style can now hold multiple tags + custom text
  const [communicationStyleTags, setCommunicationStyleTags] = useState<string[]>([]);
  const [customCommunicationStyle, setCustomCommunicationStyle] = useState('');
  // Relationship goal can hold multiple tags + custom text
  const [relationshipGoalTags, setRelationshipGoalTags] = useState<string[]>([]);
  const [customRelationshipGoal, setCustomRelationshipGoal] = useState('');
  const [notes, setNotes] = useState('');

  // Helper to toggle tags
  const toggleTag = (tag: string, currentTags: string[], setTags: React.Dispatch<React.SetStateAction<string[]>>) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Combine tags and custom text for saving
  const getCombinedFieldValue = (tags: string[], customText: string): string => {
    return [...tags, customText.trim()].filter(Boolean).join(', ');
  };

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
      if (relationship === 'Other' && !otherRelationship.trim()) {
        setError('Please specify the relationship type');
        return;
      }
      
      // Combine interactive fields for storage
      const finalCommunicationStyle = getCombinedFieldValue(communicationStyleTags, customCommunicationStyle);
      const finalRelationshipGoal = getCombinedFieldValue(relationshipGoalTags, customRelationshipGoal);
      
      // Create connection object
      const newConnection = {
        name: name.trim(),
        relationship,
        ...(relationship === 'Other' && { otherRelationship: otherRelationship.trim() }),
        ...(specificRelationship && { specificRelationship: specificRelationship.trim() }),
        ...(yearsKnown !== undefined && { yearsKnown }),
        ...(finalCommunicationStyle && { communicationStyle: finalCommunicationStyle }),
        ...(finalRelationshipGoal && { relationshipGoal: finalRelationshipGoal }),
        ...(notes && { notes: notes.trim() }),
      };
      
      // Save to Firestore
      await addConnection(currentUser, newConnection);
      
      // Show success message
      setSuccess(true);
      
      // Reset form (including new state)
      setName('');
      setRelationship(RELATIONSHIP_OPTIONS[0]);
      setOtherRelationship('');
      setSpecificRelationship('');
      setYearsKnown(undefined);
      setCommunicationStyleTags([]);
      setCustomCommunicationStyle('');
      setRelationshipGoalTags([]);
      setCustomRelationshipGoal('');
      setNotes('');
      setShowMoreDetails(false); // Collapse details on success
      
      // Redirect after short delay
      setTimeout(() => {
        router.push(getRouteWithBasePath('/connections')); // Redirect to connections list
      }, 1500);
      
    } catch (err: any) {
      console.error('Error adding connection:', err);
      setError(err.message || 'Failed to add connection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for inline info tooltips
  const InfoIcon = ({ tooltip }: { tooltip: string }) => (
    <span className="ml-1.5 group relative inline-block cursor-help">
      <Info size={14} className="text-gray-400 dark:text-gray-500"/>
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-700 dark:bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
        {tooltip}
      </span>
    </span>
  );

  // Helper for tag buttons
  const TagButton = ({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors duration-150 ${
        isSelected
          ? 'bg-heartglow-pink/10 dark:bg-heartglow-pink/20 border-heartglow-pink/50 dark:border-heartglow-pink/70 text-heartglow-pink dark:text-heartglow-pink-light'
          : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <Head>
        <title>Add Connection | HeartGlow AI</title>
        <meta name="description" content="Add a new connection to HeartGlow AI" />
      </Head>

      <AuthGuard>
        <DashboardLayout>
          <div className="max-w-2xl mx-auto"> {/* Slightly narrower for better form readability */}
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
              className="bg-white dark:bg-gray-800/30 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-6 sm:p-8"
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
                    Redirecting you back to connections...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6"> {/* Add space-y for vertical spacing */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {/* --- Always Visible Fields --- */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4"> {/* Grid for Name/Relationship row */}
                    {/* Name */}
                    <div className="sm:col-span-2"> {/* Name takes full width on small screens */}
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent shadow-sm"
                        placeholder="Enter their name"
                        required
                      />
                    </div>

                    {/* Relationship Dropdown */}
                    <div>
                      <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="relationship"
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent shadow-sm appearance-none pr-10 bg-no-repeat bg-right-[0.75rem] bg-center bg-[url('data:image/svg+xml,%3csvg xmlns=&apos;http://www.w3.org/2000/svg&apos; fill=&apos;none&apos; viewBox=&apos;0 0 24 24&apos; stroke-width=&apos;1.5&apos; stroke=&apos;%236b7280&apos;%3e%3cpath stroke-linecap=&apos;round&apos; stroke-linejoin=&apos;round&apos; d=&apos;M19.5 8.25l-7.5 7.5-7.5-7.5&apos; /%3e%3c/svg%3e')] dark:bg-[url('data:image/svg+xml,%3csvg xmlns=&apos;http://www.w3.org/2000/svg&apos; fill=&apos;none&apos; viewBox=&apos;0 0 24 24&apos; stroke-width=&apos;1.5&apos; stroke=&apos;%239ca3af&apos;%3e%3cpath stroke-linecap=&apos;round&apos; stroke-linejoin=&apos;round&apos; d=&apos;M19.5 8.25l-7.5 7.5-7.5-7.5&apos; /%3e%3c/svg%3e')]"
                        required
                      >
                        {RELATIONSHIP_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Specific Relationship Text Input (Appears next to Relationship) */}
                    <div>
                      <label htmlFor="specificRelationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Specific Relationship (Optional)
                        <InfoIcon tooltip="E.g., Brother, Boss, Best friend since college. Helps AI understand the nuance." />
                      </label>
                      <input
                        type="text"
                        id="specificRelationship"
                        value={specificRelationship}
                        onChange={(e) => setSpecificRelationship(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent shadow-sm"
                        placeholder="e.g., Brother, Boss, Best friend"
                      />
                    </div>
                  </div>

                  {/* --- Optional Fields Trigger --- */}
                  <div className="pt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setShowMoreDetails(!showMoreDetails)}
                      className="inline-flex items-center text-sm font-medium text-heartglow-indigo dark:text-heartglow-pink hover:underline"
                    >
                      {showMoreDetails ? 'Hide Optional Details' : 'Add More Details'}
                      {showMoreDetails ? <ChevronUp size={16} className="ml-1"/> : <ChevronDown size={16} className="ml-1"/>}
                    </button>
                  </div>

                  {/* --- Collapsible Optional Fields --- */}
                  <AnimatePresence>
                    {showMoreDetails && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="space-y-6 overflow-hidden pt-4 border-t border-gray-200 dark:border-gray-700/50 mt-4" // Add padding/border/margin top
                      >
                        {/* Communication Style - Interactive Tags */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Communication Style (Optional)
                            <InfoIcon tooltip="How do they prefer to communicate? Helps AI choose the right tone and format." />
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                             {COMMUNICATION_STYLE_TAGS.map(tag => (
                               <TagButton
                                 key={tag}
                                 label={tag}
                                 isSelected={communicationStyleTags.includes(tag)}
                                 onClick={() => toggleTag(tag, communicationStyleTags, setCommunicationStyleTags)}
                               />
                             ))}
                          </div>
                          <input
                            type="text"
                            value={customCommunicationStyle}
                            onChange={(e) => setCustomCommunicationStyle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent shadow-sm text-sm"
                            placeholder="Add other style notes..."
                          />
                        </div>

                        {/* Relationship Goal - Interactive Tags */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Relationship Goal (Optional)
                            <InfoIcon tooltip="What do you hope to achieve or maintain in this relationship?" />
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                             {RELATIONSHIP_GOAL_TAGS.map(tag => (
                               <TagButton
                                 key={tag}
                                 label={tag}
                                 isSelected={relationshipGoalTags.includes(tag)}
                                 onClick={() => toggleTag(tag, relationshipGoalTags, setRelationshipGoalTags)}
                               />
                             ))}
                          </div>
                          <input
                            type="text"
                            value={customRelationshipGoal}
                            onChange={(e) => setCustomRelationshipGoal(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent shadow-sm text-sm"
                            placeholder="Describe your specific goal..."
                          />
                        </div>

                         {/* Years Known - Select Dropdown */}
                        <div>
                          <label htmlFor="yearsKnown" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Years Known (Optional)
                          </label>
                          <select
                            id="yearsKnown"
                            value={yearsKnown === undefined ? '' : String(yearsKnown)}
                            onChange={(e) => setYearsKnown(e.target.value === '' ? undefined : Number(e.target.value))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent shadow-sm appearance-none pr-10 bg-no-repeat bg-right-[0.75rem] bg-center bg-[url('data:image/svg+xml,%3csvg xmlns=&apos;http://www.w3.org/2000/svg&apos; fill=&apos;none&apos; viewBox=&apos;0 0 24 24&apos; stroke-width=&apos;1.5&apos; stroke=&apos;%236b7280&apos;%3e%3cpath stroke-linecap=&apos;round&apos; stroke-linejoin=&apos;round&apos; d=&apos;M19.5 8.25l-7.5 7.5-7.5-7.5&apos; /%3e%3c/svg%3e')] dark:bg-[url('data:image/svg+xml,%3csvg xmlns=&apos;http://www.w3.org/2000/svg&apos; fill=&apos;none&apos; viewBox=&apos;0 0 24 24&apos; stroke-width=&apos;1.5&apos; stroke=&apos;%239ca3af&apos;%3e%3cpath stroke-linecap=&apos;round&apos; stroke-linejoin=&apos;round&apos; d=&apos;M19.5 8.25l-7.5 7.5-7.5-7.5&apos; /%3e%3c/svg%3e')]"
                          >
                            {YEARS_KNOWN_OPTIONS.map((option) => (
                              <option key={option.label} value={option.value === undefined ? '' : option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Notes */}
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes (Optional)
                            <InfoIcon tooltip="Any other details to remember: birthdays, preferences, past conversations..." />
                          </label>
                          <textarea
                            id="notes"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-heartglow-pink focus:border-transparent shadow-sm resize-y"
                            placeholder="Any other details about this person you'd like to remember"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200 dark:border-gray-700/50">
                     <button
                       type="button"
                       onClick={() => router.back()} // Use router.back() for cancel
                       className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
                       disabled={isSubmitting}
                     >
                       Cancel
                     </button>
                     <button
                       type="submit"
                       className={`inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-900 ${ // Use consistent button style
                         isSubmitting
                           ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                           : 'bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-pink/90 hover:to-heartglow-violet/90' // Gradient button
                       }`}
                       disabled={isSubmitting}
                     >
                       {isSubmitting ? 'Saving...' : 'Save Connection'}
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