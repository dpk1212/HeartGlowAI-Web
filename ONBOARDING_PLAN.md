# HeartGlow AI Onboarding Plan

**Version:** 1.0
**Date:** 2024-07-26

## I. Onboarding Goals

1.  **Immediate Value Demonstration:** Show the user the core magic (AI message generation) within the first 60-90 seconds.
2.  **Introduce Core Concepts:** Briefly explain *what* HeartGlow AI does (helps craft messages, provides coaching) and *why* it's useful (stronger connections).
3.  **Guided First Success:** Ensure the user successfully generates their first message draft.
4.  **Introduce GlowGuide:** Position the GlowGuide as a helpful companion for tips and deeper understanding, accessible from the start.
5.  **Smooth Transition:** Seamlessly guide the user from the onboarding flow into the main application features (dashboard, full message creation, connections, coaching).
6.  **Reduce Friction:** Minimize upfront information requests and required actions before delivering value.

## II. Onboarding Principles

*   **Progressive Disclosure:** Introduce features one by one, starting with the most impactful.
*   **Action-Oriented:** Get the user *doing* something valuable, not just reading.
*   **Context is Key:** Introduce features (like coaching or connections) when they become relevant to the user's actions.
*   **Minimalism:** Keep UI and text clean, focused, and concise.
*   **Visual Guidance:** Use clear visual hierarchy, CTAs, and potentially subtle animations.
*   **Persistent Support:** Make the GlowGuide easily accessible throughout.

## III. Proposed Onboarding Flow (Step-by-Step)

This flow triggers for new users (detected via a `userProfile.hasCompletedOnboarding` flag) immediately after login/signup, *before* showing the main dashboard.

**(A) GlowGuide Introduction (Persistent Element)**

*   **Concept:** A persistent, non-intrusive icon (e.g., a subtle spark ✨, lightbulb 💡, or the HeartGlow logo) fixed in a screen corner (e.g., bottom-right).
*   **Interaction:** Clicking it opens a sidebar or modal containing contextual tips, short tutorials, links to help docs, or quick actions.
*   **Timing:** Appears immediately upon starting onboarding and stays throughout the app experience. Might pulse gently or have a small badge ("?") initially.

**(B) The Onboarding Steps (Modal or Full-Screen Sequence)**

**Step 1: Welcome & Core Value**

*   **Design:** Clean, focused screen/modal. Brand colors, welcoming illustration/animation. Prominent logo.
*   **Content:**
    *   Headline: "Welcome to HeartGlow AI! ✨"
    *   Body: "Effortlessly express yourself and build stronger connections. Let's craft your first message in seconds."
    *   GlowGuide Hint: (Optional) Point an arrow/indicator towards the GlowGuide icon: "Need help? Click the GlowGuide anytime!"
*   **CTA:** "Get Started" (Button)

**Step 2: Guided Message Generation - Minimal Input**

*   **Design:** Simplified form, visually distinct from the full `/create` page. Focus on input fields.
*   **Content:**
    *   Headline: "Who is this message for?"
    *   Input 1: Text Field (Placeholder: "e.g., Friend, Mom, Partner, Colleague") - *Does NOT require creating a formal Connection yet.*
    *   Headline: "What's the main goal?"
    *   Input 2: Simple Selection (Radio buttons or styled pills) with 3-4 core intents (e.g., "Just Checking In 👋", "Say Thanks 🙏", "Offer Support ❤️", "Celebrate Good News 🎉").
    *   *Note:* Use sensible defaults for tone, format, length behind the scenes.
*   **CTA:** "Draft my Message" (Button) - *Triggers `generateMessage`.*

**Step 3: The "Aha!" Moment - Message Reveal & GlowGuide Reinforcement**

*   **Design:** Display generated message prominently. Clear visual separation. Subtle loading animation.
*   **Content:**
    *   Headline: "Here's your first draft!"
    *   Generated Message: Displayed in a read-only/editable text area.
    *   Body: "Our AI crafted this based on your input. Feel free to edit it, or let's continue."
    *   GlowGuide Contextual Tip: (Below message or via GlowGuide icon pulse) "💡 Tip: You can refine the tone or length later using the full editor."
*   **CTA 1 (Primary):** "Continue" (Button)
*   **CTA 2 (Secondary):** "Try Again" (Link/Button - reruns Step 2)

**Step 4: Introduce Coaching (Briefly)**

*   **Design:** Simple info card/section. Coaching icon.
*   **Content:**
    *   Headline: "Need More Guidance?"
    *   Body: "Beyond single messages, our AI Coach can help you navigate conversations and communication challenges. We'll show you where to find it later."
*   **CTA:** "Got It" (Button)

**Step 5: Next Steps & Bridge to App**

*   **Design:** Transition screen with clear choices (cards or large buttons).
*   **Content:**
    *   Headline: "You're Ready to Glow! What's next?"
    *   Options:
        *   **Option 1 (Recommended):** "Add Your First Connection" -> Simplified connection form.
        *   **Option 2:** "Explore Your Dashboard" -> Closes onboarding, shows main dashboard (maybe with tooltips).
        *   **Option 3:** "Craft Another Message (Full Editor)" -> `/create` page.
        *   **Option 4:** (Maybe) "Learn More with GlowGuide" -> Opens GlowGuide.
*   **Note:** Completing Options 1, 2, or 3 should set `hasCompletedOnboarding` flag.

## IV. GlowGuide Content & Design

*   **Design:** Sidebar (sliding) or Modal overlay. Tabs? Search?
*   **Content Strategy:**
    *   **Contextual Tips:** Based on current page/task.
    *   **Quick Start Guides:** Visual tutorials for key features.
    *   **Communication Principles:** Short articles/snippets.
    *   **Template Library Access:** Quick links.
    *   **FAQ/Search:** Searchable knowledge base.

## V. Implementation Plan Outline

1.  **User Profile Update:** Add `hasCompletedOnboarding: boolean` (default: `false`) to Firestore user profile.
2.  **Create Onboarding Component Wrapper:** Checks flag, renders onboarding flow or main app.
3.  **Build Onboarding Step Components:** Create specific React components for each onboarding step.
4.  **Develop GlowGuide Component:** Build persistent button and panel. Populate content. Implement contextual logic.
5.  **Simplify Existing Components:** (Recommended) Add "onboarding" mode props to relevant creation/output components.
6.  **Backend Integration:** Ensure `generateMessage` works with minimal input. Update profile on completion.
7.  **Routing/State Management:** Manage onboarding step state and navigation.
8.  **Analytics:** Track step completion, drop-off, GlowGuide usage.
9.  **Testing & Iteration:** User test, analyze data, refine. 