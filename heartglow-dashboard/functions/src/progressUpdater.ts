import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK (ensure this is done only once)
try {
  admin.initializeApp();
} catch (e) {
  console.log("Admin SDK already initialized or initialization failed.");
}
const db = admin.firestore();

// Define XP amounts
const BASE_XP_PER_MESSAGE = 10;
// Add other XP constants as needed

// Function to calculate new tier based on XP
function calculateTier(xp: number): string {
  if (xp >= 500) return '🕊 Legacy Builder';
  if (xp >= 301) return '💫 HeartGuide';
  if (xp >= 151) return '🔥 Communicator in Bloom';
  if (xp >= 51) return '🌟 Making Moves';
  return '�� Opening Up';
}

// CORRECT Firestore Path for user messages
const MESSAGE_PATH = 'users/{userId}/messages/{messageId}'; // Updated path

export const updateUserProgressOnMessage = functions.firestore
  .document(MESSAGE_PATH)
  .onCreate(async (snap, context) => {
    const messageData = snap.data();
    const userId = context.params.userId;
    const messageId = context.params.messageId;

    if (!messageData) {
        console.error(`No data found for message ${messageId} for user ${userId}. Exiting.`);
        return null;
    }
    // Use createdAt primarily, fallback to server timestamp
    const messageTimestamp = messageData.createdAt || admin.firestore.FieldValue.serverTimestamp();

    console.log(`Processing message ${messageId} for user ${userId}`);
    const userRef = db.collection('users').doc(userId);
    try {
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error("User document not found!");
        }

        const userData = userDoc.data() || {};
        const currentXP = userData.glowScoreXP || 0;
        const activeChallenge = userData.activeChallenge || null;
        const metrics = userData.metrics || { weeklyMessageCount: 0, uniqueConnectionsMessagedWeekly: [], toneCounts: {}, reflectionsCompletedCount: 0 };
        const currentStreak = userData.currentStreak || 0;
        const lastMessageTimestamp = userData.lastMessageTimestamp || null;
        const currentUnlockedFeatures = userData.unlockedFeatures || []; // Get existing unlocks

        let xpEarned = BASE_XP_PER_MESSAGE;
        let challengeCompleted = false;
        let updatedChallengeData = activeChallenge ? { ...activeChallenge } : null;
        let challengeCriteriaMet = false;
        let newlyUnlockedFeature: string | null = null; // To store potential unlock

        // --- Challenge Logic ---
        if (updatedChallengeData && updatedChallengeData.status === 'active') {
          const challengeDefSnapshot = await db.collection('challenges').doc(updatedChallengeData.challengeId).get();
          if (challengeDefSnapshot.exists) {
              const challengeDef = challengeDefSnapshot.data();
              const criteria = challengeDef?.criteria;

              // --- Use Correct Field Names ---
              const messageIntent = messageData.intent;
              const messageTone = messageData.tone;
              const messageRelationship = messageData.relationship; // Use 'relationship' field

              // Check criteria
              if (criteria?.type === 'message_count') {
                  challengeCriteriaMet = true;
              } else if (criteria?.type === 'intent' && messageIntent === criteria.value) {
                  challengeCriteriaMet = true;
              } else if (criteria?.type === 'recipient_type' && messageRelationship === criteria.value) { // Check against 'relationship'
                  challengeCriteriaMet = true;
              } else if (criteria?.type === 'tone' && messageTone === criteria.value) {
                  challengeCriteriaMet = true;
              }
              // --- End Correct Field Names ---


              if (challengeCriteriaMet) {
                  updatedChallengeData.progress = (updatedChallengeData.progress || 0) + 1;
                  if (updatedChallengeData.progress >= updatedChallengeData.goal) {
                      updatedChallengeData.status = 'completed';
                      xpEarned += updatedChallengeData.rewardXP || 0;
                      challengeCompleted = true;
                      console.log(`User ${userId} completed challenge ${updatedChallengeData.challengeId}`);

                      // Handle unlocks
                      if (updatedChallengeData.rewardUnlock) {
                          newlyUnlockedFeature = updatedChallengeData.rewardUnlock; // Store unlock identifier
                          console.log(`User ${userId} unlocked: ${newlyUnlockedFeature}`);
                      }
                  }
              }
          } else {
              console.warn(`Challenge definition ${updatedChallengeData.challengeId} not found.`);
              updatedChallengeData = null;
          }
        }

        // --- Metrics Logic ---
         let newStreak = currentStreak;
         if (lastMessageTimestamp) {
           const lastDate = lastMessageTimestamp.toDate();
           const currentDate = (messageTimestamp instanceof admin.firestore.Timestamp) ? messageTimestamp.toDate() : new Date();
           const diffTime = currentDate.getTime() - lastDate.getTime();
           const diffDays = diffTime / (1000 * 60 * 60 * 24);

           if (diffDays >= 1 && diffDays < 2) {
               newStreak += 1;
           } else if (diffDays >= 2) {
               newStreak = 1;
           }
         } else {
           newStreak = 1;
         }

        const updatedMetrics = { ...metrics };
        updatedMetrics.weeklyMessageCount = (metrics.weeklyMessageCount || 0) + 1;

        // --- Use Correct Field Names ---
        const messageConnectionId = messageData.recipientId; // Use 'recipientId'
        const messageToneForCount = messageData.tone;
        // --- End Correct Field Names ---

        // Update unique connections
        updatedMetrics.uniqueConnectionsMessagedWeekly = updatedMetrics.uniqueConnectionsMessagedWeekly || [];
        if (messageConnectionId && !updatedMetrics.uniqueConnectionsMessagedWeekly.includes(messageConnectionId)) {
            updatedMetrics.uniqueConnectionsMessagedWeekly.push(messageConnectionId);
        }

        // Update tone counts
        updatedMetrics.toneCounts = updatedMetrics.toneCounts || {};
        if (messageToneForCount) {
            updatedMetrics.toneCounts[messageToneForCount] = (updatedMetrics.toneCounts[messageToneForCount] || 0) + 1;
        }

        // --- XP & Tier ---
        const newXP = currentXP + xpEarned;
        const newTier = calculateTier(newXP);

        // --- Challenge History Update ---
         let updatedChallengeHistory = userData.challengeHistory || [];
         if (challengeCompleted) {
             const completedChallengeId = updatedChallengeData?.challengeId; // Capture before nulling
             if (completedChallengeId) { // Ensure we have an ID
                 updatedChallengeHistory.push({
                     challengeId: completedChallengeId,
                     status: 'completed',
                     completedDate: messageTimestamp,
                     assignedDate: updatedChallengeData.assignedDate
                 });
                 // Optional: Trim history
                 if (updatedChallengeHistory.length > 20) {
                      updatedChallengeHistory = updatedChallengeHistory.slice(-20);
                 }
             }
         }


        // --- Unlocked Features Update ---
        let finalUnlockedFeatures = currentUnlockedFeatures;
        if (newlyUnlockedFeature && !currentUnlockedFeatures.includes(newlyUnlockedFeature)) {
            finalUnlockedFeatures = [...currentUnlockedFeatures, newlyUnlockedFeature]; // Add new unique unlock
        }

        // --- Prepare Update ---
        const updateData: { [key: string]: any } = {
          glowScoreXP: newXP,
          glowScoreTier: newTier,
          currentStreak: newStreak,
          lastMessageTimestamp: messageTimestamp,
          metrics: updatedMetrics,
          activeChallenge: challengeCompleted ? null : updatedChallengeData,
          challengeHistory: updatedChallengeHistory,
          unlockedFeatures: finalUnlockedFeatures // Add updated unlocks array
        };

        // Update user document
        transaction.update(userRef, updateData);
      });
      console.log(`Successfully updated progress for user ${userId}`);
    } catch (error) {
      console.error(`Error updating progress for user ${userId}:`, error);
    }
    return null;
  });

// Option 2: Callable Function (Commented out)
/*
export const updateUserProgressCallable = functions.https.onCall(async (data, context) => {
  // ... implementation ... 
});
*/

// Add other progress/XP related functions if needed (e.g., for reflection completion) 