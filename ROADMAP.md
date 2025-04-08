# HeartGlowAI Development Roadmap

This roadmap outlines planned improvements for HeartGlowAI and provides essential information about the codebase to help developers implement these features.

## Table of Contents
1. [Planned Improvements](#planned-improvements)
2. [Codebase Structure](#codebase-structure)
3. [User Journey](#user-journey)
4. [Styling Architecture](#styling-architecture)
5. [Key Functions](#key-functions)
6. [Integration Points](#integration-points)

## Planned Improvements

### 1. Message Templates & Occasion Reminders
**Concept:** Add a smart occasion calendar with automated reminders.
- Create a calendar integration that tracks birthdays, anniversaries, and holidays
- Send reminder notifications before important dates
- Offer pre-configured message templates for common occasions
- Implement a "quick message" feature for returning users

**Implementation Considerations:**
- Add calendar integration to `home.html` and `home.js`
- Create new Firebase collection for reminders/occasions
- Build notification system (could use Firebase Cloud Messaging)
- Develop templates database and selection UI

### 2. Message Effectiveness Feedback Loop
**Concept:** Capture recipient reactions to improve future messages.
- Add a simple "Ask for reaction" option when sharing messages
- Recipients can provide one-click feedback (loved it, touched, etc.)
- Use this data to refine AI generation for that specific relationship
- Show users aggregate stats on how their messages perform

**Implementation Considerations:**
- Create shareable links with unique IDs in `message-result-new.js`
- Build simple reaction landing page
- Add Firebase collection for message reactions
- Modify message generation API to consider past reactions

### 3. Progressive Relationship Profiles
**Concept:** Build increasingly detailed relationship profiles over time.
- Start with minimal info (name, relationship) but gradually collect more context
- After messages, ask one simple question about the recipient
- Use this enriched data for more personalized future messages
- Show users how their relationship profiles are becoming more sophisticated

**Implementation Considerations:**
- Enhance connection schema in Firestore
- Add progressive question UI to post-message flow in `message-result-new.js`
- Update recipient selection to display/use enhanced profile data

### 4. Emotional Message Collections
**Concept:** Create themed message collections users can build over time.
- Introduce concept of "Message Collections" (Love Notes, Appreciation Journal, etc.)
- Allow messages to be saved to multiple collections
- Generate beautiful shareable displays of collections (digital "albums")
- Offer printable/exportable versions for gifts

**Implementation Considerations:**
- Add collections data model to Firestore
- Create collection management UI in home dashboard
- Develop album view with custom styling
- Build export functionality for PDFs/images

### 5. AI Message Coach
**Concept:** Provide personalized communication insights based on usage patterns.
- Analyze user's message history and patterns
- Offer insights about their communication style and emotional tendencies
- Provide tips for more effective emotional expression
- Suggest relationship-specific communication improvements

**Implementation Considerations:**
- Add analytics to track message patterns
- Create insights generation functionality in Cloud Functions
- Build insights dashboard UI
- Develop notification system for new insights

## Codebase Structure

### Key Directories and Files
- **HTML Pages:** Main entry points for each step in the user journey
  - `index.html`: Landing page
  - `login.html`: Authentication
  - `home.html`: User dashboard
  - `recipient-selection-new.html`: Recipient selection
  - `message-intent-new.html`: Intent selection
  - `message-tone-new.html`: Tone selection
  - `message-result-new.html`: Results page

- **JavaScript Files:** Located in `/js` directory
  - `main.js`: Core initialization and Firebase setup
  - `home.js`: Dashboard and connection management
  - `login.js`: Authentication handling
  - `recipient-selection-new.js`: Recipient management
  - `message-intent-new.js`: Intent selection logic
  - `message-tone-new.js`: Tone selection logic
  - `message-result-new.js`: Message generation and display
  - `animation.js`: Animation utilities
  - `message-configurator.js`: Message configuration utilities

- **CSS Files:** Located in `/css` directory
  - Follows architecture detailed in `CSS_ARCHITECTURE.md`
  - Main styles in `main.css` and `styles.css`
  - Component-specific styles in `/css/components/`
  - Page-specific styles in `/css/pages/`

- **Firebase Configuration:**
  - `firebase.json`: Firebase project configuration
  - `firestore.rules`: Security rules for Firestore
  - `functions/`: Cloud Functions directory

## User Journey

The core user journey consists of these sequential steps:

1. **Landing Page (index.html)**
   - Introduction to HeartGlowAI
   - Message type exploration
   - Sign-up/login CTA

2. **Authentication (login.html)**
   - User login/registration
   - Firebase Authentication integration

3. **Dashboard (home.html)**
   - Recent messages
   - Saved connections
   - Quick actions

4. **Recipient Selection (recipient-selection-new.html)**
   - Select existing connection
   - Create new connection
   - Define relationship

5. **Message Intent (message-intent-new.html)**
   - Select purpose of message
   - Optional custom intent

6. **Message Tone (message-tone-new.html)**
   - Select emotional tone
   - Refine message style

7. **Message Result (message-result-new.html)**
   - AI-generated message display
   - Emotional insights
   - Actions (copy, edit, regenerate)

**Data Flow:**
- User selections at each step are stored in localStorage/sessionStorage
- Firebase Firestore stores user data, connections, and message history
- Message generation combines all contextual data via API call

## Styling Architecture

The CSS follows a component-based architecture detailed in `CSS_ARCHITECTURE.md`.

### Key Style Guidelines
- **Color Palette:** Defined in CSS variables in `:root`
  - Primary: `#8a57de` (purple)
  - Secondary: `#ff7eb6` (pink)
  - Background dark: `#1a1625`
  - Text light: `#ffffff`

- **Typography:**
  - Primary font: 'Inter' for UI and body text
  - Display font: 'Playfair Display' for headings

- **Components:**
  - Cards with subtle gradients and hover effects
  - Buttons with transition animations
  - Modal overlays with backdrop blur

- **Animations:**
  - Defined in `animation.js` and CSS
  - Card flips, transitions, pulse effects

## Key Functions

### Authentication
- Firebase Auth implementation in `login.js`
- Auth state observer in multiple files
- User profile management

### Data Storage
- Firestore collections:
  - `users/{userId}/connections`: Saved recipients
  - `users/{userId}/messages`: Message history
  - `users/{userId}/settings`: User preferences

### Message Generation
Main flow in `message-result-new.js`:
1. `initPage()`: Initialize page
2. `loadData()`: Load context from previous steps
3. `generateMessage()`: Make API call for message generation
4. `displayMessage()`: Render message and insights

### State Management
- `localStorage`/`sessionStorage` used extensively
- Key items stored:
  - `recipientData`: Selected recipient information
  - `intentData`: Message intent selection
  - `toneData`: Message tone selection
  - `selectedRecipient`: Formatted recipient info

### Analytics
- Firebase Analytics integration
- Page view tracking in `main.js`
- User journey events

## Integration Points

### Firebase Services
- **Authentication:** User management
- **Firestore:** Data storage
- **Cloud Functions:** Message generation API endpoint
- **Analytics:** Usage tracking

### API Endpoints
- Message generation: `https://us-central1-heartglowai.cloudfunctions.net/generateMessage`
  - Called from `message-result-new.js`
  - Requires authenticated user token
  - Accepts all context parameters

### External Dependencies
- Firebase JS SDK (version 9.22.0)
- Font Awesome (version 6.4.0)
- Google Fonts (Inter, Playfair Display)

---

This roadmap will evolve as development progresses. Each feature should be implemented with mobile-first responsive design and maintain the emotionally-focused UX that defines HeartGlowAI. 