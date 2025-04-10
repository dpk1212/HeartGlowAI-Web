import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { collection, query, getDocs, orderBy, limit, collectionGroup, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth, getRouteWithBasePath } from '../pages/_app';
import { containerVariants, itemVariantsY } from '../lib/animations';

interface Message {
  id: string;
  text: string;
  sentiment: string;
  createdAt: Date;
  connectionId: string;
  connectionName: string;
}

export default function RecentMessagesList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentMessages = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get messages from all connections
        const messagesQuery = query(
          collectionGroup(db, 'messages'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        
        // Filter to only include messages from connections owned by this user
        const userConnectionsPath = `users/${user.uid}/connections/`;
        const userMessages = messagesSnapshot.docs.filter(doc => 
          doc.ref.path.includes(userConnectionsPath)
        );
        
        // Create an array of promises to resolve connection names
        const messagesWithConnectionPromises = userMessages.map(async docSnapshot => {
          const data = docSnapshot.data();
          
          // Extract connection ID from the path
          // Path format: users/{userId}/connections/{connectionId}/messages/{messageId}
          const pathParts = docSnapshot.ref.path.split('/');
          const connectionId = pathParts[3]; // Index 3 should be the connection ID
          
          // Get connection details using proper Firestore v9 syntax
          const connectionDocRef = doc(db, `users/${user.uid}/connections/${connectionId}`);
          const connectionDocSnapshot = await getDoc(connectionDocRef);
          const connectionData = connectionDocSnapshot.data();
          
          return {
            id: docSnapshot.id,
            text: data.text,
            sentiment: data.sentiment || 'neutral',
            createdAt: data.createdAt?.toDate() || new Date(),
            connectionId,
            connectionName: connectionData?.name || 'Unknown'
          };
        });
        
        const messagesData = await Promise.all(messagesWithConnectionPromises);
        setMessages(messagesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recent messages:', err);
        setError('Failed to load recent messages.');
        setLoading(false);
      }
    };
    
    fetchRecentMessages();
  }, [user]);

  const handleViewConnection = (connectionId: string) => {
    router.push(getRouteWithBasePath(`/connections/${connectionId}`));
  };

  // Helper function to format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Recent Messages</h2>
        <div className="card p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="rounded-full bg-heartglow-softpurple h-10 w-10"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-heartglow-softpurple rounded w-3/4"></div>
                  <div className="h-4 bg-heartglow-softpurple rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Recent Messages</h2>
        <div className="card p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (messages.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-4">Recent Messages</h2>
        <div className="card p-6 text-center">
          <p className="text-heartglow-gray mb-4">You haven't created any messages yet.</p>
          <button
            onClick={() => router.push(getRouteWithBasePath('/connections'))}
            className="heartglow-button"
          >
            View Your Connections
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-medium">Recent Messages</h2>
        <button
          onClick={() => router.push(getRouteWithBasePath('/connections'))}
          className="text-heartglow-purple hover:text-heartglow-deeppurple text-sm"
        >
          View All Connections
        </button>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            variants={itemVariantsY}
            custom={index}
            className="card p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span 
                  className="font-medium text-heartglow-purple hover:text-heartglow-deeppurple cursor-pointer"
                  onClick={() => handleViewConnection(message.connectionId)}
                >
                  {message.connectionName}
                </span>
                <span className="mx-2 text-heartglow-gray">•</span>
                <span className="text-sm text-heartglow-gray">
                  {formatDate(message.createdAt)}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(message.sentiment)}`}>
                {message.sentiment.charAt(0).toUpperCase() + message.sentiment.slice(1)}
              </span>
            </div>
            <p className="text-sm text-heartglow-gray line-clamp-2">
              {message.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
} 