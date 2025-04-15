import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface RecipientData {
  id: string;
  name: string;
  relationship: string;
  specificRelationship?: string;
  lastContact?: string | Timestamp;
  yearsKnown?: number;
  communicationStyle?: string;
  relationshipGoal?: string;
  notes?: string;
}

interface RecipientStepOutput {
  recipient: {
    id: string;
    name: string;
    relationship: string;
  };
  connectionData: {
    specificRelationship?: string;
    yearsKnown?: number;
    communicationStyle?: string;
    relationshipGoal?: string;
    lastMessageDate?: any;
  };
}

interface RecipientStepProps {
  onNext: (data: RecipientStepOutput) => void;
  initialData?: RecipientStepOutput['recipient'];
}

export default function RecipientStep({ onNext, initialData }: RecipientStepProps) {
  console.log('>>> RecipientStep component rendering started');
  const { currentUser } = useAuth();
  const [recipients, setRecipients] = useState<RecipientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!currentUser) return;

      try {
        const connectionsRef = collection(db, 'users', currentUser.uid, 'connections');
        const q = query(connectionsRef);
        const querySnapshot = await getDocs(q);
        
        const fetchedRecipients = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as RecipientData[];

        setRecipients(fetchedRecipients);

        if (initialData?.id) {
          const foundRecipient = fetchedRecipients.find(r => r.id === initialData.id);
          if (foundRecipient) {
            setSelectedRecipient(foundRecipient);
          } else {
            console.warn("Initial recipient ID not found in the current list.");
            setSelectedRecipient(null);
          }
        }

      } catch (err) {
        setError('Failed to load recipients. Please try again.');
        console.error('Error fetching recipients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipients();
  }, [currentUser, initialData?.id]);

  const handleSelect = (recipient: RecipientData) => {
    setSelectedRecipient(recipient);
  };

  const handleNext = () => {
    if (selectedRecipient) {
      const output: RecipientStepOutput = {
        recipient: {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          relationship: selectedRecipient.relationship,
        },
        connectionData: {
          specificRelationship: selectedRecipient.specificRelationship,
          yearsKnown: selectedRecipient.yearsKnown,
          communicationStyle: selectedRecipient.communicationStyle,
          relationshipGoal: selectedRecipient.relationshipGoal,
          lastMessageDate: selectedRecipient.lastContact instanceof Timestamp 
                             ? selectedRecipient.lastContact.toDate() 
                             : selectedRecipient.lastContact
        }
      };
      onNext(output);
    }
  };

  const formatLastContact = (dateInput: string | Timestamp | undefined): string | null => {
    if (!dateInput) return null;
    try {
      const date = dateInput instanceof Timestamp ? dateInput.toDate() : new Date(dateInput);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return null;
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
    <div className="space-y-8 dark:text-heartglow-offwhite">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Who would you like to message?</h2>
        <Link href="/connections/add" legacyBehavior>
          <a className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink focus:ring-offset-gray-900 transition-colors">
            <Plus size={16} className="-ml-1 mr-2" />
            Add Connection
          </a>
        </Link>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">Select a recipient from your connections</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-300" role="alert">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {recipients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No recipients found.</p>
            <Link href="/connections/add" legacyBehavior>
              <a className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink focus:ring-offset-gray-900 transition-colors">
                <Plus size={16} className="-ml-1 mr-2" />
                Add Your First Connection
              </a>
            </Link>
          </div>
        ) : (
          recipients.map((recipient) => {
            const formattedLastContact = formatLastContact(recipient.lastContact);
            return (
              <motion.div
                key={recipient.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedRecipient?.id === recipient.id
                    ? 'border-transparent ring-2 ring-heartglow-pink bg-gradient-to-br from-heartglow-pink/10 via-white to-heartglow-violet/10 dark:from-heartglow-pink/40 dark:to-heartglow-violet/40' 
                    : 'bg-white border-gray-200 hover:border-heartglow-pink/80 dark:bg-heartglow-deepgray dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-heartglow-pink' 
                }`}
                onClick={() => handleSelect(recipient)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-heartglow-offwhite">{recipient.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{recipient.specificRelationship || recipient.relationship}</p>
                  </div>
                  {formattedLastContact && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last contact: {formattedLastContact}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!selectedRecipient}
          className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink ${
            selectedRecipient
              ? 'bg-heartglow-pink hover:bg-heartglow-pink/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 