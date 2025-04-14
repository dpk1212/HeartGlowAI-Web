import * as functions from "firebase-functions"; // Add import
import * as admin from "firebase-admin"; // Add import
import cors = require("cors"); // Use require-style import for cors

// Initialize Firebase Admin SDK (ensure this is done only once) - Add this
try {
  admin.initializeApp();
} catch (e) { /* Ignored */ }
const db = admin.firestore(); // Add this

// Configure CORS options
// IMPORTANT: Restrict this to your actual frontend domain in production!
const corsHandler = cors({ origin: true }); // Allows all origins for now, refine later

// Import and re-export functions from their respective files

// Export Challenge Scheduler function(s)
export * from './challengeScheduler';

// Export Progress Updater function(s)
export * from './progressUpdater';

// --- Removed explicit import/export for challengeActions ---
// import { skipChallenge } from './challengeActions';
// export { skipChallenge };

// --- Define skipCurrentChallenge as an onRequest function ---
export const skipCurrentChallenge = functions.https.onRequest((req, res) => {
  // Wrap the function logic with the CORS handler
  corsHandler(req, res, async () => {
    // --- Authentication ---
    // For onRequest, you need to manually verify the user.
    // Typically, the frontend sends the Firebase ID token in the Authorization header.
    // Example: const idToken = req.headers.authorization?.split('Bearer ')[1];
    // You would then verify this token using admin.auth().verifyIdToken(idToken)
    // For now, we'll *assume* authentication is handled and get userId (replace with real verification)
    let userId: string | null = null;
    try {
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
          console.error('No Bearer token found');
          res.status(403).send('Unauthorized: No token provided');
          return;
      }
      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      userId = decodedToken.uid;
      console.log(`Authenticated user ${userId} attempting to skip challenge.`);
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized: Invalid token');
        return;
    }
    // --- End Authentication ---

    if (!userId) {
       res.status(403).send('Unauthorized'); // Should not happen if verification works
       return;
    }

    const userRef = db.collection('users').doc(userId);

    try {
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          console.error(`User document not found for ${userId}`);
          // Don't send response inside transaction, throw an error instead
          throw new Error('User not found.'); 
        }

        const userData = userDoc.data() || {};
        const activeChallenge = userData.activeChallenge;

        if (!activeChallenge || activeChallenge.status !== 'active') {
          console.log(`User ${userId} has no active challenge to skip.`);
          // Don't send response inside transaction, throw specific error/signal
          throw new Error('NO_ACTIVE_CHALLENGE'); 
        }

        let updatedChallengeHistory = userData.challengeHistory || [];
        updatedChallengeHistory.push({
            challengeId: activeChallenge.challengeId,
            status: 'skipped',
            assignedDate: activeChallenge.assignedDate,
        });

        if (updatedChallengeHistory.length > 20) {
             updatedChallengeHistory = updatedChallengeHistory.slice(-20);
        }

        transaction.update(userRef, {
            activeChallenge: null,
            challengeHistory: updatedChallengeHistory
        });
        // Important: Don't send response inside transaction!
      });

      // Transaction succeeded if it didn't throw
      console.log(`Successfully skipped challenge for user ${userId}`);
      res.status(200).send({ status: 'success', message: 'Challenge skipped successfully.' });

    } catch (error: any) {
        // Handle specific errors thrown from transaction
        if (error.message === 'User not found.') {
            res.status(404).send('User not found.');
        } else if (error.message === 'NO_ACTIVE_CHALLENGE') {
            res.status(200).send({ status: 'success', message: 'No active challenge to skip.' });
        } else {
            // Handle generic errors
            console.error(`Error skipping challenge for user ${userId}:`, error);
            res.status(500).send('Internal Server Error: Failed to skip challenge.');
        }
    }
  }); // End CORS handler wrapper
});

// --- Add exports for your OTHER existing functions below --- 
// e.g., export * from './yourOtherFunctionFile';

console.log('Importing and exporting Cloud Functions...'); 