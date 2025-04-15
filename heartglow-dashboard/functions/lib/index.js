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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipCurrentChallenge = void 0;
const functions = __importStar(require("firebase-functions")); // Add import
const admin = __importStar(require("firebase-admin")); // Add import
const cors = require("cors"); // Use require-style import for cors
// Initialize Firebase Admin SDK (ensure this is done only once) - Add this
try {
    admin.initializeApp();
}
catch (e) { /* Ignored */ }
const db = admin.firestore(); // Add this
// Configure CORS options
// IMPORTANT: Restrict this to your actual frontend domain in production!
const corsHandler = cors({ origin: true }); // Allows all origins for now, refine later
// Import and re-export functions from their respective files
// Export Challenge Scheduler function(s)
__exportStar(require("./challengeScheduler"), exports);
// Export Progress Updater function(s)
__exportStar(require("./progressUpdater"), exports);
// Export Challenge Assignment function(s)
__exportStar(require("./challengeAssignment"), exports);
// Export Progress Tracking function(s)
// export * from './progressTracking'; // Removed this line
// Export Challenge Selection function(s)
__exportStar(require("./challengeSelection"), exports);
// --- Removed explicit import/export for challengeActions ---
// import { skipChallenge } from './challengeActions';
// export { skipChallenge };
// --- Define skipCurrentChallenge as an onRequest function ---
exports.skipCurrentChallenge = functions.https.onRequest((req, res) => {
    // Wrap the function logic with the CORS handler
    corsHandler(req, res, async () => {
        // --- Authentication ---
        // For onRequest, you need to manually verify the user.
        // Typically, the frontend sends the Firebase ID token in the Authorization header.
        // Example: const idToken = req.headers.authorization?.split('Bearer ')[1];
        // You would then verify this token using admin.auth().verifyIdToken(idToken)
        // For now, we'll *assume* authentication is handled and get userId (replace with real verification)
        let userId = null;
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
        }
        catch (error) {
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
            res.status(200).send({ status: 'skipped', message: 'Challenge skipped successfully.' });
        }
        catch (error) {
            // Handle specific errors thrown from transaction
            if (error.message === 'User not found.') {
                res.status(404).send('User not found.');
            }
            else if (error.message === 'NO_ACTIVE_CHALLENGE') {
                res.status(200).send({ status: 'success', message: 'No active challenge to skip.' });
            }
            else {
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
//# sourceMappingURL=index.js.map