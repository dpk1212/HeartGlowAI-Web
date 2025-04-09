# 🛠️ MVP Launch Plan for HeartGlowAI

## ✅ What You Already Have
- ✅ Web app hosted on GitHub
- ✅ OpenAI API integration (GPT-4)
- ✅ Firebase for authentication and data storage
- ✅ Working message generation flow

## 🎯 MVP Objective
Build a lean, high-impact product that:
- Solves the core pain point: "I want to say something meaningful, but I don't know how."
- Delivers emotional value quickly
- Captures users, gets real usage, and is ready to monetize through add-ons

## 🔑 MVP Core Feature Set
| Feature | Why It Matters |
|---------|----------------|
| Message Generator (intent + tone + recipient context) | Your foundational feature, already built |
| Save & Name Recipients ("Connections") | Enables repeat use and continuity |
| Quick Start Templates (5–10 use cases) | Lowers friction to generate first message |
| Message Output + Key Insights | Adds unique value, helps user understand the message's impact |
| Copy / Share / Save Message | Drives viral use and word-of-mouth |
| Basic Auth + Usage Tracking | Collect user data and support freemium usage |

## 🚦 MVP Scope Prioritization (v0.1)
| Priority | Feature | Notes |
|----------|---------|-------|
| 🟢 Must-Have | Intent → Tone → Recipient → Message → Insights | Core workflow |
| 🟢 Must-Have | Save recipient & message to Firebase | Repeat use starts here |
| 🟡 Should-Have | "Quick Templates" UI (Reconnect, Apologize, etc.) | Optional fast path to boost conversions |
| 🟡 Should-Have | Share/copy message to SMS, email, WhatsApp | Easy virality loop |
| 🔵 Nice-to-Have | Anonymous "Feel This For Me" delivery flow | Could be v0.2 — use same backend |
| 🔵 Nice-to-Have | Dashboard showing past messages | Improves stickiness — could come later |

## 🧱 MVP Backend + Data Plan
| Firebase Collection | Purpose |
|--------------------|---------|
| users | User metadata (UID, email, plan, etc.) |
| connections | Saved recipients: name, relationship, notes |
| messages | Generated messages: timestamp, inputs, outputs |
| templates | Pre-set Quick Start template metadata |
| settings | Default tones, context categories, formats, etc. |

## 📐 MVP UI/UX Journey
### Landing Page
- Hook headline: "Say what matters — with words that feel just right."
- CTA → Start a message → takes user to auth/generation

### Message Flow (Guided Form)
- Step 1: Who's this message for?
- Step 2: What's the purpose?
- Step 3: Choose the tone
- Step 4: Generate Message + Show 3 Key Insights
- Step 5: Copy / Share / Save

### Dashboard/Home
- CTA: "Send another message"
- "Quick Templates" carousel
- Past messages
- Connections list

## 💵 Monetization (Light MVP Approach)
| Tier | Features |
|------|----------|
| Free | 3–5 free messages/month, save 3 connections |
| Premium ($7–10/month) | Unlimited messages, tone packs, priority delivery, unlock "Feel This For Me" gifting |
| One-off | $2.99–$4.99 per premium message or custom template use |

## 🗓️ MVP Sprint Plan
| Week | Tasks |
|------|-------|
| Week 1 | Refine UX flows (guided inputs), build "Quick Template" interface |
| Week 2 | Add Firebase collections: connections, messages + save logic |
| Week 3 | Build results screen: show message + insights, copy/share/save |
| Week 4 | Deploy homepage, auth, onboarding flow, light dashboard |
| Week 5 | Test + soft launch to early users for feedback |
| Week 6 | Polish, optimize UI for mobile, prep for launch + Stripe integration |

## 🧪 Metrics to Track from Day One
- % of users who complete message generation
- Messages per user (daily/weekly)
- Which Quick Templates get used most
- Shared messages (copied/shared)
- Upgrade conversion (if any monetization included)

## 🚀 Launch Channels
- Personal LinkedIn and Reddit launch (emotional problem stories do well)
- "Show HN" / Product Hunt MVP drop
- Reach out to relationship coaches, therapists, creators to co-promote
- Short video demos on TikTok/Reels ("This AI helps you say what matters")
- SEO blog posts: "What to say when you don't know how," etc.

## ✅ Next Step
Would you like me to:
- Draft the Firebase schema & collections for dev setup?
- Design a lightweight UI wireframe for the MVP message flow?
- Write the first Quick Template content (Reconnect, Thank You, Apologize, etc.)?

Just say the word, and we'll start sprinting. 