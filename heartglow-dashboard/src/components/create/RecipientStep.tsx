import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

interface Recipient {
  id: string;
  name: string;
  relationship: string;
  lastContact?: string;
  notes?: string;
}

interface RecipientStepProps {
  onNext: (data: { recipient: Recipient }) => void;
}

export default function RecipientStep({ onNext }: RecipientStepProps) {
  const { user } = useAuth();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!user) return;

      try {
        const connectionsRef = collection(db, 'users', user.uid, 'connections');
        const q = query(connectionsRef);
        const querySnapshot = await getDocs(q);
        
        const fetchedRecipients = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Recipient[];

        setRecipients(fetchedRecipients);
      } catch (err) {
        setError('Failed to load recipients. Please try again.');
        console.error('Error fetching recipients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipients();
  }, [user]);

  const handleSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
  };

  const handleNext = () => {
    if (selectedRecipient) {
      onNext({ recipient: selectedRecipient });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Who would you like to message?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Select a recipient from your connections</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {recipients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No recipients found. Add some connections first.</p>
          </div>
        ) : (
          recipients.map((recipient) => (
            <motion.div
              key={recipient.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedRecipient?.id === recipient.id
                  ? 'border-heartglow-pink bg-heartglow-pink/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-heartglow-pink'
              }`}
              onClick={() => handleSelect(recipient)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{recipient.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{recipient.relationship}</p>
                </div>
                {recipient.lastContact && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last contact: {new Date(recipient.lastContact).toLocaleDateString()}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedRecipient}
          className={`px-4 py-2 rounded-lg font-medium ${
            selectedRecipient
              ? 'bg-heartglow-pink text-white hover:bg-heartglow-pink/90'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 