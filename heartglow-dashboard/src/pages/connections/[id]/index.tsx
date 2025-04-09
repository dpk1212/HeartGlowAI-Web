import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { collection, doc, getDoc, getDocs, orderBy, query, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth, getRouteWithBasePath } from '../../_app';
import AuthGuard from '../../../components/AuthGuard';
import Layout from '../../../components/Layout';
import { fadeIn, itemVariantsY, containerVariants } from '../../../lib/animations';

interface Message {
  id: string;
  text: string;
  sentiment: string;
  createdAt: Date;
}

interface Connection {
  id: string;
  name: string;
  relationship: string;
  yearsKnown: number;
  notes?: string;
}

export default function ConnectionMessages() {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
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
          yearsKnown: connectionData.yearsKnown,
          notes: connectionData.notes || undefined
        });
        
        // Fetch messages
        const messagesQuery = query(
          collection(db, `users/${user.uid}/connections/${id}/messages`),
          orderBy('createdAt', 'desc')
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesList = messagesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text,
            sentiment: data.sentiment || 'neutral',
            createdAt: data.createdAt?.toDate() || new Date(),
          };
        });
        
        setMessages(messagesList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, id]);

  const handleBack = () => {
    router.push(getRouteWithBasePath('/connections'));
  };

  const handleNewMessage = () => {
    if (id) {
      router.push(getRouteWithBasePath(`/connections/${id}/new-message`));
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user || !id || typeof id !== 'string') return;
    
    try {
      await deleteDoc(doc(db, `users/${user.uid}/connections/${id}/messages/${messageId}`));
      
      // Update local state
      setMessages(prev => prev.filter(message => message.id !== messageId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message. Please try again.');
    }
  };

  // Helper function to format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Helper to get sentiment color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'neutral':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <AuthGuard>
      <Layout title={connection ? `Messages for ${connection.name} | HeartGlow AI` : 'Connection Messages | HeartGlow AI'}>
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="mb-6">
            <button 
              onClick={handleBack}
              className="text-heartglow-purple hover:text-heartglow-deeppurple flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Connections
            </button>
          </div>

          {loading ? (
            <div className="card p-6 flex justify-center items-center h-40">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-heartglow-softpurple h-10 w-10"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-heartglow-softpurple rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-heartglow-softpurple rounded"></div>
                    <div className="h-4 bg-heartglow-softpurple rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="card p-6">
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            </div>
          ) : (
            <>
              <div className="card p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-medium">Messages for {connection?.name}</h1>
                  <button 
                    onClick={handleNewMessage}
                    className="heartglow-button flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Message
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium">Relationship:</span> {connection?.relationship}
                  </div>
                  <div>
                    <span className="font-medium">Years Known:</span> {connection?.yearsKnown}
                  </div>
                  {connection?.notes && (
                    <div className="md:col-span-3">
                      <span className="font-medium">Notes:</span> {connection.notes}
                    </div>
                  )}
                </div>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="card p-6 text-center">
                    <p className="text-heartglow-gray">No messages found for this connection.</p>
                    <button
                      onClick={handleNewMessage}
                      className="heartglow-button mt-4"
                    >
                      Create Your First Message
                    </button>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      variants={itemVariantsY}
                      custom={index}
                      className="card p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(message.sentiment)}`}>
                          {message.sentiment.charAt(0).toUpperCase() + message.sentiment.slice(1)}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm text-heartglow-gray mr-2">
                            {formatDate(message.createdAt)}
                          </span>
                          {deleteConfirm === message.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-heartglow-gray hover:text-heartglow-deeppurple text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(message.id)}
                              className="text-heartglow-gray hover:text-red-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </>
          )}
        </motion.div>
      </Layout>
    </AuthGuard>
  );
} 