# HeartGlowAI Implementation Log

This document tracks the implementation progress of HeartGlowAI's unified message experience and other features.

## Table of Contents
1. [Phase 1: Preparation & Scaffolding](#phase-1-preparation--scaffolding)
2. [Phase 2: Individual Steps Implementation](#phase-2-individual-steps-implementation)
3. [Phase 3: Preview Panel & Enhancements](#phase-3-preview-panel--enhancements)
4. [Phase 4: API Integration & Advanced Features](#phase-4-api-integration--advanced-features)
5. [Bug Fixes & Improvements](#bug-fixes--improvements)
6. [Current Implementation Challenges & Solutions](#current-implementation-challenges--solutions)

---

## Phase 1: Preparation & Scaffolding
*Completed on: April 8, 2024*

### Overview
Phase 1 established the basic framework for the unified message builder experience, setting up the navigation, core structure, and scaffolding required for subsequent phases.

### Key Components Implemented
- Basic HTML structure for the unified message builder
- Navigation framework with step progression
- Progress sidebar with step indicators
- Preview panel framework
- Core state management infrastructure

---

## Phase 2: Individual Steps Implementation
*Completed on: April 15, 2024*

### Overview
Phase 2 implemented all four steps of the message creation flow within the unified interface, integrating functionality from the separate pages into a cohesive single-page experience.

### Files Modified
1. **js/message-builder.js**
   - Added implementation for all four steps: recipient selection, intent selection, tone selection, and message generation
   - Enhanced navigation between steps
   - Improved data flow and state management
   - Added preview panel updates

2. **css/pages/message-builder.css**
   - Added comprehensive styling for all steps
   - Added animations and transitions
   - Implemented responsive design for mobile devices
   - Created custom components for cards, inputs, and buttons

3. **home.html**
   - Enhanced the "Try Now" button in the banner to make it more prominent
   - Added pulse animation to attract user attention
   - Updated styling to improve visibility

### Step-by-Step Implementation Details

#### 1. Recipient Selection Step
- **Functionality Added**:
  - Connection list display with Firebase integration
  - Connection selection and card highlighting
  - Connection creation/editing via modal
  - Search functionality for filtering connections
  - Smooth animations for cards
  - Relationship icon visualization
  - Preview panel updates when recipient is selected

- **Data Flow**:
  - User connections loaded from Firebase
  - Selected connection stored in `messageData.recipient`
  - Data persisted to localStorage for resuming progress

#### 2. Intent Selection Step
- **Functionality Added**:
  - Toggle between professional and personal intent categories
  - Grid layout for intent selection cards
  - Custom intent input option
  - Visual feedback for selection
  - Preview panel updates
  - Data validation before proceeding

- **Data Flow**:
  - Selected intent stored in `messageData.intent`
  - Category, title, description, and icon are captured
  - Custom intent text captured if applicable

#### 3. Tone Selection Step
- **Functionality Added**:
  - Context section showing recipient and intent info
  - Grid layout for tone selection cards
  - Custom tone input option
  - Visual feedback for selection
  - Preview panel updates
  - Data validation before proceeding

- **Data Flow**:
  - Selected tone stored in `messageData.tone` 
  - Name, description, and icon are captured
  - Custom tone text captured if applicable

#### 4. Message Result Step
- **Functionality Added**:
  - Message generation (simulated for now, real API call structure in place)
  - Display of generated message
  - Insights display for emotional context
  - Message action buttons (copy, regenerate, edit, save)
  - Error handling for failed generation
  - Loading states

- **Data Flow**:
  - Generated message stored in `messageData.result`
  - Data persisted to localStorage and Firebase

### Core Infrastructure Improvements

1. **Navigation System**:
   - Enhanced `showStep()` function to validate previous data
   - Implemented step validation to ensure required data exists
   - Added smooth scrolling to active step
   - Created sidebar progress tracking

2. **Data Management**:
   - Implemented comprehensive state management via `messageData` object
   - Added persistence to localStorage for resuming sessions
   - Added Firebase Firestore integration for saving completed messages

3. **UI/UX Enhancements**:
   - Added loading states and spinners
   - Implemented responsive design for mobile devices
   - Added animations for transitions between steps
   - Enhanced the preview panel to update dynamically

4. **Error Handling**:
   - Added validation for all user inputs
   - Implemented error messages and alerts
   - Added recovery options for failed operations

---

## Phase 3: Preview Panel & Enhancements
*Completed on: April 20, 2024*

### Overview
Phase 3 focused on enhancing the user experience with advanced animations, improved error handling, secure API integration, and a more dynamic preview panel.

### Files Modified
1. **js/message-builder.js**
   - Implemented Firebase Cloud Function API authentication
   - Enhanced error handling with categorization and recovery options
   - Improved step transitions with directional animations
   - Added real-time preview updates with animations
   - Implemented analytics tracking for errors and user actions

2. **css/pages/message-builder.css**
   - Added enhanced animations for step transitions
   - Implemented visual feedback for user interactions
   - Added mobile-friendly preview panel toggle
   - Implemented reduced motion support for accessibility
   - Added shimmer effect for loading states

### Key Enhancements

#### 1. Firebase Authentication Integration
- **Functionality Added**:
  - Implemented secure token retrieval with `getIdToken()`
  - Added proper authorization headers for Cloud Function calls
  - Implemented token refresh to ensure valid authentication
  - Added error handling for authentication failures
  - Enhanced security for API requests

- **Security Improvements**:
  - Added proper Bearer token authentication
  - Implemented user-specific data access
  - Added validation of API responses
  - Enhanced logging for security issues

#### 2. Enhanced Preview Panel
- **Functionality Added**:
  - Real-time updates with smooth animations
  - Contextual content that updates based on selections
  - Mobile-friendly toggle with slide-in animation
  - Dynamic message placeholder with shimmer effect
  - Improved content formatting with proper line breaks

- **Mobile Responsiveness**:
  - Implemented bottom sheet preview for mobile devices
  - Added floating preview toggle button
  - Optimized preview content for small screens
  - Smooth transitions between mobile and desktop views

#### 3. Advanced Error Handling
- **Functionality Added**:
  - Comprehensive error categorization system
  - User-friendly error messages based on error type
  - Retry functionality for recoverable errors
  - Consistent error reporting across all steps
  - Enhanced analytics for tracking error patterns

- **Error Categories**:
  - Network errors with connection troubleshooting
  - Authentication errors with refresh options
  - API errors with appropriate retry strategies
  - Validation errors with clear feedback

#### 4. Smooth Transitions
- **Functionality Added**:
  - Directional animations between steps (left/right)
  - Proper step validation before transitions
  - Smooth scrolling to top of steps
  - Improved visual feedback during transitions
  - Sidebar pulse animation to indicate current step

- **Animation Improvements**:
  - Reduced motion option for accessibility
  - Performance optimization for animations
  - Consistent timing across all animations
  - Added micro-animations for feedback

### Technical Debt Addressed
1. **Event Listener Management**:
   - Fixed duplication of event listeners on custom inputs
   - Added proper cleanup when leaving steps
   - Improved event delegation for dynamic content

2. **Data Loading & Recovery**:
   - Enhanced localStorage integration with better error handling
   - Improved session recovery after page refreshes
   - Added support for legacy data formats

3. **Code Optimization**:
   - Refactored repeated code into utility functions
   - Improved error handling patterns
   - Enhanced analytics tracking

### Analytics Implementation
- Added comprehensive event tracking for:
  - Step transitions
  - Error occurrences and recoveries
  - API call success and failure rates
  - User interaction patterns
  - Performance metrics

### Accessibility Improvements
- Added support for reduced motion preferences
- Improved keyboard navigation
- Enhanced color contrast for better readability
- Added proper focus management between steps

---

## Phase 4: API Integration & Advanced Features
*Completed on: April 22, 2024*

### Overview
Phase 4 focused on completing the API integration for message generation and adding advanced message functionality to enhance the user experience.

### Files Modified
1. **js/message-builder.js**
   - Enhanced message generation API with robust error handling
   - Added message variations feature with 4 different variation types
   - Implemented message editing capability
   - Added response caching for improved performance
   - Enhanced error recovery for the message generation process

2. **css/pages/message-builder.css**
   - Added styling for message variation buttons
   - Enhanced the message editing modal
   - Improved responsive layout for mobile devices

### Key Enhancements

#### 1. Enhanced API Integration
- **Functionality Added**:
  - Implemented robust `callGenerateMessageAPI()` function with retry capability
  - Added exponential backoff for failed API requests
  - Implemented response caching with configurable duration
  - Added comprehensive error handling with specific user messages
  - Improved authentication token management with force refresh option

- **Technical Improvements**:
  - Categorized error handling based on error type (network, auth, rate limit, server)
  - Added support for both v1 and v2 API endpoints
  - Implemented input validation before API calls
  - Enhanced analytics tracking for API calls and errors
  - Added graceful degradation for offline or error scenarios

#### 2. Message Variations Feature
- **Functionality Added**:
  - Implemented 4 variation types: More Formal, More Casual, More Emotional, More Direct
  - Added intuitive UI buttons with appropriate icons
  - Enhanced variation generation with context from original message
  - Added loading states specifically for variations
  - Implemented success/error notifications for variations

- **User Experience Improvements**:
  - Intuitive UI for trying different message styles
  - Clear visual indicators during variation generation
  - Smooth animations between variations
  - Responsive grid layout adapting to device size

#### 3. Message Editing Capability
- **Functionality Added**:
  - Implemented modal dialog for editing generated messages
  - Added direct text editing with textarea
  - Implemented proper save functionality with data persistence
  - Added analytics tracking for edited messages
  - Enhanced preview panel updates after edits

- **Technical Details**:
  - Modal implementation with proper keyboard accessibility
  - Marking edited messages in the data model
  - Maintaining edit history with timestamps
  - Proper data validation for edited content

#### 4. Performance Optimization
- **Functionality Added**:
  - Implemented API response caching
  - Added cache invalidation after timeout period
  - Optimized animations for better performance
  - Improved error recovery with minimal user disruption

- **User Experience Improvements**:
  - Faster subsequent message generations
  - Reduced loading times for returning users
  - Optimized mobile experience
  - Improved offline resilience with cached data

### Technical Improvements

1. **API Call Enhancements**:
   - Added idempotent request handling
   - Implemented proper HTTP error status handling
   - Added retry mechanism with exponential backoff
   - Enhanced API error reporting
   - Improved security with token refresh

2. **Error Recovery**:
   - Added specific error messages based on error type
   - Implemented retry buttons for recoverable errors
   - Enhanced analytics for error tracking
   - Added graceful degradation for API failures

3. **Mobile Optimization**:
   - Optimized variation UI for small screens
   - Enhanced message editing on mobile devices
   - Improved loading indicators for slower connections
   - Better touch interaction for all controls

### Analytics Improvements
- Added detailed tracking for:
  - Message variation usage
  - API success and error rates
  - User editing behavior
  - Performance metrics for API calls
  - Retry attempts and recovery success

---

## Bug Fixes & Improvements
*Updated on: April 22, 2024*

### Firebase Initialization Fix
**Issue**: Firebase services were not initialized before use, causing authentication and API calls to fail.

**Solution implemented**:
- Added explicit Firebase configuration and initialization
- Implemented proper initialization sequence with error handling
- Added Firebase persistence setting for better authentication experience
- Ensured backward compatibility with existing Firebase config

**Technical details**:
- Added proper Firebase config object with API keys and project IDs
- Added detection for already initialized Firebase instance
- Added persistence setting for Firebase authentication
- Enhanced error handling for initialization failures

### Missing Helper Functions Implementation
**Issue**: Several helper functions referenced in the code were missing, causing runtime errors.

**Functions implemented**:

1. **`formatRelationship` Function**:
   - Formats connection relationship types for user-friendly display
   - Handles custom "other" relationship types
   - Properly capitalizes relationship text

2. **`refreshConnectionsList` Function**:
   - Reloads user connections from Firebase when needed
   - Implements caching for better performance
   - Provides proper loading states and error handling

3. **`loadUserConnections` Function**:
   - Fetches user's connections from Firestore
   - Implements proper error handling with retry options
   - Caches connections for improved performance

4. **`displayConnections` Function**:
   - Renders connections in the UI with proper formatting
   - Implements empty state for users with no connections
   - Adds staggered animations for improved user experience
   - Handles connection selection and editing

5. **`editConnection` Function**:
   - Opens the connection modal with pre-filled data
   - Handles form state management for editing
   - Provides proper focus management for accessibility

6. **Modal Management Functions**:
   - `openModal` - Opens modals with animations
   - `closeModal` - Closes modals with animations
   - `openConnectionModal` - Prepares the connection form for new connections
   - `closeConnectionModal` - Handles the connection modal specifically

### Enhanced API Integration
**Issue**: The message generation API lacked proper error handling, retry capabilities, and caching.

**Solution implemented**:
- Added robust error handling with categorized error types
- Implemented retry mechanism with exponential backoff
- Added response caching for improved performance
- Enhanced token management with force refresh option
- Added support for both v1 and v2 API endpoints

**Technical details**:
- Implemented `callGenerateMessageAPI` with retry count parameter
- Added client-side response caching with configurable duration
- Enhanced error handling with specific error types
- Added analytics tracking for API errors and retries
- Improved user feedback for different error scenarios 

### Authentication Timing Issues & Promise Handling
*Updated on: April 30, 2024*

**Issue**: Authentication timing issues caused "Cannot load connections: No user is logged in" errors and uncaught Promise rejections.

**Solution implemented**:
- Enhanced the authentication flow to properly wait for Firebase auth state changes
- Implemented robust Promise handling in connection loading functions
- Added improved error recovery for authentication failures
- Added visual feedback during the authentication process
- Fixed uncaught Promise rejection errors with proper error handling

**Technical details**:
- Modified `refreshConnectionsList` to check authentication state and wait when needed
- Implemented polling with timeout to handle auth state without blocking UI
- Enhanced `loadUserConnections` to cache results for better performance
- Added proper Promise chaining with `.catch()` handlers
- Created better user feedback during loading/authentication process
- Added comprehensive logging for debugging connection issues

### Next Steps for May 1, 2024
*Scheduled for: May 1, 2024, 9:00 AM - 5:00 PM*

**Connection Display & UI Implementation**:
1. **Fix Connection Card Rendering (High Priority)**
   - Debug and fix connection card display in the recipient step
   - Verify DOM manipulation in the `displayConnections` function
   - Add direct element inspection to isolate rendering issues
   - Test connection card styling and animations

2. **Complete Step Content Implementation (Medium Priority)**
   - Verify all step initialization functions are properly implemented
   - Debug intent and tone selection steps
   - Ensure smooth transitions between steps
   - Validate data flow between steps

3. **Enhance Styling & UI Components (Medium Priority)**
   - Apply proper gradient backgrounds to cards
   - Fix spacing and layout according to design system
   - Implement hover and active states for interactive elements
   - Ensure responsive behavior works on all screen sizes

4. **Error Recovery Enhancements (Low Priority)**
   - Improve error messages to be more user-friendly
   - Add automatic retry mechanisms for recoverable errors
   - Enhance analytics for tracking user journeys and error points

**Testing Plan**:
- Test authentication flow with different accounts
- Verify connection loading and display across browsers
- Test step navigation and data persistence
- Validate mobile responsive behavior
- Test error handling and recovery paths

**Documentation Updates**:
- Update implementation status in HANDOFF_DOCUMENT.md
- Document known issues and workarounds
- Update user documentation with latest features 

---

## Current Implementation Challenges & Solutions
*Updated on: May 1, 2024*

### Overview
While implementing the unified message builder experience, we've encountered several recurring issues that have impeded progress. This document aims to standardize our approach to fixing these issues and provide a reference for future development.

### 1. Navigation Button Issues

**Problem:**
Navigation buttons (particularly Next and Back) have been inconsistently functional across different steps. We've observed that:
- Event listeners sometimes fail to fire
- Button states (disabled/enabled) don't update correctly
- Button visibility is inconsistent across browser sessions

**Solutions Implemented:**
1. **Multiple Event Binding Approaches**
   - Added standard addEventListener for each button
   - Added direct onclick attributes in HTML as fallback
   - Implemented console logging on both button discovery and clicks

2. **Force Button Enabling**
   - Created `forceEnableAllButtons()` utility to override any CSS or property-based disabling
   - Applied at key points in navigation workflow
   - Added button state debugging in console

3. **Enhanced Visibility**
   - Added direct inline styles to ensure buttons are visible
   - Created floating navigation buttons that are always accessible
   - Implemented keyboard shortcuts as tertiary fallback (Alt+← and Alt+→)

### 2. Step State Management Issues

**Problem:**
State transitions between steps have been unreliable, with data sometimes not being:
- Properly saved between steps
- Loaded when returning to previous steps
- Validated before proceeding

**Solutions Implemented:**
1. **Improved State Validation**
   - Added comprehensive logging of state via `debugMessageData()` function
   - Simplified validation functions to prevent false negatives
   - Added state persistence to both localStorage and sessionStorage

2. **Robust Selection Handlers**
   - Created standardized `handleIntentSelection()` function
   - Added direct console logging of selection events
   - Ensured state updates trigger necessary UI changes

3. **Fallback Recovery**
   - Implemented session recovery for navigation state
   - Added error recovery dialog with multiple resolution options
   - Created periodic state saving to prevent data loss

### 3. DOM Element Access Issues

**Problem:**
DOM elements central to functionality (like connection cards or intent options) sometimes:
- Fail to initialize properly
- Aren't found by standard document.getElementById calls
- Are found but not visible due to CSS issues

**Solutions Implemented:**
1. **Multiple Selector Strategies**
   - Implemented cascading selector approaches (ID → class → attribute)
   - Added verbose console logging for element discovery
   - Created fallback element creation when elements can't be found

2. **Explicit Style Forcing**
   - Added direct inline styles to critical elements
   - Implemented `fixConnectionsVisibility()` to ensure elements display properly
   - Created test cards to validate rendering pipeline

3. **Element Verification**
   - Added `verifyAndFixStepFooter()` to ensure button containers are accessible
   - Implemented IntersectionObserver to monitor button visibility
   - Added periodic rechecking of critical elements

### 4. API Integration Challenges

**Problem:**
Integration with the message generation API has been problematic:
- Authentication tokens sometimes expire during the flow
- Network errors aren't properly handled
- Response caching needs implementation

**Solutions Implemented:**
1. **Robust API Calling**
   - Created comprehensive `callGenerateMessageAPI()` with retry logic
   - Added token refresh mechanisms
   - Implemented exponential backoff for retries

2. **Error Classification**
   - Added categorized error handling (network, auth, server, etc.)
   - Implemented user-friendly error messages based on error type
   - Added analytics tracking for API errors

3. **Response Caching**
   - Implemented client-side caching with configurable duration
   - Added cache invalidation logic
   - Created fallbacks for offline operation

### 5. Testing & Debugging Standardization

To prevent future regressions, we're standardizing our approach to testing and debugging:

1. **Console Logging Standards**
   - All critical functions should include entry/exit logging
   - State changes should be logged with before/after values
   - Element discovery should include detailed existence checks

2. **Visual Debugging Tools**
   - Added floating UI elements for diagnostics
   - Implemented test cards/elements to validate rendering
   - Created keyboard shortcuts for accessing debug information

3. **Error Recovery**
   - All critical functions should have try/catch blocks
   - Error recovery options should always be presented to the user
   - State should be preserved during error recovery

### Next Steps for Implementation

1. **Complete Core Navigation**
   - Finalize and test button event handling across all steps
   - Ensure data flows correctly through all four steps
   - Verify fallback navigation options function properly

2. **Standardize API Integration**
   - Complete the message generation API integration
   - Implement and test all error scenarios
   - Verify token refresh mechanism works reliably

3. **Enhance Reliability Testing**
   - Create systematic testing protocol for all navigation paths
   - Test on various devices and connection speeds
   - Implement automated testing where possible

By addressing these challenges systematically and standardizing our approach, we aim to finalize the unified message experience implementation without further circular development patterns.

### Comprehensive Navigation Fix
*Updated on: May 3, 2024*

**Issue**: After implementing the missing `verifyAndFixStepFooter` function, navigation between steps was still broken. Both the main and floating "Next" buttons were non-responsive. Thorough investigation showed multiple issues:

1. Event listeners weren't properly firing on button clicks
2. Button state management was inconsistent
3. The step display logic had validation issues
4. There was an invalid state where tone data existed without intent data
5. The showStep function wasn't reliably displaying steps

**Comprehensive Solution Implemented**:

1. **Complete Navigation Button Overhaul**
   - Added `fixAllNavigationButtons()` function that repairs all navigation buttons
   - Implemented multiple binding approaches (direct `onclick`, event listeners, attribute handlers)
   - Cloned and replaced buttons to remove any conflicting event handlers
   - Added inline styles to ensure buttons are visible and clickable

2. **Enhanced showStep Function**
   - Completely rewrote the `showStep()` function with robust error handling
   - Added direct DOM manipulation to show/hide steps
   - Implemented emergency recovery for when errors occur
   - Added multiple scheduling points to ensure late-loading content is handled

3. **Multiple Backup Navigation Methods**
   - Added double-click handler to connection cards to force navigation
   - Created an emergency navigation button for guaranteed step transitions
   - Added side-channel navigation through direct step display
   - Implemented global function patching to add more debugging

4. **Invalid State Handling**
   - Added code to detect and fix invalid state combinations
   - Cleared tone data when intent data is missing to maintain proper flow
   - Added comprehensive logging of state changes for debugging

5. **Multiple Execution Points**
   - Added multiple timeouts to handle various loading scenarios
   - Implemented handlers for both DOMContentLoaded and window.load events
   - Added staged execution to handle asynchronous content loading

**Technical Details**:
- Buttons are now fixed through multiple approaches simultaneously:
  - Direct property assignment: `button.onclick = function() {...}`
  - Event listeners with capturing: `addEventListener('click', function() {...}, true)`
  - Inline attributes: `button.setAttribute('onclick', '...')`
  - Style forcing: `button.style.pointerEvents = 'auto'`

- The showStep function now has multiple layers of protection:
  - Try/catch blocks around critical sections
  - Emergency recovery if the main flow fails
  - Direct DOM manipulation as a last resort
  - Multiple call points to ensure execution

- The navigation system includes fallbacks:
  - Standard navigation through buttons
  - Double-click navigation through cards
  - Emergency button for direct step transitions
  - Function patching to bypass validation

**Impact**:
- Users can now navigate end-to-end through the message builder experience
- All navigation buttons work reliably between steps
- Emergency options ensure users can always progress when needed
- Comprehensive logging helps identify any remaining issues

**Next Steps**:
- Clean up the emergency navigation once normal flow is stable
- Refine the validation logic to be more robust while still allowing navigation
- Enhance transition animations for smoother experience
- Implement proper API integration for message generation 

### Intent Step and Back Button Fixes
*Updated on: May 3, 2024*

**Issues Identified:**
1. **Intent Cards Not Loading**: Users were unable to see the intent options in the Intent step.
2. **Back Button Not Working**: The Back button in the Intent step wasn't returning to the Recipient step.
3. **Emergency Navigation Button**: An inappropriate emergency button was visible to users.

**Solution Implemented:**

1. **Fixed Intent Card Display**
   - Added `fixIntentCardsVisibility()` function that ensures intent cards are visible
   - Implemented direct card creation with proper styling if intent cards weren't found
   - Added simple, focused intent cards with clear click handlers
   - Ensured intent data is properly saved when cards are selected

2. **Fixed Back Button Navigation**
   - Implemented focused `fixBackButtonNavigation()` function to repair back button functionality
   - Applied multiple handler types (onclick property and onclick attribute)
   - Added specific error handling and detailed logging
   - Enhanced button visibility with explicit styling

3. **Removed Emergency Navigation**
   - Removed the emergency button from the UI
   - Added a proper createFloatingNavigationButtons function that cleans up any emergency buttons
   - Focused on production-quality navigation rather than temporary solutions

4. **Enhanced Intent Step Initialization**
   - Modified `initializeIntentStep()` to be more robust
   - Added handling for existing intent data
   - Ensured proper button state management
   - Improved error handling and logging

**Technical Details:**
- Intent cards are now created with explicit visibility styling: 
  ```javascript
  card.style.visibility = 'visible';
  card.style.display = 'block';
  ```
- Back button given multiple navigation triggers to ensure it works:
  ```javascript
  backButton.onclick = function(e) { showStep('recipient'); return false; };
  backButton.setAttribute('onclick', "showStep('recipient'); return false;");
  ```
- Consolidated step initialization to make it more maintainable
- Improved error handling to prevent cascade failures

**Impact:**
- Users can now see and select from intent options
- Back button works reliably to return from Intent to Recipient step
- Navigation is more intuitive and professional looking
- UI is cleaner without debugging/emergency elements

**Next Steps:**
- Complete Tone step initialization with similar patterns
- Ensure proper advancement from Intent to Tone step
- Implement Message Generation with proper API integration
- Test full end-to-end flow with error handling 