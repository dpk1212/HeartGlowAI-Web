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
exports.onMessageCreatedUpdateProgress = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK
try {
    admin.initializeApp();
}
catch (e) { /* Ignored */ }
const db = admin.firestore();
// --- Constants ---
const XP_PER_MESSAGE = 5; // Example base XP
const STREAK_RESET_HOURS = 36; // How many hours without message breaks streak
const TIER_THRESHOLDS = [
    { name: '🌱 Opening Up', minXP: 0 },
    { name: '🌟 Making Moves', minXP: 51 },
    { name: '🔥 Communicator in Bloom', minXP: 151 },
    { name: '💫 HeartGuide', minXP: 301 },
    { name: '🕊 Legacy Builder', minXP: 501 },
];
// --- Firestore Trigger: onMessageCreated ---
exports.onMessageCreatedUpdateProgress = functions.firestore
    .document('messages/{messageId}')
    .onCreate(async (snap, context) => {
    const messageData = snap.data();
    const userId = messageData.userId;
    const messageTimestamp = messageData.createdAt;
    if (!userId) {
        console.error("Message missing userId:", snap.id);
        return;
    }
    const userRef = db.collection('users').doc(userId);
    try {
        await db.runTransaction(async (transaction) => {
            var _a, _b;
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                console.error(`User document not found for userId: ${userId}`);
                return;
            }
            const userData = userDoc.data();
            const updateData = {};
            let awardedXP = XP_PER_MESSAGE;
            // --- Update Basic Metrics ---
            updateData.totalMessageCount = admin.firestore.FieldValue.increment(1);
            if (!updateData.metrics)
                updateData.metrics = {};
            updateData.metrics.weeklyMessageCount = admin.firestore.FieldValue.increment(1);
            updateData.lastMessageTimestamp = messageTimestamp;
            // --- Update Streak ---
            let newStreak = userData.currentStreak || 0;
            if (userData.lastMessageTimestamp) {
                const lastMsgDate = userData.lastMessageTimestamp.toDate();
                const currentMsgDate = messageTimestamp.toDate();
                const hoursDiff = (currentMsgDate.getTime() - lastMsgDate.getTime()) / (1000 * 60 * 60);
                if (hoursDiff <= STREAK_RESET_HOURS) {
                    // Check if it's a new day (consider timezone, simple check for now)
                    if (currentMsgDate.toDateString() !== lastMsgDate.toDateString()) {
                        newStreak++;
                    }
                }
                else {
                    newStreak = 1; // Reset streak
                }
            }
            else {
                newStreak = 1; // First message starts streak
            }
            updateData.currentStreak = newStreak;
            // --- Check Active Challenge ---
            const activeChallenge = userData.activeChallenge;
            if (activeChallenge && activeChallenge.status === 'active') {
                // Fetch challenge definition (cached read might be better in high traffic)
                const challengeDefDoc = await db.collection('challenges').doc(activeChallenge.challengeId).get();
                if (challengeDefDoc.exists) {
                    const challengeDef = Object.assign({ id: challengeDefDoc.id }, challengeDefDoc.data());
                    // Basic criteria check (expand as needed)
                    let criteriaMet = false;
                    if (((_a = challengeDef.criteria) === null || _a === void 0 ? void 0 : _a.type) === 'sendMessage' || ((_b = challengeDef.criteria) === null || _b === void 0 ? void 0 : _b.type) === 'sendMessageToMultiple') {
                        // For now, assume any message progresses these types
                        criteriaMet = true;
                        // TODO: Add more specific checks based on criteria.value (e.g., recipient type, tone)
                    }
                    if (criteriaMet) {
                        const newProgress = (activeChallenge.progress || 0) + 1;
                        if (newProgress >= activeChallenge.goal) {
                            // CHALLENGE COMPLETED!
                            console.log(`User ${userId} completed challenge ${activeChallenge.challengeId}`);
                            awardedXP += activeChallenge.rewardXP || 0;
                            // Add to history
                            const historyEntry = {
                                challengeId: activeChallenge.challengeId,
                                status: 'completed',
                                assignedDate: activeChallenge.assignedDate,
                                completedDate: messageTimestamp
                            };
                            updateData.challengeHistory = admin.firestore.FieldValue.arrayUnion(historyEntry);
                            // Clear active challenge
                            updateData.activeChallenge = null;
                            // Handle unlocks (basic example)
                            if (activeChallenge.rewardUnlock) {
                                updateData.unlockedFeatures = admin.firestore.FieldValue.arrayUnion(activeChallenge.rewardUnlock);
                            }
                        }
                        else {
                            // Update progress within active challenge
                            updateData.activeChallenge = Object.assign(Object.assign({}, activeChallenge), { progress: newProgress });
                        }
                    }
                }
                else {
                    console.warn(`Challenge definition ${activeChallenge.challengeId} not found for active challenge.`);
                }
            }
            // --- Update Glow Score XP & Tier ---
            const currentXP = userData.glowScoreXP || 0;
            const newXP = currentXP + awardedXP;
            updateData.glowScoreXP = newXP;
            let newTier = userData.glowScoreTier || TIER_THRESHOLDS[0].name;
            for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
                if (newXP >= TIER_THRESHOLDS[i].minXP) {
                    newTier = TIER_THRESHOLDS[i].name;
                    break;
                }
            }
            if (newTier !== userData.glowScoreTier) {
                console.log(`User ${userId} tier updated to ${newTier}`);
                updateData.glowScoreTier = newTier;
                // TODO: Trigger notification or event for tier update?
            }
            // --- Atomically update the user document --- 
            console.log(`Updating user ${userId} with:`, updateData);
            transaction.update(userRef, updateData);
        });
    }
    catch (error) {
        console.error(`Error updating progress for user ${userId} on message ${snap.id}:`, error);
    }
});
//# sourceMappingURL=progressTracking.js.map