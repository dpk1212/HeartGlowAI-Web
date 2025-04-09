# HeartGlowAI Developer Implementation Guide - Message Generator Flow (/create)

📖 Overview

This guide outlines the full implementation plan for the HeartGlowAI Message Generator page, located at /create. This screen is the core value delivery engine of the product. It enables users to create emotionally resonant, AI-generated messages through a guided process that adapts to both personal and professional use cases.

🔎 Page Purpose

To guide users through a simple, emotionally intelligent message creation experience:

Collect recipient and relationship context

Clarify the message's intent and tone

Generate a heartfelt message

Present it alongside key emotional insights

Emotional Objective:
Make the process of saying something meaningful feel intuitive, human, and rewarding. Users should feel like they're being emotionally coached, not filling out a form.

👥 Target Users

People who struggle with expressing something emotionally important

Managers/team leads needing help with feedback

Children or adults sending messages to parents, grandparents, friends, or exes

👁️ User Flow Summary

User lands on /create (from homepage CTA or pre-filled template)

User is guided step-by-step:

Step 1: Recipient & Relationship

Step 2: Message Intent

Step 3: Tone Selection

Step 4: (Optional) Context, Format, Variation

Submits → message is generated via OpenAI

Output: message + 3 emotional insights

Copy, save, or share message

🔹 Layout Format

Use a card-based vertical wizard layout with animated transitions between each step.

Desktop Layout

Centered container (max width: 700px)

Vertical stepper or progress indicator (top or left aligned)

One screen/section per step

Next/back buttons at bottom

Final result screen has CTA buttons (copy/share/save)

Recommended Library

React + Framer Motion for transitions

Tailwind for styling

Optional: React Hook Form or Zod for validation

🔌 Input Fields and Components

Step 1: Recipient & Relationship

Text input: recipient.name (placeholder: "First name")

Radio group: recipient.relationship

Options: Partner, Friend, Family, Colleague, Acquaintance, Other

Conditional input: recipient.customRelationship (shown if "Other" is selected)

Step 2: Message Intent

Template card selection (like homepage)

Card = emoji + 1-line statement (e.g., 🙏 "I want to say thank you")

Fallback option: Custom intent text input (textarea for custom description)

Step 3: Tone Selection

Tone card group (soft pill style)

Options: Warm, Casual, Sincere, Playful, Formal, Reflective

Optional input: Custom tone (if "Other")

Step 4: (Advanced/Optional Fields)

These can be toggled open under a "Customize Further" link:

Dropdown: format (Text message, Email, Greeting card, Conversation Starter)

Text input: recipient.personalNotes

Text input: context (Free-form background info)

Dropdown: variation (More poetic, More direct, More humorous, etc.)

🌟 Message Output Section

Once message is generated:

Display Layout:

Centered message card (max width: 700px)

Message content styled in natural, readable formatting

Divider line

Section: "Why this message works:"

List of 3 bullet-point insights from GPT (styled as checkmarks or quotes)

CTA Buttons:

Primary: Copy message

Secondary: Save to history

Tertiary: Share (popup with copy/email/embed)

🔍 UX/UI Best Practices

Principle | Implementation
--------- | --------------
Emotion-first language | Labels, prompts, and placeholders should feel like coaching, not forms
Visual clarity | White space, minimal fields per screen
Mobile-first ready | Stack sections, swipe transitions (next phase)
Accessibility | Use semantic HTML, aria-labels, keyboard-friendly stepper
Delight | Microinteractions (e.g., message "typing" animation on load)

💪 Developer Notes

Step transitions: use Framer Motion slide/fade between cards

Controlled form state: use React state or React Hook Form

Pre-filling: accept /create?intent=...&tone=...&recipient=... from homepage

API call: POST to /generateMessageV2 (authenticated)

Save result to /messages collection in Firebase

✅ Deliverables Checklist for Dev/Design



Once built, this screen should feel like a personal assistant + emotional coach — lightweight, caring, and human.

Next: Let's define /connections (add/edit saved people flow). 