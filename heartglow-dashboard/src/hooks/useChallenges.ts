import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, FirestoreError } from 'firebase/firestore';
import { db } from '../firebase/config'; // Adjust path if needed

// Re-use or import the Challenge type (adjust path if needed)
// Assuming Challenge type is defined elsewhere or define here
type ChallengeCriteria = { type: string; count?: number; value?: string };
export type ChallengeDefinition = {
  id: string;
  name?: string;
  description?: string;
  promptExample?: string;
  icon?: string;
  criteria?: ChallengeCriteria;
  rewardXP?: number;
  rewardUnlock?: string | null;
  isActive?: boolean;
};

export function useChallenges() {
  const [challenges, setChallenges] = useState<ChallengeDefinition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('[useChallenges] Fetching active challenge definitions...');
        const challengesRef = collection(db, 'challenges');
        const q = query(challengesRef, where('isActive', '==', true));
        const querySnapshot = await getDocs(q);

        const activeChallenges = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<ChallengeDefinition, 'id'>)
        }));

        console.log(`[useChallenges] Fetched ${activeChallenges.length} active challenges.`);
        setChallenges(activeChallenges);
      } catch (err) {
        console.error('[useChallenges] Error fetching challenges:', err);
        setError(err as FirestoreError);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();

    // No cleanup needed as it fetches once on mount
  }, []); // Empty dependency array ensures this runs once

  return { challenges, loading, error };
} 