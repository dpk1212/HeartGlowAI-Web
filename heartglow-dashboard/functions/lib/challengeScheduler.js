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
exports.assignWeeklyChallenge = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK (ensure this is done only once, typically at the top level)
try {
    admin.initializeApp();
}
catch (e) {
    console.log("Admin SDK already initialized or initialization failed.");
}
const db = admin.firestore();
// TODO: Adjust schedule as needed (e.g., timezone)
// Runs every Monday at 3:00 AM UTC (adjust timezone in Cloud Scheduler UI if needed)
exports.assignWeeklyChallenge = functions.pubsub.schedule('0 3 * * 1')
    .timeZone('Etc/UTC') // Explicitly set Timezone
    .onRun(async (context) => {
    console.log('Running weekly challenge assignment...');
    // TODO: Get reference to Firestore
    // const db = admin.firestore();
    try {
        const usersSnapshot = await db.collection('users')
            // Query for users needing a challenge (e.g., no active challenge object, or status != 'active')
            // This query might need adjustment based on how you clear completed/skipped challenges
            // A more robust approach might query all active users and check the condition in the loop
            .get();
        if (usersSnapshot.empty) {
            console.log("No users to process for challenges.");
            return null;
        }
        const challengesSnapshot = await db.collection('challenges')
            .where('isActive', '==', true)
            .get();
        if (challengesSnapshot.empty) {
            console.error("No active challenges found!");
            return null;
        }
        // Use the defined type when mapping
        const allChallenges = challengesSnapshot.docs.map(doc => {
            return Object.assign({ id: doc.id }, doc.data()); // Assert the type of doc.data()
        });
        const batch = db.batch();
        let assignedCount = 0;
        const now = admin.firestore.Timestamp.now(); // Get current timestamp once
        usersSnapshot.forEach(userDoc => {
            var _a, _b, _c, _d;
            const userId = userDoc.id;
            const userData = userDoc.data();
            // Check if user needs a new challenge
            if (userData.activeChallenge && userData.activeChallenge.status === 'active') {
                // Optional: Check if the active challenge has expired (e.g., > 7 days old)
                // const assignedDate = userData.activeChallenge.assignedDate.toDate();
                // const daysSinceAssigned = (now.toMillis() - assignedDate.getTime()) / (1000 * 60 * 60 * 24);
                // if (daysSinceAssigned < 7) {
                return; // Skip user, still has an active challenge
                // }
                // Optionally mark expired challenge in history here
            }
            // Filter challenges based on user's recent history (e.g., last 5 challenges)
            const recentHistoryIds = (userData.challengeHistory || [])
                .slice(-5) // Look at last 5 entries
                .map((h) => h.challengeId);
            let availableChallenges = allChallenges.filter(c => !recentHistoryIds.includes(c.id));
            let selectedChallenge;
            if (availableChallenges.length === 0) {
                console.warn(`No suitable *new* challenges found for user ${userId}, reusing from all active.`);
                if (allChallenges.length === 0)
                    return; // Really no challenges available
                availableChallenges = allChallenges; // Use all as fallback pool
            }
            // Select a random challenge from the determined pool
            selectedChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
            // Now accessing properties should be type-safe
            const goal = (_b = (_a = selectedChallenge.criteria) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 1;
            const rewardXP = (_c = selectedChallenge.rewardXP) !== null && _c !== void 0 ? _c : 0;
            const rewardUnlock = (_d = selectedChallenge.rewardUnlock) !== null && _d !== void 0 ? _d : null;
            const newActiveChallenge = {
                challengeId: selectedChallenge.id,
                progress: 0,
                goal: goal,
                assignedDate: now,
                status: 'active',
                rewardXP: rewardXP,
                rewardUnlock: rewardUnlock
            };
            const userRef = db.collection('users').doc(userId);
            // Update challenge AND reset weekly metrics
            batch.update(userRef, {
                activeChallenge: newActiveChallenge,
                'metrics.weeklyMessageCount': 0,
                'metrics.uniqueConnectionsMessagedWeekly': [] // Reset weekly connections
            });
            assignedCount++;
        });
        await batch.commit();
        console.log(`Assigned new challenges to ${assignedCount} users.`);
    }
    catch (error) {
        console.error("Error assigning weekly challenges:", error);
        // Consider adding alerting or more robust error handling
    }
    console.log('Weekly challenge assignment finished.');
    return null; // Indicate successful completion
});
// Add other potential challenge-related scheduled functions if needed. 
//# sourceMappingURL=challengeScheduler.js.map