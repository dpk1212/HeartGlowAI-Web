"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProgressOnMessage = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK (ensure this is done only once)
try {
    admin.initializeApp();
}
catch (e) {
    console.log("Admin SDK already initialized or initialization failed.");
}
const db = admin.firestore();
// Define XP amounts
const BASE_XP_PER_MESSAGE = 10;
// Add other XP constants as needed
// Function to calculate new tier based on XP
function calculateTier(xp) {
    if (xp >= 500)
        return '🕊 Legacy Builder';
    if (xp >= 301)
        return '💫 HeartGuide';
    if (xp >= 151)
        return '🔥 Communicator in Bloom';
    if (xp >= 51)
        return '🌟 Making Moves';
    return '�� Opening Up';
}
// CORRECT Firestore Path for user messages
const MESSAGE_PATH = 'users/{userId}/messages/{messageId}'; // Updated path
exports.updateUserProgressOnMessage = functions.firestore
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
            let updatedChallengeData = activeChallenge ? Object.assign({}, activeChallenge) : null;
            let challengeCriteriaMet = false;
            let newlyUnlockedFeature = null; // To store potential unlock
            // --- Check if message should apply to challenge --- 
            console.log(`[ProgressUpdater] Received messageData:`, messageData); // Log entire message data
            const shouldApplyToChallenge = messageData.appliedToChallenge === true;
            console.log(`[ProgressUpdater] Message ${messageId} for user ${userId}. Should apply to challenge? ${shouldApplyToChallenge}`);
            // --- Challenge Logic (Conditional) ---
            if (shouldApplyToChallenge && updatedChallengeData && updatedChallengeData.status === 'active') {
                console.log(`[ProgressUpdater] Entering challenge check logic for challenge ${updatedChallengeData.challengeId}...`);
                const challengeDefSnapshot = await db.collection('challenges').doc(updatedChallengeData.challengeId).get();
                if (challengeDefSnapshot.exists) {
                    const challengeDef = challengeDefSnapshot.data();
                    const criteria = challengeDef === null || challengeDef === void 0 ? void 0 : challengeDef.criteria;
                    // --- Use Correct Field Names ---
                    const messageIntent = messageData.intent;
                    const messageTone = messageData.tone;
                    const messageRelationship = messageData.relationship; // Use 'relationship' field
                    // Check criteria
                    if ((criteria === null || criteria === void 0 ? void 0 : criteria.type) === 'message_count') {
                        challengeCriteriaMet = true;
                    }
                    else if ((criteria === null || criteria === void 0 ? void 0 : criteria.type) === 'intent' && messageIntent === criteria.value) {
                        challengeCriteriaMet = true;
                    }
                    else if ((criteria === null || criteria === void 0 ? void 0 : criteria.type) === 'recipient_type' && messageRelationship === criteria.value) { // Check against 'relationship'
                        challengeCriteriaMet = true;
                    }
                    else if ((criteria === null || criteria === void 0 ? void 0 : criteria.type) === 'tone' && messageTone === criteria.value) {
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
                }
                else {
                    console.warn(`Challenge definition ${updatedChallengeData.challengeId} not found.`);
                    updatedChallengeData = null; // Clear invalid active challenge if definition missing
                }
            }
            else if (updatedChallengeData && updatedChallengeData.status === 'active') {
                console.log(`[ProgressUpdater] Skipping challenge check for message ${messageId} because shouldApplyToChallenge is ${shouldApplyToChallenge}.`);
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
                }
                else if (diffDays >= 2) {
                    newStreak = 1;
                }
            }
            else {
                newStreak = 1;
            }
            const updatedMetrics = Object.assign({}, metrics);
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
                const completedChallengeId = updatedChallengeData === null || updatedChallengeData === void 0 ? void 0 : updatedChallengeData.challengeId; // Capture before nulling
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
            const updateData = {
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
    }
    catch (error) {
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
//# sourceMappingURL=progressUpdater.js.map