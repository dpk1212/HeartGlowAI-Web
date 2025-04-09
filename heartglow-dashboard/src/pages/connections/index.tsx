import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth, getRouteWithBasePath } from '../_app';
import AuthGuard from '../../components/AuthGuard';
import Layout from '../../components/Layout';
import { fadeIn, itemVariantsY, containerVariants } from '../../lib/animations';

interface Connection {
  id: string;
  name: string;
  relationship: string;
  yearsKnown: number;
  notes?: string;
  messageCount?: number;
}

export default function Connections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const connectionsQuery = query(collection(db, `users/${user.uid}/connections`));
        const querySnapshot = await getDocs(connectionsQuery);
        
        const connectionsPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          
          // Get message count for each connection
          const messagesQuery = query(collection(db, `users/${user.uid}/connections/${doc.id}/messages`));
          const messagesSnapshot = await getDocs(messagesQuery);
          
          return {
            id: doc.id,
            name: data.name,
            relationship: data.relationship,
            yearsKnown: data.yearsKnown,
            notes: data.notes,
            messageCount: messagesSnapshot.size
          };
        });
        
        const connectionsData = await Promise.all(connectionsPromises);
        setConnections(connectionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching connections:', err);
        setError('Failed to load connections. Please try again.');
        setLoading(false);
      }
    };
    
    fetchConnections();
  }, [user]);

  const handleAddConnection = () => {
    router.push(getRouteWithBasePath('/connections/new'));
  };

  const handleViewMessages = (id: string) => {
    router.push(getRouteWithBasePath(`/connections/${id}`));
  };

  const handleDeleteConnection = async (id: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, `users/${user.uid}/connections/${id}`));
      
      // Update local state
      setConnections(prev => prev.filter(connection => connection.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting connection:', err);
      setError('Failed to delete connection. Please try again.');
    }
  };

  return (
    <AuthGuard>
      <Layout title="Your Connections | HeartGlow AI">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">Your Connections</h1>
            <button 
              onClick={handleAddConnection}
              className="heartglow-button flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Connection
            </button>
          </div>

          {loading ? (
            <div className="card p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="rounded-full bg-heartglow-softpurple h-12 w-12"></div>
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 bg-heartglow-softpurple rounded w-3/4"></div>
                      <div className="h-4 bg-heartglow-softpurple rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="card p-6">
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            </div>
          ) : connections.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-heartglow-gray mb-4">You don't have any connections yet.</p>
              <button
                onClick={handleAddConnection}
                className="heartglow-button"
              >
                Add Your First Connection
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {connections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  variants={itemVariantsY}
                  custom={index}
                  className="card p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-xl font-medium">{connection.name}</h2>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-heartglow-gray">
                        <div>
                          <span className="font-medium">Relationship:</span> {connection.relationship}
                        </div>
                        <div>
                          <span className="font-medium">Years Known:</span> {connection.yearsKnown}
                        </div>
                        <div>
                          <span className="font-medium">Messages:</span> {connection.messageCount || 0}
                        </div>
                      </div>
                      {connection.notes && (
                        <p className="mt-2 text-sm text-heartglow-gray max-w-xl">
                          <span className="font-medium">Notes:</span> {connection.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewMessages(connection.id)}
                        className="heartglow-button"
                      >
                        View Messages
                      </button>
                      {deleteConfirm === connection.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteConnection(connection.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(connection.id)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </Layout>
    </AuthGuard>
  );
} 