import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth, getRouteWithBasePath } from '../_app';
import AuthGuard from '../../components/AuthGuard';
import Layout from '../../components/Layout';
import { fadeIn } from '../../lib/animations';

export default function NewConnection() {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [yearsKnown, setYearsKnown] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Form validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!relationship.trim()) {
      setError('Relationship is required');
      return;
    }
    
    if (yearsKnown === '') {
      setError('Years known is required');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Add the connection to Firestore
      const connectionRef = collection(db, `users/${user.uid}/connections`);
      const docRef = await addDoc(connectionRef, {
        name: name.trim(),
        relationship: relationship.trim(),
        yearsKnown: Number(yearsKnown),
        notes: notes.trim() || null,
        createdAt: new Date(),
      });
      
      // Navigate to the connections list
      router.push(getRouteWithBasePath('/connections'));
      
    } catch (err) {
      console.error('Error adding connection:', err);
      setError('Failed to add connection. Please try again.');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(getRouteWithBasePath('/connections'));
  };

  return (
    <AuthGuard>
      <Layout title="Add New Connection | HeartGlow AI">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="mb-6">
            <button 
              onClick={handleCancel}
              className="text-heartglow-purple hover:text-heartglow-deeppurple flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Connections
            </button>
          </div>

          <div className="card p-6">
            <h1 className="text-2xl font-medium mb-6">Add New Connection</h1>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-heartglow-purple focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="relationship" className="block mb-2 font-medium">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="relationship"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-heartglow-purple focus:border-transparent"
                  placeholder="e.g. Friend, Family, Colleague"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="yearsKnown" className="block mb-2 font-medium">
                  Years Known <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="yearsKnown"
                  value={yearsKnown}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || parseInt(value) >= 0) {
                      setYearsKnown(value === '' ? '' : parseInt(value));
                    }
                  }}
                  min="0"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-heartglow-purple focus:border-transparent"
                  placeholder="Number of years"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="notes" className="block mb-2 font-medium">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-heartglow-purple focus:border-transparent resize-none"
                  placeholder="Add any additional information about this connection"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="heartglow-button"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Connection'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </Layout>
    </AuthGuard>
  );
} 