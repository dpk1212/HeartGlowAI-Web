import { useState, useEffect } from 'react';
import { useAuth } from '../pages/_app';
import { getUserConnections, getRecentMessages, ConnectionData, MessageData } from './firestore';

/**
 * Custom hook for fetching user connections
 */
export function useConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchConnections() {
      if (!user) {
        setConnections([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const connectionsData = await getUserConnections(user.uid);
        setConnections(connectionsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching connections:', err);
        setError('Failed to load your connections. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchConnections();
  }, [user]);
  
  return { connections, loading, error };
}

/**
 * Custom hook for fetching recent messages
 */
export function useRecentMessages(messageLimit = 3) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchMessages() {
      if (!user) {
        setMessages([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const messagesData = await getRecentMessages(user.uid, messageLimit);
        setMessages(messagesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load your recent messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMessages();
  }, [user, messageLimit]);
  
  return { messages, loading, error };
} 