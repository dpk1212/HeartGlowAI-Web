import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already done (common practice)
try {
  admin.initializeApp();
} catch (e) { /* Ignored */ }
const db = admin.firestore();

// Re-use types (consider centralizing these in a types file later)
type ChallengeCriteria = { type: string; value: number | string; description?: string; };
type ChallengeDefinition = {
  id: string;
  name: string;
  description: string;
  criteria: ChallengeCriteria;
  rewardXP: number;
  rewardUnlock?: string | null;
  isActive?: boolean;
};
type ActiveChallenge = {
  challengeId: string;
  progress: number;
  goal: number;
  assignedDate: admin.firestore.Timestamp;
  status: 'active';
  rewardXP: number;
  rewardUnlock: string | null;
};

/**
 * HTTPS Callable function to allow a user to select an active challenge.
 */
export const selectChallenge = functions.https.onCall(async (data, context) => {
  // --- Authentication ---
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const userId = context.auth.uid;
  const challengeId = data.challengeId;

  if (!challengeId || typeof challengeId !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid "challengeId".');
  }

  console.log(`User ${userId} attempting to select challenge ${challengeId}`);
  const userRef = db.collection('users').doc(userId);

  try {
    // --- Transaction to ensure atomicity ---
    const newActiveChallenge = await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User document not found.');
      }
      const userData = userDoc.data() || {};

      // Check if user already has an active challenge
      if (userData.activeChallenge) {
        console.warn(`User ${userId} already has an active challenge (${userData.activeChallenge.challengeId}). Cannot select another.`);
        // Don't throw an error, just return null or a specific status?
        // Throwing allows client to know it failed definitively.
        throw new functions.https.HttpsError('failed-precondition', 'User already has an active challenge.');
      }

      // Fetch the selected challenge definition
      const challengeRef = db.collection('challenges').doc(challengeId);
      const challengeDoc = await transaction.get(challengeRef);

      if (!challengeDoc.exists) {
          throw new functions.https.HttpsError('not-found', `Challenge definition ${challengeId} not found.`);
      }
      const challengeDef = { id: challengeDoc.id, ...challengeDoc.data() } as ChallengeDefinition;

      if (!challengeDef.isActive) {
          throw new functions.https.HttpsError('failed-precondition', `Challenge ${challengeId} is not active.`);
      }

      // Determine goal based on criteria type (similar to assignment logic)
      let goal = 1; // Default goal
      if (challengeDef.criteria) {
          if (challengeDef.criteria.type === 'sendMessageToMultiple' && typeof challengeDef.criteria.value === 'number') {
              goal = challengeDef.criteria.value;
          }
          // Add other criteria types that might set a numeric goal
      }
      goal = Math.max(1, goal); // Ensure goal is at least 1

      const challengeToAssign: ActiveChallenge = {
          challengeId: challengeDef.id,
          progress: 0,
          goal: goal,
          assignedDate: admin.firestore.Timestamp.now(),
          status: 'active',
          rewardXP: challengeDef.rewardXP || 0,
          rewardUnlock: challengeDef.rewardUnlock || null,
      };

      // Update the user document
      transaction.update(userRef, { activeChallenge: challengeToAssign });

      console.log(`Successfully assigned challenge ${challengeId} to user ${userId} via selection.`);
      return challengeToAssign; // Return the assigned challenge data
    });

    // Transaction successful
    return { status: 'success', activeChallenge: newActiveChallenge };

  } catch (error) {
      console.error(`Error selecting challenge ${challengeId} for user ${userId}:`, error);
      // Re-throw HttpsError or wrap other errors
      if (error instanceof functions.https.HttpsError) {
          throw error;
      }
      throw new functions.https.HttpsError('internal', 'An unexpected error occurred while selecting the challenge.', error);
  }
}); 