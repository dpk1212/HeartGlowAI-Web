import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK (ensure this is done only once)
try {
  admin.initializeApp();
} catch (e) { /* Ignored */ }
const db = admin.firestore();

export const skipChallenge = functions.https.onCall(async (data, context) => {
  // 1. Check Authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const userId = context.auth.uid;
  console.log(`User ${userId} attempting to skip challenge.`);

  const userRef = db.collection('users').doc(userId);

  try {
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User document not found.');
      }

      const userData = userDoc.data() || {};
      const activeChallenge = userData.activeChallenge;

      // 2. Check if there's an active challenge to skip
      if (!activeChallenge || activeChallenge.status !== 'active') {
        console.log(`User ${userId} has no active challenge to skip.`);
        // No need to throw error, just return success as there's nothing to do
        return;
      }

      // 3. Prepare update data
      let updatedChallengeHistory = userData.challengeHistory || [];

      // Add skipped challenge to history
      updatedChallengeHistory.push({
          challengeId: activeChallenge.challengeId,
          status: 'skipped',
          assignedDate: activeChallenge.assignedDate,
          // completedDate is null for skipped
      });

      // Optional: Trim history if it gets too long
      if (updatedChallengeHistory.length > 20) {
           updatedChallengeHistory = updatedChallengeHistory.slice(-20);
      }

      // Update user document: set activeChallenge to null and update history
      transaction.update(userRef, {
          activeChallenge: null, // Clear the active challenge
          challengeHistory: updatedChallengeHistory
      });
    });

    console.log(`Successfully skipped challenge for user ${userId}`);
    return { status: 'success', message: 'Challenge skipped successfully.' };

  } catch (error: any) {
    console.error(`Error skipping challenge for user ${userId}:`, error);
    if (error instanceof functions.https.HttpsError) {
        throw error; // Re-throw HttpsError
    }
    throw new functions.https.HttpsError('internal', 'Failed to skip challenge.', error.message);
  }
}); 