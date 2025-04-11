import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';
import { useAuth } from '../../context/AuthContext';
import { 
  doc, 
  getDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, Connection, updateConnection, deleteConnection, formatRelativeTime } from '../../firebase/db';

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

const ConnectionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth();
  
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  // Load connection data
  useEffect(() => {
    const fetchConnection = async () => {
      if (!currentUser || !id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const connectionRef = doc(db, `users/${currentUser.uid}/connections/${id}`);
        const connectionSnap = await getDoc(connectionRef);
        
        if (connectionSnap.exists()) {
          const connectionData = {
            id: connectionSnap.id,
            ...connectionSnap.data()
          } as Connection;
          
          setConnection(connectionData);
          
          // Set form state
          setName(connectionData.name || '');
          setRelationship(connectionData.relationship || RELATIONSHIP_OPTIONS[0]);
          setOtherRelationship(connectionData.otherRelationship || '');
          setSpecificRelationship(connectionData.specificRelationship || '');
          setYearsKnown(connectionData.yearsKnown);
          setCommunicationStyle(connectionData.communicationStyle || '');
          setRelationshipGoal(connectionData.relationshipGoal || '');
          setNotes(connectionData.notes || '');
        } else {
          setError('Connection not found');
        }
      } catch (err: any) {
        console.error('Error fetching connection:', err);
        setError(err.message || 'Failed to load connection');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnection();
  }, [currentUser, id]);
  
  // Handle update form submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !connection) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate form
      if (!name.trim()) {
        setError('Please enter a name');
        return;
      }
      
      // Create updated connection object
      const updatedConnection = {
        id: connection.id,
        name: name.trim(),
        relationship,
        ...(relationship === 'Other' && { otherRelationship: otherRelationship.trim() }),
        ...(specificRelationship && { specificRelationship: specificRelationship.trim() }),
        ...(yearsKnown !== undefined && { yearsKnown }),
        ...(communicationStyle && { communicationStyle: communicationStyle.trim() }),
        ...(relationshipGoal && { relationshipGoal: relationshipGoal.trim() }),
        ...(notes && { notes: notes.trim() }),
      };
      
      // Update in Firestore
      await updateConnection(currentUser, updatedConnection);
      
      // Update local state
      setConnection({
        ...connection,
        ...updatedConnection
      });
      
      // Exit edit mode
      setIsEditing(false);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err: any) {
      console.error('Error updating connection:', err);
      setError(err.message || 'Failed to update connection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!currentUser || !connection) return;
    
    // Check confirmation
    if (deleteConfirmation !== connection.name) {
      setError('Please type the connection name to confirm deletion');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Delete from Firestore
      await deleteConnection(currentUser, connection.id);
      
      // Redirect to dashboard
      router.push(getRouteWithBasePath('/dashboard'));
      
    } catch (err: any) {
      console.error('Error deleting connection:', err);
      setError(err.message || 'Failed to delete connection. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }
  
  if (error && !connection) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
              {error}
            </h3>
            <div className="mt-6">
              <Link
                href={getRouteWithBasePath('/dashboard')}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }
  
  return (
    <>
      <Head>
        <title>{connection?.name || 'Connection'} | HeartGlow AI</title>
        <meta name="description" content="View connection details in HeartGlow AI" />
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
                {isEditing ? (
                  <h1 className="text-3xl font-bold text-heartglow-charcoal dark:text-white">
                    Edit Connection
                  </h1>
                ) : (
                  <h1 className="text-3xl font-bold text-heartglow-charcoal dark:text-white">
                    Connection Details
                  </h1>
                )}
              </div>
              {!isEditing && (
                <p className="text-gray-600 dark:text-gray-300">
                  View and manage your connection with {connection?.name}
                </p>
              )}
            </div>

            {/* Content */}
            <motion.div
              className="bg-white dark:bg-heartglow-deepgray rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
                  Connection updated successfully!
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
              
              {isEditing ? (
                <form onSubmit={handleUpdate}>
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
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
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
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              ) : isDeleting ? (
                <div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 mb-6">
                    <p className="font-medium">Are you sure you want to delete this connection?</p>
                    <p className="mt-2">This action cannot be undone. All message history with this connection will remain, but they will no longer appear in your connections list.</p>
                  </div>
                  
                  <div className="mt-4 mb-6">
                    <label htmlFor="deleteConfirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type <span className="font-medium">{connection?.name}</span> to confirm
                    </label>
                    <input
                      type="text"
                      id="deleteConfirmation"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={`Type ${connection?.name} to confirm`}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsDeleting(false)}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isSubmitting || deleteConfirmation !== connection?.name}
                      className={`px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 flex items-center ${isSubmitting || deleteConfirmation !== connection?.name ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        'Delete Connection'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Connection profile */}
                  <div className="flex items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-heartglow-pink to-heartglow-violet flex items-center justify-center text-white text-4xl font-semibold shadow-md mr-6">
                      {connection?.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-heartglow-charcoal dark:text-white">
                        {connection?.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {connection?.relationship === 'Other' 
                          ? connection?.otherRelationship 
                          : connection?.relationship}
                        {connection?.specificRelationship && ` (${connection.specificRelationship})`}
                      </p>
                      
                      {connection?.lastMessageDate && (
                        <p className="text-sm text-heartglow-pink mt-1">
                          Last message: {formatRelativeTime(connection.lastMessageDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Connection details */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 pb-2">
                    <h3 className="text-lg font-semibold text-heartglow-charcoal dark:text-white mb-4">
                      Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connection?.yearsKnown !== undefined && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Years Known</h4>
                          <p className="text-heartglow-charcoal dark:text-white">
                            {connection.yearsKnown} {connection.yearsKnown === 1 ? 'year' : 'years'}
                          </p>
                        </div>
                      )}
                      
                      {connection?.messageCount !== undefined && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages Sent</h4>
                          <p className="text-heartglow-charcoal dark:text-white">
                            {connection.messageCount} {connection.messageCount === 1 ? 'message' : 'messages'}
                          </p>
                        </div>
                      )}
                      
                      {connection?.communicationStyle && (
                        <div className="col-span-2">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Communication Style</h4>
                          <p className="text-heartglow-charcoal dark:text-white">{connection.communicationStyle}</p>
                        </div>
                      )}
                      
                      {connection?.relationshipGoal && (
                        <div className="col-span-2">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Relationship Goal</h4>
                          <p className="text-heartglow-charcoal dark:text-white">{connection.relationshipGoal}</p>
                        </div>
                      )}
                      
                      {connection?.notes && (
                        <div className="col-span-2 mt-2">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h4>
                          <p className="text-heartglow-charcoal dark:text-white whitespace-pre-wrap">{connection.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between mt-8">
                    <Link
                      href={getRouteWithBasePath(`/create?recipient=${connection?.id}`)}
                      className="px-6 py-2 bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Create Message
                    </Link>
                    
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsDeleting(true)}
                        className="px-6 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors duration-200"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
};

export default ConnectionDetailPage; 