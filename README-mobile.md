# HeartGlowAI Mobile-First Implementation

This repository contains the mobile-first implementation of HeartGlowAI, an emotionally intelligent AI assistant that helps users express their feelings clearly, kindly, and courageously.

## Project Overview

HeartGlowAI guides users through crafting meaningful messages for important relationships using a three-step creation process:

1. **Recipient Selection**: Choose who to write to and set their relationship context
2. **Message Intent**: Select the emotional intent behind your message
3. **Tone Selection**: Personalize the tone and intensity of your message

The final output is an AI-generated heartfelt message that users can copy, edit, save, or regenerate.

## Mobile-First Approach

This implementation follows mobile-first design principles:

- Responsive layouts that adapt to all screen sizes
- Touch-friendly UI elements with appropriate sizing
- Smooth animations optimized for mobile performance
- Proper typography and spacing for mobile readability
- Swipe gestures and mobile-friendly interactions

## Current Implementation

The current implementation includes:

- Complete three-step message creation flow
- Message result page with action buttons
- Recipient selection with relationship types
- Message intent cards with example messages
- Tone selection with intensity slider
- Mobile-friendly animations and transitions
- Loading overlays with visual feedback
- Toast notifications for user actions

## Project Structure

- `home.html` - Main dashboard with message history and compose area
- `recipient-selection.html` - Step 1 of message creation
- `message-intent.html` - Step 2 of message creation
- `message-tone.html` - Step 3 of message creation
- `message-result.html` - Generated message with action options
- `HeartGlowAI-mobile-development.md` - Progress tracking document

## Setup and Testing

1. Clone this repository
2. Open any of the HTML files in a modern browser
3. Test on various mobile devices or using browser dev tools device emulation
4. Flow through the message creation process to test the full experience

## Development Progress

Check `HeartGlowAI-mobile-development.md` for detailed progress tracking on all features.

## Next Steps

1. Complete the contact management system with swipe actions
2. Implement notification system for message follow-ups
3. Create settings page for user preferences
4. Add user onboarding flow for first-time users
5. Implement analytics to track user engagement

## Technical Notes

- Designed with breakpoints at 480px, 768px, 1024px, and 1440px
- Touch targets sized at minimum 44x44px for accessibility
- Animations optimized for 60fps performance
- Uses responsive units (rem, em, %) for consistent scaling
- Implements fluid typography with appropriate line heights for readability 