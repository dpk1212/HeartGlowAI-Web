import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth, getRouteWithBasePath } from '../pages/_app';
import { containerVariants, itemVariantsX } from '../lib/animations';

interface Connection {
  id: string;
  name: string;
  relationship: string;
}

export default function ConnectionsCarousel() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const connectionsQuery = query(
          collection(db, `users/${user.uid}/connections`),
          limit(5)
        );
        
        const querySnapshot = await getDocs(connectionsQuery);
        const connectionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          relationship: doc.data().relationship
        }));
        
        setConnections(connectionsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching connections:', err);
        setError('Failed to load connections');
        setLoading(false);
      }
    };
    
    fetchConnections();
  }, [user]);

  const handleConnectionClick = (connectionId: string) => {
    router.push(getRouteWithBasePath(`/connections/${connectionId}`));
  };
  
  const handleViewAllConnections = () => {
    router.push(getRouteWithBasePath('/connections'));
  };
  
  const handleAddConnection = () => {
    router.push(getRouteWithBasePath('/connections/new'));
  };

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Your Connections</h2>
        <div className="bg-white dark:bg-heartglow-deepgray/30 p-6 rounded-lg">
          <div className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-48 h-32 bg-heartglow-softgray/20 dark:bg-heartglow-deepgray animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Your Connections</h2>
        <div className="bg-white dark:bg-heartglow-deepgray/30 p-6 rounded-lg">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium">Your Connections</h2>
        {connections.length > 0 && (
          <button
            onClick={handleViewAllConnections}
            className="text-heartglow-purple hover:text-heartglow-deeppurple text-sm"
          >
            View All
          </button>
        )}
      </div>
      
      {connections.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-heartglow-gray mb-4">You haven't added any connections yet.</p>
          <button
            onClick={handleAddConnection}
            className="heartglow-button"
          >
            Add Your First Connection
          </button>
        </div>
      ) : (
        <div className="card p-6">
          <motion.div 
            className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {connections.map((connection, index) => (
              <motion.div
                key={connection.id}
                variants={itemVariantsX}
                custom={index}
                onClick={() => handleConnectionClick(connection.id)}
                className="flex-shrink-0 w-48 bg-heartglow-offwhite dark:bg-heartglow-deepgray/50 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-glow transition-shadow duration-300"
              >
                <h3 className="font-medium text-lg mb-1 truncate">{connection.name}</h3>
                <p className="text-sm text-heartglow-gray">{connection.relationship}</p>
              </motion.div>
            ))}
            
            <motion.div
              variants={itemVariantsX}
              custom={connections.length}
              onClick={handleAddConnection}
              className="flex-shrink-0 w-48 h-32 border-2 border-dashed border-heartglow-softgray dark:border-heartglow-deepgray rounded-lg flex items-center justify-center cursor-pointer hover:border-heartglow-purple transition-colors duration-300"
            >
              <div className="text-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 mx-auto text-heartglow-purple" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium text-heartglow-purple mt-2 block">
                  Add Connection
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </section>
  );
} 