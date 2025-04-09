# HeartGlowAI Developer Implementation Guide - Post-Login Homepage (Desktop MVP)

## 📘 Overview

This guide provides a comprehensive breakdown of the HeartGlowAI post-login homepage, optimized for desktop. The goal is to help users immediately understand the app's purpose, start creating meaningful messages, and feel emotionally supported. This is the user's first experience after logging in and is core to the MVP.

## 🔎 Page Purpose

Create a warm, emotionally inviting dashboard where users can:

- Start a new message immediately
- Browse and use pre-built emotional templates
- Choose a saved recipient (Connection)
- Review past messages
- Build anticipation for what's next ("Feel This For Me")

**Emotional Objective:**
Users should feel calm, capable, and connected within the first 5 seconds. Everything should encourage emotional expression without pressure or confusion.

## 🧭 User Flow Summary (Post-Login)

1. User logs in → lands on this homepage
2. They are immediately drawn to CTA or a template
3. Optionally select a saved recipient
4. Redirected to /create with pre-filled values
5. Message generation process begins

This homepage must prioritize speed to first emotional win. Get users into the generator in 1–2 clicks.

## 🧱 Component & Layout Responsibilities

Each section must be implemented as a modular component:

- Header
- HeroSection
- QuickTemplateGrid
- ConnectionsCarousel
- RecentMessagesList
- ComingSoonCard
- FooterNav

Each component should:

- Accept props for content/state
- Be styled using utility-first classes (Tailwind recommended)
- Be accessible, mobile-ready (even if not optimized)

## 💾 Data Fetching Notes

On homepage load:

- Fetch user's connections from /connections
- Fetch recent messages from /messages (limit 3)
- Fetch templates from /templates or local constant config

Firebase rules should ensure:

- /connections are scoped to UID
- /messages contain UID + timestamp

## 🔄 Routing and Navigation Logic

| Action | Destination |
|--------|-------------|
| Start New Message | /create |
| Quick Template Card | /create?intent=gratitude&tone=sincere |
| Saved Connection | /create?recipient=abc123 |
| Reuse Message | /create?messageId=xyz789 |

Use React Router or similar to pass these parameters.

## 🪄 Animations and Transitions

| Element | Interaction |
|---------|-------------|
| Hero Button | Pulse on hover, soft ripple on click |
| Template Cards | Fade-in stagger on load, lift + glow on hover |
| Connections | Slide in from right on first scroll into view |
| Add Modal | Fade + scale (zoom in on open) |
| Coming Soon | Gradient pulse or shimmer background (optional) |

Use Framer Motion or lightweight transition utilities.

## 🧪 Edge Cases to Handle

- No saved connections → show message: "No saved people yet — add someone special."
- No past messages → hide the section or show: "You haven't sent anything yet — now's a great time."
- No template data → fallback to hardcoded 6 cards

## 🧠 Accessibility & Inclusivity Guidelines

- All buttons must have aria-label
- All cards should be reachable by keyboard (tab navigation)
- High color contrast for key text/button areas
- Use emoji meaningfully, not decoratively
- Headings must follow semantic order (H1 > H2 > H3)

## 🔐 Auth & Security Notes

- Page only accessible post-auth
- Use Firebase Auth or NextAuth middleware to enforce session
- Auth failure = redirect to /login

## 🧰 Dev Tools & Suggestions

- Framework: React (Next.js preferred)
- Styling: Tailwind CSS, optionally extend with Radix UI
- Animations: Framer Motion (modular + lightweight)
- Icons: Lucide or Heroicons
- Deployment: Vercel, Netlify, or Firebase Hosting

## ✅ Deliverables Checklist for Dev/Design

- [ ] Component wireframes completed
- [ ] Responsive breakpoints defined
- [ ] Component states designed (hover, focus, active)
- [ ] Data fetching patterns established
- [ ] Template card content finalized
- [ ] Connection profile data structure defined
- [ ] Route parameters validated with backend
- [ ] Animation prototype approved

---

This page is your emotion engine — it's what gets users to feel and act. Everything built here should serve clarity, warmth, and immediate value.

Next: Let's move to /create — the Message Generator Flow. 