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
exports.skipChallenge = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK (ensure this is done only once)
try {
    admin.initializeApp();
}
catch (e) { /* Ignored */ }
const db = admin.firestore();
exports.skipChallenge = functions.https.onCall(async (data, context) => {
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
                activeChallenge: null,
                challengeHistory: updatedChallengeHistory
            });
        });
        console.log(`Successfully skipped challenge for user ${userId}`);
        return { status: 'success', message: 'Challenge skipped successfully.' };
    }
    catch (error) {
        console.error(`Error skipping challenge for user ${userId}:`, error);
        if (error instanceof functions.https.HttpsError) {
            throw error; // Re-throw HttpsError
        }
        throw new functions.https.HttpsError('internal', 'Failed to skip challenge.', error.message);
    }
});
//# sourceMappingURL=challengeActions.js.map