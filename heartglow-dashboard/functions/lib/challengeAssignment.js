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
exports.assignWeeklyChallenges = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK (ensure this is done only once)
try {
    admin.initializeApp();
}
catch (e) { /* Ignored */ }
const db = admin.firestore();
// --- Scheduled Challenge Assignment Function ---
// Remember to set up Cloud Scheduler to trigger this Pub/Sub topic (e.g., 'weekly-challenge-assignment')
exports.assignWeeklyChallenges = functions.pubsub.topic('weekly-challenge-assignment')
    .onPublish(async (message) => {
    console.log("Starting weekly challenge assignment...");
    const challengesSnapshot = await db.collection('challenges')
        .where('isActive', '==', true)
        .get();
    if (challengesSnapshot.empty) {
        console.error("No active challenges found in the database. Skipping assignment.");
        return;
    }
    const allActiveDefinitions = challengesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    console.log(`Found ${allActiveDefinitions.length} active challenge definitions.`);
    const usersSnapshot = await db.collection('users').get();
    console.log(`Processing ${usersSnapshot.size} users.`);
    const assignmentPromises = [];
    usersSnapshot.forEach(userDoc => {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const currentActiveChallenge = userData.activeChallenge;
        const challengeHistory = userData.challengeHistory || [];
        // Assign if user has no active challenge OR if the active one is somehow stale (optional logic)
        if (!currentActiveChallenge) {
            console.log(`User ${userId} needs a new challenge.`);
            // --- Basic Challenge Selection Logic ---
            // Filter out challenges recently completed or skipped (e.g., last 5)
            const recentHistoryIds = challengeHistory.slice(-5).map(h => h.challengeId);
            const eligibleChallenges = allActiveDefinitions.filter(def => !recentHistoryIds.includes(def.id));
            if (eligibleChallenges.length === 0) {
                console.warn(`User ${userId} has completed/skipped all recent eligible challenges. Assigning from full active list.`);
                // Fallback: assign any active challenge if all eligibles were recent
                if (allActiveDefinitions.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allActiveDefinitions.length);
                    const selectedChallenge = allActiveDefinitions[randomIndex];
                    assignmentPromises.push(assignChallengeToUser(userId, selectedChallenge));
                }
                else {
                    console.error("Cannot assign fallback challenge, no active challenges exist.");
                }
            }
            else {
                const randomIndex = Math.floor(Math.random() * eligibleChallenges.length);
                const selectedChallenge = eligibleChallenges[randomIndex];
                assignmentPromises.push(assignChallengeToUser(userId, selectedChallenge));
            }
            // --- End Selection Logic ---
        }
        else {
            console.log(`User ${userId} already has an active challenge: ${currentActiveChallenge.challengeId}`);
        }
    });
    await Promise.all(assignmentPromises);
    console.log("Finished weekly challenge assignment process.");
});
// Helper function to update user document
async function assignChallengeToUser(userId, challengeDef) {
    const userRef = db.collection('users').doc(userId);
    // Determine goal based on criteria type
    let goal = 1; // Default goal
    if (challengeDef.criteria) {
        if (challengeDef.criteria.type === 'sendMessageToMultiple' && typeof challengeDef.criteria.value === 'number') {
            goal = challengeDef.criteria.value;
        }
        // Add other criteria types that might set a numeric goal
    }
    const newActiveChallenge = {
        challengeId: challengeDef.id,
        progress: 0,
        goal: goal,
        assignedDate: admin.firestore.Timestamp.now(),
        status: 'active',
        rewardXP: challengeDef.rewardXP || 0,
        rewardUnlock: challengeDef.rewardUnlock || null, // Ensure default
    };
    try {
        await userRef.update({ activeChallenge: newActiveChallenge });
        console.log(`Assigned challenge ${challengeDef.id} to user ${userId}. Goal: ${goal}`);
    }
    catch (error) {
        console.error(`Failed to assign challenge ${challengeDef.id} to user ${userId}:`, error);
    }
}
//# sourceMappingURL=challengeAssignment.js.map