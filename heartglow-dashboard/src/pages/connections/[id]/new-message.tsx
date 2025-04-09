import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { collection, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth, getRouteWithBasePath } from '../../_app';
import AuthGuard from '../../../components/AuthGuard';
import Layout from '../../../components/Layout';
import { fadeIn } from '../../../lib/animations';

interface Connection {
  id: string;
  name: string;
  relationship: string;
}

export default function NewMessage() {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [message, setMessage] = useState('');
  const [sentiment, setSentiment] = useState('neutral');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    const fetchConnection = async () => {
      if (!user || !id || typeof id !== 'string') return;
      
      try {
        setLoading(true);
        
        // Fetch connection details
        const connectionDoc = await getDoc(doc(db, `users/${user.uid}/connections/${id}`));
        
        if (!connectionDoc.exists()) {
          setError('Connection not found');
          setLoading(false);
          return;
        }
        
        const connectionData = connectionDoc.data();
        setConnection({
          id: connectionDoc.id,
          name: connectionData.name,
          relationship: connectionData.relationship,
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching connection:', err);
        setError('Failed to load connection. Please try again.');
        setLoading(false);
      }
    };
    
    fetchConnection();
  }, [user, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id || typeof id !== 'string') return;
    if (!message.trim()) {
      setError('Message text is required');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Add the message to Firestore
      await addDoc(collection(db, `users/${user.uid}/connections/${id}/messages`), {
        text: message.trim(),
        sentiment,
        createdAt: serverTimestamp(),
      });
      
      setSuccess(true);
      
      // Clear form
      setMessage('');
      setSentiment('neutral');
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        router.push(getRouteWithBasePath(`/connections/${id}`));
      }, 1500);
      
    } catch (err) {
      console.error('Error adding message:', err);
      setError('Failed to add message. Please try again.');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(getRouteWithBasePath(`/connections/${id}`));
  };

  return (
    <AuthGuard>
      <Layout title={connection ? `New Message for ${connection.name} | HeartGlow AI` : 'New Message | HeartGlow AI'}>
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
              Back to Messages
            </button>
          </div>

          <div className="card p-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-heartglow-softpurple h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-heartglow-softpurple rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-heartglow-softpurple rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                Message added successfully! Redirecting...
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-medium mb-6">New Message for {connection?.name}</h1>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="message" className="block mb-2 font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-heartglow-purple focus:border-transparent resize-none"
                      placeholder="Write your message here..."
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">
                      Sentiment
                    </label>
                    <div className="flex gap-4">
                      {['positive', 'neutral', 'negative'].map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name="sentiment"
                            value={option}
                            checked={sentiment === option}
                            onChange={() => setSentiment(option)}
                            className="mr-2"
                          />
                          <span className="capitalize">{option}</span>
                        </label>
                      ))}
                    </div>
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
                      {submitting ? 'Saving...' : 'Save Message'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </Layout>
    </AuthGuard>
  );
} 