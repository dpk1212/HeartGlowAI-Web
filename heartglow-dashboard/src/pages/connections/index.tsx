import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { fetchUserConnections, Connection as DbConnection, formatRelativeTime, getConnectionFrequency } from '../../firebase/db';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/layout/AuthGuard';

// Helper to get initials (could be moved to utils)
const getInitials = (name: string): string => {
  if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
};

// Helper for frequency color (could be moved to utils)
const getFrequencyColor = (freq: 'frequent' | 'recent' | 'new'): string => {
    switch (freq) {
        case 'frequent': return 'bg-purple-500';
        case 'recent': return 'bg-blue-500';
        case 'new': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
};

// Reusable Connection Card
const ConnectionGridCard: React.FC<{ connection: DbConnection }> = ({ connection }) => {
    const frequency = getConnectionFrequency(connection);
    const lastMessageTime = connection.lastMessageDate 
      ? formatRelativeTime(connection.lastMessageDate)
      : 'No messages yet';
      
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-heartglow-deepgray rounded-lg shadow-md border border-gray-100 dark:border-gray-800 p-4 transition-all duration-300 hover:shadow-lg group transform hover:-translate-y-1"
        >
            <div className="flex items-center mb-3">
                <div className="relative mr-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-heartglow-pink to-heartglow-violet flex items-center justify-center text-white text-lg font-semibold shadow-sm">
                        {getInitials(connection.name)}
                    </div>
                    <div className={`absolute -right-1 bottom-0 w-3 h-3 rounded-full border-2 border-white dark:border-heartglow-deepgray ${getFrequencyColor(frequency)}`}></div>
                </div>
                <div>
                    <h3 className="font-semibold text-heartglow-charcoal dark:text-heartglow-offwhite text-md">
                        {connection.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {connection.relationship || 'Connection'}
                    </p>
                </div>
            </div>
            <p className="text-xs text-heartglow-pink mb-3">
                Last message: {lastMessageTime}
            </p>
            <div className="flex justify-end space-x-2">
                 <Link href={`/connections/${connection.id}`} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                     View/Edit
                 </Link>
                 <Link href={`/create?recipientId=${connection.id}&recipientName=${encodeURIComponent(connection.name)}&relationship=${encodeURIComponent(connection.relationship || '')}`} className="text-xs bg-heartglow-pink/10 text-heartglow-pink px-3 py-1 rounded-full hover:bg-heartglow-pink/20">
                     New Message
                 </Link>
            </div>
        </motion.div>
    );
};

// Main page component
export default function AllConnectionsPage() {
  const { currentUser } = useAuth();
    const [connections, setConnections] = useState<DbConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
        const loadData = async () => {
            if (!currentUser) return;
      try {
        setLoading(true);
                const userConnections = await fetchUserConnections(currentUser, 1000); // Fetch all
                setConnections(userConnections);
        setError(null);
      } catch (err) {
                console.error("Error fetching all connections:", err);
                setError("Failed to load connections.");
      } finally {
        setLoading(false);
      }
    };
        loadData();
  }, [currentUser]);

  return (
      <AuthGuard>
        <DashboardLayout>
                <div className="container mx-auto py-8 px-4 max-w-6xl">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite">Your Connections</h1>
                        <Link href="/connections/add" className="inline-flex items-center justify-center bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white font-medium rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:shadow-glow transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Connection
                      </Link>
                          </div>
                          
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-heartglow-pink"></div>
                            </div>
                    )}

                    {error && (
                        <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                            <p className="text-red-600 dark:text-red-300">{error}</p>
                            </div>
                    )}

                    {!loading && !error && connections.length === 0 && (
                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400">You haven't added any connections yet.</p>
                          </div>
                    )}

                    {!loading && !error && connections.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {connections.map(conn => (
                                <ConnectionGridCard key={conn.id} connection={conn} />
                            ))}
                </div>
              )}
          </div>
        </DashboardLayout>
      </AuthGuard>
  );
}