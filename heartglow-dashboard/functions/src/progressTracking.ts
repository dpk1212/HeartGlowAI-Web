import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
try {
  admin.initializeApp();
} catch (e) { /* Ignored */ }
const db = admin.firestore();

// --- Types (Consider centralizing these) ---
type ChallengeCriteria = { type: string; value: number | string; description?: string; };
type ChallengeDefinition = { id: string; name: string; description: string; criteria: ChallengeCriteria; rewardXP: number; rewardUnlock?: string | null; isActive?: boolean; };
type ActiveChallenge = { challengeId: string; progress: number; goal: number; assignedDate: admin.firestore.Timestamp; status: 'active'; rewardXP: number; rewardUnlock: string | null; };
type ChallengeHistoryEntry = { challengeId: string; status: 'completed' | 'skipped'; assignedDate: admin.firestore.Timestamp; completedDate?: admin.firestore.Timestamp | null; };
type UserProfile = { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null; lastLogin?: any; totalMessageCount?: number; glowScoreXP?: number; glowScoreTier?: string; currentStreak?: number; lastMessageTimestamp?: any | null; activeChallenge?: ActiveChallenge | null; challengeHistory?: Array<ChallengeHistoryEntry>; metrics?: { weeklyMessageCount?: number; uniqueConnectionsMessagedWeekly?: Array<string>; toneCounts?: { [key: string]: number }; reflectionsCompletedCount?: number; }; unlockedFeatures?: string[]; };
// Type for Message data (adjust based on actual structure)
type MessageData = { userId: string; createdAt: admin.firestore.Timestamp; recipientId?: string; // Example field
    // Add other relevant fields like tone, intent, etc. if needed for criteria
};

// Type specifically for update operations, allowing FieldValues
type UserProfileUpdateData = {
    totalMessageCount?: admin.firestore.FieldValue | number;
    lastMessageTimestamp?: admin.firestore.Timestamp;
    currentStreak?: number;
    activeChallenge?: ActiveChallenge | null | admin.firestore.FieldValue; // Allow FieldValue.delete() if needed later
    challengeHistory?: admin.firestore.FieldValue | Array<ChallengeHistoryEntry>; // Allow arrayUnion
    glowScoreXP?: number;
    glowScoreTier?: string;
    unlockedFeatures?: admin.firestore.FieldValue | string[]; // Allow arrayUnion
    metrics?: {
        weeklyMessageCount?: admin.firestore.FieldValue | number;
        uniqueConnectionsMessagedWeekly?: admin.firestore.FieldValue | Array<string>; // Allow arrayUnion
        toneCounts?: { [key: string]: admin.firestore.FieldValue | number }; // Allow increment
        reflectionsCompletedCount?: admin.firestore.FieldValue | number; // Allow increment
    };
    // Add other fields that might use FieldValue
};

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
export const onMessageCreatedUpdateProgress = functions.firestore
    .document('messages/{messageId}')
    .onCreate(async (snap, context) => {
        const messageData = snap.data() as MessageData;
        const userId = messageData.userId;
        const messageTimestamp = messageData.createdAt;

        if (!userId) {
            console.error("Message missing userId:", snap.id);
            return;
        }

        const userRef = db.collection('users').doc(userId);

        try {
            await db.runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists) {
                    console.error(`User document not found for userId: ${userId}`);
                    return;
                }

                const userData = userDoc.data() as UserProfile;
                const updateData: UserProfileUpdateData = {};
                let awardedXP = XP_PER_MESSAGE;

                // --- Update Basic Metrics ---
                updateData.totalMessageCount = admin.firestore.FieldValue.increment(1);
                if (!updateData.metrics) updateData.metrics = {};
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
                    } else {
                        newStreak = 1; // Reset streak
                    }
                } else {
                    newStreak = 1; // First message starts streak
                }
                updateData.currentStreak = newStreak;

                // --- Check Active Challenge ---
                const activeChallenge = userData.activeChallenge;
                if (activeChallenge && activeChallenge.status === 'active') {
                    // Fetch challenge definition (cached read might be better in high traffic)
                    const challengeDefDoc = await db.collection('challenges').doc(activeChallenge.challengeId).get();
                    if (challengeDefDoc.exists) {
                        const challengeDef = { id: challengeDefDoc.id, ...challengeDefDoc.data() } as ChallengeDefinition;

                        // Basic criteria check (expand as needed)
                        let criteriaMet = false;
                        if (challengeDef.criteria?.type === 'sendMessage' || challengeDef.criteria?.type === 'sendMessageToMultiple') {
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
                                const historyEntry: ChallengeHistoryEntry = {
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
                            } else {
                                // Update progress within active challenge
                                updateData.activeChallenge = { ...activeChallenge, progress: newProgress };
                            }
                        }
                    } else {
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
                transaction.update(userRef, updateData as any);
            });
        } catch (error) {
            console.error(`Error updating progress for user ${userId} on message ${snap.id}:`, error);
        }
    }); 