# HeartGlow V2 Refactor Plan (Simplified - Adapt Existing Coaching)

**Goal:** Provide a unified chat experience focused **exclusively on AI coaching**, leveraging the existing `coachingThreads` Firestore structure and the `coachingAssistant` Cloud Function. Message generation features are removed from scope for this iteration.

**Starting Point:** Commit `a979132` (clean state). Branch: `feature/v2-refactor`.

---

**Plan:**

1.  **Verify Backend (`coachingAssistant`):**
    *   Confirm the existing `coachingAssistant` function (HTTPS onCall) correctly uses the `coachingThreads/{threadId}/messages` structure for history and responses. (Verified based on provided code).
    *   Ensure the AI prompt within `coachingAssistant` is solely focused on coaching. (Verified based on provided code).
    *   Ensure required API keys/environment variables are configured for deployment. (User confirmed this previously).

2.  **Verify Frontend (`components/coaching`, `pages/coaching`):**
    *   Confirm `CoachingDashboard.tsx` correctly lists `coachingThreads` and links to `/coaching/[threadId]`. (Verified).
    *   Confirm `CoachingChatView.tsx` correctly displays messages from the `messages` subcollection and calls the `coachingAssistant` function on message send. (Verified).
    *   Review UI for any potentially confusing references to "message generation" or "modes" and remove if necessary.

3.  **Review Types (`coaching.ts`):**
    *   Confirm `CoachingThread` and `ThreadMessage` types accurately reflect the data structure used. (Verified).

4.  **Testing:**
    *   Perform end-to-end testing of the coaching chat flow: viewing threads, sending messages, receiving AI responses.

5.  **Commit & Push:**
    *   Commit this plan document (`HeartGlowV2.md`) and any minor frontend cleanup.
    *   Push the `feature/v2-refactor` branch.

--- 