import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// Import the message generation function and type
import { generateMessage, MessageGenerationParams } from '../../lib/messageGenerator';
import {
  ChatBubbleIcon,
  DashboardIcon,
  PersonIcon,
  Pencil2Icon,
  MagicWandIcon,
  BookmarkFilledIcon,
  BarChartIcon,
  MixIcon,
  Link2Icon
} from '@radix-ui/react-icons'; // Example Icons
import { useRouter } from 'next/router'; // Import useRouter
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
// Import the modal
import AddConnectionModal from './AddConnectionModal';
import { HeartIcon, LightBulbIcon } from '@heroicons/react/24/outline'; // Use Heroicon for LightBulb
import PaywallModal from '../ui/PaywallModal'; // Import the PaywallModal

// Import Firebase Analytics
import { logEvent } from 'firebase/analytics';
import { analytics as firebaseAnalytics } from '../../lib/firebase'; // Import the analytics instance

// Placeholder components for individual steps - create these later
// import OnboardingWelcome from './OnboardingWelcome';
// import OnboardingMinimalInput from './OnboardingMinimalInput';
// import OnboardingReveal from './OnboardingReveal';
// import OnboardingCoachingTeaser from './OnboardingCoachingTeaser';
// import OnboardingNextSteps from './OnboardingNextSteps';

// Define props interface
interface OnboardingFlowWrapperProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

// Remove React.FC type and explicit return type
const OnboardingFlowWrapper = ({ currentStep, setCurrentStep }: OnboardingFlowWrapperProps) => {
  const { userProfile, updateUserProfile } = useAuth();
  const router = useRouter();
  // State to hold onboarding form data
  const [onboardingData, setOnboardingData] = useState<any>({ // Use a more specific type later
    recipientInput: '', 
    selectedIntent: null,
    selectedRelationship: null, // Added state for relationship type
  });
  // State for message generation result
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isAddConnectionModalOpen, setIsAddConnectionModalOpen] = useState(false); // State for modal
  const [showPaywall, setShowPaywall] = useState(false); // State for the onboarding paywall

  // --- Analytics Helper ---
  const logOnboardingEvent = async (eventName: string, params?: { [key: string]: any }) => {
    try {
      const analyticsInstance = await firebaseAnalytics; // Resolve the promise
      if (analyticsInstance) {
        logEvent(analyticsInstance, eventName, {
          ...params,
          onboarding_step: currentStep, // Automatically add current step
        });
        console.log(`[Firebase Analytics] Logged event: ${eventName}`, { onboarding_step: currentStep, ...params });
      } else {
        console.warn('[Firebase Analytics] Analytics not supported or initialized.');
      }
    } catch (error) {
      console.error('[Firebase Analytics] Error logging event:', error);
    }
  };

  // --- Analytics: Log step view ---
  useEffect(() => {
    // console.log(`[Analytics] Onboarding Step View: ${currentStep}`);
    logOnboardingEvent('onboarding_step_viewed');
  }, [currentStep]); // Rerun when currentStep changes

  // TODO: Implement logic to advance steps (handleNext) - This seems handled by setCurrentStep calls
  // TODO: Implement logic to update userProfile.hasCompletedOnboarding - This is done in handleCompleteOnboarding

  // Intents for Step 3 (previously Step 2)
  const coreIntents = [
    { id: 'check_in', label: 'Just Checking In', emoji: '👋' },
    { id: 'thank_you', label: 'Say Thanks', emoji: '🙏' },
    { id: 'offer_support', label: 'Offer Support', emoji: '❤️' },
    { id: 'celebrate', label: 'Celebrate Good News', emoji: '🎉' },
  ];

  // Relationship types for New Step 2
  const relationshipTypes = [
    { id: 'partner', label: 'Partner', emoji: '💖' },
    { id: 'parent', label: 'Parent', emoji: '👨‍👩‍👧' },
    { id: 'friend', label: 'Friend', emoji: '😊' },
    { id: 'coworker', label: 'Co-Worker', emoji: '🤝' },
  ];

  // --- Onboarding Paywall Content --- (Define the specific content here)
  const onboardingPaywallContent = {
    title: <>✨ You just said something that matters.</>,
    description: <>
      Imagine how your relationships could feel… if you did that more often.
      {'\n\n'}
      With HeartGlow Premium, you'll unlock the full journey:
    </>,
    features: [
      { name: 'Save every message you create — love notes, check-ins, or hard truths', icon: BookmarkFilledIcon },
      { name: 'Track how your emotional communication grows with GlowScore', icon: BarChartIcon },
      { name: 'Get ongoing guidance for romantic, personal, and tough conversations', icon: LightBulbIcon },
      { name: 'Access deeper message templates and tone styles', icon: MixIcon },
      { name: 'Build habits of care, clarity, and connection — one message at a time', icon: Link2Icon },
    ],
    ctaText: "💖 Upgrade to HeartGlow Premium",
    footerText: <>Start free. Cancel anytime. Always private.</>,
    dismissText: "Maybe later. Finish onboarding."
  };

  // Renamed from handleStep2Submit for clarity - Now for Step 3
  const handleGenerateFirstMessage = async () => {
    // console.log("[Analytics] Onboarding Action: Click 'Draft my Message'"); // Analytics
    logOnboardingEvent('onboarding_action', { action_description: 'generate_first_message' });
    setIsGenerating(true);
    setGeneratedMessage(null); // Clear previous message
    setGenerationError(null);

    // --- Construct Params with Defaults ---
    const params: MessageGenerationParams = {
      recipient: {
        name: onboardingData.recipientInput,
        relationship: onboardingData.selectedRelationship || 'Unknown' // Use selected relationship if available
      },
      connectionData: {},
      intent: { type: onboardingData.selectedIntent, custom: '' },
      format: { type: 'text', length: 'short', options: {} }, // Default format
      tone: 'Neutral', // Default tone
      promptedBy: 'Onboarding first message generation', // Context for prompt
      messageGoal: '',
      style: { formality: 3, depth: 3, length: 'short' }, // Default style
      customInstructions: { text: '', options: {} },
    };

    try {
      console.log("[Onboarding] Calling generateMessage with params:", params);
      const result = await generateMessage(params);
      console.log("[Onboarding] Received result:", result);
      if (result && result.content) {
        setGeneratedMessage(result.content);
        // console.log("[Analytics] Onboarding Event: Message Generation Success"); // Analytics
        logOnboardingEvent('onboarding_message_generation', { status: 'success' });
        setCurrentStep(4); // Move to reveal step (Step 4)
      } else {
        // console.error("[Analytics] Onboarding Event: Message Generation Failed - Empty response"); // Analytics
        const errorMsg = result?.content || 'Empty response from generation function';
        logOnboardingEvent('onboarding_message_generation', { status: 'failure', error_message: errorMsg });
        throw new Error(errorMsg); // Throw error if content is missing
      }
    } catch (error: any) { // Catch errors
      console.error("[Onboarding] Error generating message:", error);
      // console.error("[Analytics] Onboarding Event: Message Generation Failed", { error: error.message }); // Analytics
      const errorMsg = error.message || 'An unknown error occurred during message generation.';
      logOnboardingEvent('onboarding_message_generation', { status: 'failure', error_message: errorMsg });
      setGenerationError(errorMsg);
      setCurrentStep(4); // Still go to reveal step (Step 4) to show error
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to mark onboarding complete and handle navigation/actions - Step numbers inside might need adjustment later if adding more steps
  const handleCompleteOnboarding = async (nextAction: 'dashboard' | 'connections' | 'create') => {
    // console.log(`[Analytics] Onboarding Action: Complete Onboarding - ${nextAction}`); // Analytics
    logOnboardingEvent('onboarding_action', { action_description: `complete_onboarding_${nextAction}` });
    try {
      console.log("[Onboarding] Marking onboarding as complete...");
      await updateUserProfile({ hasCompletedOnboarding: true });
      logOnboardingEvent('onboarding_completed', { final_action: nextAction });
      // The AuthContext listener will eventually update the state, causing _app.tsx to re-render and remove the wrapper.
      // We can navigate immediately.
      console.log(`[Onboarding] Navigating based on action: ${nextAction}`);
      switch (nextAction) {
        case 'dashboard':
          router.push('/'); // Navigate to dashboard
          break;
        case 'connections':
          // TODO: Implement navigation or modal logic for adding connections
          alert('Navigate to Connections (or open modal) - To be implemented');
          router.push('/connections'); // Temporary: navigate to connections list page
          break;
        case 'create':
          router.push('/create'); // Navigate to full message creation page
          break;
      }
    } catch (error) {
      console.error("[Onboarding] Failed to mark onboarding as complete:", error);
      // Handle error (e.g., show a message to the user)
      alert("Failed to save onboarding status. Please try again.");
    }
  };

  // --- Handler for saving connection from modal ---
  const handleSaveConnection = (connectionId: string) => {
    // console.log(`[Analytics] Onboarding Event: First Connection Added (ID: ${connectionId})`);
    logOnboardingEvent('onboarding_action', { action_description: 'first_connection_added', connection_id: connectionId });
    setIsAddConnectionModalOpen(false);
    // After saving, mark onboarding complete and go to dashboard
    handleCompleteOnboarding('dashboard'); 
  };

  // --- Trigger Paywall Helper ---
  const triggerPaywall = (source: string) => {
    logOnboardingEvent('onboarding_action', { action_description: 'show_paywall', source: source });
    setShowPaywall(true);
  };

  // --- Motion Variants for Step Transitions ---
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Force display on both mobile and desktop for new users
  // The PaywallModal already has this flag internally, but we explicitly set it here
  // to ensure consistency across components and to document the requirement
  const isPresentOnAllDevices = true;

  // This function determines what content to render based on the currentStep
  const renderCurrentStep = () => {
    let stepContent;
    const userName = userProfile?.displayName || 'there'; // Use displayName instead of firstName

    // The switch statement populates the stepContent variable
    switch (currentStep) {
      case 1: // Welcome Step (Updated)
        stepContent = (
          <div className="text-center flex flex-col items-center">
             {/* Enhanced Visual: Add an Icon */}
             <div className="p-3 bg-gradient-to-br from-heartglow-pink/20 to-heartglow-violet/20 rounded-full mb-5">
                 <MagicWandIcon className="w-8 h-8 text-heartglow-pink" />
             </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Hi {userName}, we're so glad you're here! {/* Personalized Greeting */}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Ready to start saying the things that matter? Let our AI help you craft the perfect message in seconds. {/* Updated Text */}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8">
               Need help anytime? Click the 💡 icon!
            </p>
            <button
              onClick={() => {
                // console.log("[Analytics] Onboarding Action: Click 'Get Started'");
                logOnboardingEvent('onboarding_action', { action_description: 'click_get_started' });
                setCurrentStep(2);
              }} // Go to NEW Step 2
              // Enhanced Styling for CTA
              className="w-full px-8 py-3 bg-heartglow-pink text-white font-bold rounded-lg shadow-lg hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-300 ease-in-out transform hover:scale-105"
            >
              Let's Get Started! {/* Slightly modified button text */}
            </button>
          </div>
        );
        break;

      case 2: // NEW Step: Relationship Focus
        stepContent = (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              What kind of relationship matters most right now?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
              This helps us tailor suggestions for you later on.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
                {relationshipTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                        setOnboardingData({ ...onboardingData, selectedRelationship: type.label }); // Store the label for now
                        logOnboardingEvent('onboarding_action', { action_description: 'select_relationship', relationship_type: type.label });
                    }}
                     className={`flex flex-col items-center justify-center text-center p-4 border rounded-xl transition-all duration-200 ease-in-out shadow-sm h-28 ${onboardingData.selectedRelationship === type.label
                      ? 'bg-indigo-100/50 border-indigo-500 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:border-indigo-600 transform scale-105'
                      : 'border-gray-200 dark:border-gray-600/50 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/80 hover:shadow-md'}`
                     }
                  >
                    <span className="text-3xl mb-2" role="img" aria-label={type.label}>{type.emoji}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type.label}</span>
                  </button>
                ))}
            </div>
             {/* Buttons Section */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
                 <button
                   onClick={() => setCurrentStep(1)} // Go back to Welcome
                   className="w-full sm:w-auto px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                     // console.log(`[Analytics] Onboarding Action: Selected Relationship - ${onboardingData.selectedRelationship}`); // Logged on selection now
                     logOnboardingEvent('onboarding_action', { action_description: 'click_next_from_relationship' });
                     setCurrentStep(3); // Go to Message Crafting (now Step 3)
                  }}
                  disabled={!onboardingData.selectedRelationship}
                  className="w-full sm:flex-1 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
                >
                  Next
                </button>
            </div>
          </div>
        );
        break;

      case 3: // Message Crafting Input (Previously Step 2)
        const suggestedRecipient = onboardingData.selectedRelationship ? `Your ${onboardingData.selectedRelationship}` : 'Someone important';
        stepContent = (
          <div className="flex flex-col">
             {/* MODIFIED Title */}
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-5 text-center">
              Let's check in with {suggestedRecipient}
            </h2>
             {/* MODIFIED Subtext */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
               Just one message to get things rolling. Tell us their name and the main goal.
            </p>

            <div className="mb-6">
              <label htmlFor="recipientInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Who is this message for? (Their Name)
              </label>
              {/* Input field remains the same */}
              <input
                type="text"
                id="recipientInput"
                value={onboardingData.recipientInput}
                onChange={(e) => setOnboardingData({ ...onboardingData, recipientInput: e.target.value })}
                placeholder={`e.g., ${onboardingData.selectedRelationship === 'Parent' ? 'Mom' : onboardingData.selectedRelationship === 'Partner' ? 'Alex' : 'Sarah'}`} // Dynamic placeholder
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base"
              />
            </div>

            <div className="mb-8">
               {/* Intent selection remains the same */}
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                 What's the main goal?
               </label>
               <div className="grid grid-cols-2 gap-4">
                 {coreIntents.map((intent) => (
                   <button
                     key={intent.id}
                     onClick={() => {
                         setOnboardingData({ ...onboardingData, selectedIntent: intent.id });
                         logOnboardingEvent('onboarding_action', { action_description: 'select_intent', intent_id: intent.id });
                     }}
                     className={`flex flex-col items-center justify-center text-center p-4 border rounded-xl transition-all duration-200 ease-in-out shadow-sm h-28 ${onboardingData.selectedIntent === intent.id
                       ? 'bg-heartglow-pink/10 border-heartglow-pink ring-2 ring-heartglow-pink dark:bg-heartglow-pink/20 dark:border-heartglow-pink/80 transform scale-105'
                       : 'border-gray-200 dark:border-gray-600/50 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/80 hover:shadow-md'}`
                    }
                   >
                     <span className="text-3xl mb-2" role="img" aria-label={intent.label}>{intent.emoji}</span>
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{intent.label}</span>
                   </button>
                 ))}
               </div>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                 Tip: Choose the goal that feels closest. Check 💡 for more guidance.
               </p>
            </div>

            {/* Buttons Section - Updated Back Button */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
                 <button
                   onClick={() => setCurrentStep(2)} // Go back to Relationship selection
                   className="w-full sm:w-auto px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Back
                </button>
                {/* Generate button remains the same, uses handleGenerateFirstMessage which now advances to Step 4 and logs its own action */}
                <button
                  onClick={handleGenerateFirstMessage}
                  disabled={!onboardingData.recipientInput || !onboardingData.selectedIntent || isGenerating}
                  // Enhanced styling for primary action
                  className="w-full sm:flex-1 px-8 py-3 bg-heartglow-pink text-white font-bold rounded-lg shadow-lg hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {/* MODIFIED: Engaging loading text */}
                      Conjuring the perfect words...
                    </>
                  ) : (
                    'Draft my Message ✨'
                  )}
                </button>
            </div>
          </div>
        );
        break;

      case 4: // Message Reveal (Previously Step 3)
        stepContent = (
          <div className="text-center flex flex-col">
            {isGenerating ? (
              // Enhanced Loading State
              <div className="flex flex-col items-center justify-center p-10 space-y-4 min-h-[300px]">
                 <svg className="animate-spin h-10 w-10 text-heartglow-pink mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                 <span className="text-lg font-medium text-gray-600 dark:text-gray-400">Conjuring the perfect words...</span>
                 <p className="text-sm text-gray-500 dark:text-gray-500">Our AI is thinking just for you ✨</p>
              </div>
            ) : generationError ? (
              <div className="space-y-6">
                 <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                 </div>
                <h2 className="text-xl font-semibold text-red-500 dark:text-red-400">
                  Hmm, AI Needs Inspiration!
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-red-50 dark:bg-red-800/30 border border-red-200 dark:border-red-700/50 p-4 rounded-lg">
                  {generationError}
                  <br/> Could you try adjusting your request slightly?
                </p>
                <button 
                  onClick={() => setCurrentStep(3)} // Go back to Input (now Step 3)
                  className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Go Back & Try Again
                </button>
              </div>
            ) : generatedMessage ? (
              <div className="space-y-5">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Voila! Here's a draft for {onboardingData.recipientInput || 'them'}!
                </h2>
                {/* Added explanation text */}
                <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">
                  This was crafted just for you — based on your intent and who it's for.
                </p>
                {/* Message Display */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-inner text-left min-h-[120px]">
                  <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed text-base">
                    {generatedMessage}
                  </p>
                </div>
                {/* Added personalization prompt */}
                <div className="mt-4 space-y-2 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                     Want to add something personal before sending?
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                      {/* Placeholder buttons - non-functional for now */}
                      <button className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">+ Add inside joke</button>
                      <button className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">+ Make it warmer</button>
                  </div>
                </div>
                 {/* Updated Upgrade Prompt */}
                 <p className="text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700/50">
                    ✨ Remember, you can fully edit this in the main editor.
                   <br/> <a href="#" onClick={(e) => { e.preventDefault(); /* console.log("[Analytics] Onboarding Action: Click Upgrade Link (Step 4)"); */ logOnboardingEvent('onboarding_action', { action_description: 'click_upgrade_link', source: 'step_4_reveal' }); triggerPaywall('step_4_reveal_link'); }} className="font-medium text-heartglow-pink hover:underline">Upgrade to begin building your emotional journey & save drafts.</a>
                </p>
                {/* Buttons Section - Update Continue Button Logic */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
                   <button
                      onClick={() => setCurrentStep(3)} // Go back to Input (Step 3)
                       // Adding back the button styling and text content
                      className="w-full sm:w-auto px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => { 
                          // console.log("[Analytics] Onboarding Action: Click 'Continue' from Step 4"); 
                          logOnboardingEvent('onboarding_action', { action_description: 'continue_from_reveal' }); 
                          setCurrentStep(5); 
                      }} // Go to NEW Affirmation Step (Step 5)
                       // Ensure this button also has its styling
                      className="w-full sm:flex-1 px-8 py-3 bg-heartglow-pink text-white font-bold rounded-lg shadow-lg hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      Continue
                    </button>
                </div>
              </div>
            ) : (
              <div>Loading message or an unexpected state occurred.</div>
            )}
          </div>
        );
        break;

      case 5: // NEW Step: Affirmation & Commitment
         stepContent = (
          <div className="text-center space-y-6 flex flex-col items-center">
             {/* Optional: Add a gentle icon, e.g., seedling or heart */}
             <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-4 shadow-inner">
                 {/* Placeholder Icon */} 
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
             </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              That took courage.
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Taking the first step is often the hardest. Ready to keep nurturing your connections?
            </p>
            {/* Streak Incentive */}
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md border border-gray-200 dark:border-gray-600/80">
              🌱 <span className="font-medium">Grow your GlowScore:</span> Send 1 message a day to build your streak!
            </p>
            {/* CTAs */}
            <div className="w-full space-y-3 pt-4">
              <button 
                 onClick={() => {
                     // console.log("[Analytics] Onboarding Action: Affirmation -> Add Connection");
                     logOnboardingEvent('onboarding_action', { action_description: 'open_add_connection_modal', source: 'step_5_affirmation' });
                     setIsAddConnectionModalOpen(true); // Open modal, completion handled there
                  }}
                 className="w-full flex items-center justify-center px-6 py-3 border-2 border-heartglow-pink dark:border-heartglow-pink rounded-xl bg-heartglow-pink/10 hover:bg-heartglow-pink/20 dark:hover:bg-heartglow-pink/30 ring-2 ring-heartglow-pink/50 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg font-semibold text-gray-800 dark:text-gray-100"
              >
                 <PersonIcon className="h-5 w-5 mr-2 text-heartglow-pink" />
                 Add Your First Connection
              </button>
              <button 
                 onClick={() => { 
                     // console.log("[Analytics] Onboarding Action: Affirmation -> Explore Dashboard (Challenges)");
                     logOnboardingEvent('onboarding_action', { action_description: 'click_explore_next' });
                     // For now, just continue to next step (HeartSteps Teaser)
                     // Later, could potentially navigate directly to dashboard or challenges section if handleCompleteOnboarding is called here.
                     setCurrentStep(6); 
                  }}
                 className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 dark:border-gray-600/80 rounded-xl bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/80 hover:shadow-md transition-all duration-200 ease-in-out font-medium text-gray-700 dark:text-gray-200"
              >
                 {/* Dashboard/Challenge Icon? */}
                  <DashboardIcon className="h-5 w-5 mr-2 text-indigo-500" />
                 Explore What's Next
              </button>
            </div>
            {/* Back Button */}
            <button 
              onClick={() => setCurrentStep(4)} // Go back to Reveal (Step 4)
              className="mt-4 px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
            >
              Back
            </button>
          </div>
         );
         break;

      case 6: // HeartSteps Teaser (Previously Step 5)
         // NOTE: Renumbered again
         stepContent = (
          <div className="text-center space-y-6 flex flex-col items-center">
             {/* Icon Presentation */}
             <div className="p-3 bg-gradient-to-br from-indigo-200 to-violet-200 dark:from-indigo-800/50 dark:to-violet-800/50 rounded-full mb-4 shadow-inner">
                {/* Using ChatBubbleIcon, could be changed */}
                <ChatBubbleIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300" aria-hidden="true" /> 
             </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Introducing HeartSteps Guidance {/* Renamed */}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {/* Benefit-focused description */}
              Navigate real-life conversations with clarity, calm, and care. 
              HeartSteps is here for the moments that need more than just a single message.
            </p>
            {/* Sample Prompt Example */}
            <div className="w-full bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600/80 text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Example prompt:</p>
                <p className="text-sm text-gray-700 dark:text-gray-200 italic">
                  "I want to bring up something I've been holding in with my partner..."
                </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
               Find HeartSteps anytime on your dashboard!
            </p>
            {/* Updated Upgrade Prompt */}
            <p className="text-sm text-gray-600 dark:text-gray-300 pt-4 border-t border-gray-200 dark:border-gray-700/50">
              <a href="#" onClick={(e) => { e.preventDefault(); /* console.log("[Analytics] Onboarding Action: Click Upgrade Link (Step 6)"); */ logOnboardingEvent('onboarding_action', { action_description: 'click_upgrade_link', source: 'step_6_teaser' }); triggerPaywall('step_6_teaser_link'); }} className="font-medium text-indigo-500 dark:text-indigo-300 hover:underline">Upgrade to track your growth, reflect on sessions, and save insights.</a>
            </p>

            {/* Buttons Section - Update Back/Continue Button Logic */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 w-full">
                <button
                  onClick={() => setCurrentStep(5)} // Go back to Affirmation (Step 5)
                  // ... rest of back button props ...
                >
                  Back
                </button>
                <button
                  onClick={() => {
                     // console.log("[Analytics] Onboarding Action: Click 'Got It' from Step 6 - Triggering Paywall");
                     logOnboardingEvent('onboarding_action', { action_description: 'click_got_it_teaser' });
                     triggerPaywall('step_6_got_it'); // Show the paywall instead of going to Step 7
                  }}
                  // ... rest of continue button props ...
                  className="w-full sm:flex-1 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Got It!
                </button>
            </div>
          </div>
        );
        break;

      case 7: // Next Steps (Previously Step 6)
        // NOTE: Renumbered again
        stepContent = (
          <div className="text-center flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              You're Ready to Glow!
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              You've started your journey! Choose where to go next, or add your first connection.
            </p>

            {/* Enhanced Action Cards with Updated Upgrade Framing */}
            <div className="space-y-4">
                {/* Option 1: Add Connection (Highlighted) */}
                <button
                  onClick={() => {
                     // console.log("[Analytics] Onboarding Action: Click 'Add Your First Connection'");
                     logOnboardingEvent('onboarding_action', { action_description: 'open_add_connection_modal', source: 'step_7_next_steps' });
                     setIsAddConnectionModalOpen(true);
                  }}
                  className="w-full flex items-center text-left p-5 border-2 border-heartglow-pink dark:border-heartglow-pink rounded-xl bg-heartglow-pink/10 hover:bg-heartglow-pink/20 dark:hover:bg-heartglow-pink/30 ring-2 ring-heartglow-pink/50 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                >
                  <PersonIcon className="h-7 w-7 mr-4 text-heartglow-pink flex-shrink-0" />
                  <div className="flex-grow">
                     <span className="font-semibold text-base text-gray-800 dark:text-gray-100">Add Your First Connection</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                       {/* Updated Framing */}
                       Get personalized suggestions. <a href="#" onClick={(e) => { e.stopPropagation(); e.preventDefault(); /* console.log("[Analytics] Onboarding Action: Click Upgrade Link (Step 7 - Add Connection)"); */ logOnboardingEvent('onboarding_action', { action_description: 'click_upgrade_link', source: 'step_7_add_connection' }); triggerPaywall('step_7_add_connection_link'); }} className="font-medium text-heartglow-pink hover:underline">Upgrade to nurture unlimited connections on your journey.</a>
                      </p>
                  </div>
                   <span className="text-xs font-medium text-white bg-heartglow-pink px-2 py-0.5 rounded-full ml-2">Recommended</span>
                </button>

                {/* Option 2: Explore Dashboard */}
                 <button
                  onClick={() => handleCompleteOnboarding('dashboard')}
                  className="w-full flex items-center text-left p-4 border border-gray-200 dark:border-gray-600/80 rounded-xl bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/80 hover:shadow-md transition-all duration-200 ease-in-out"
                 >
                  <DashboardIcon className="h-6 w-6 mr-4 text-indigo-500 flex-shrink-0" />
                  <div className="flex-grow">
                     <span className="font-medium text-gray-700 dark:text-gray-200">Explore Your Dashboard</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                       Discover challenges, track your GlowScore & find HeartSteps.
                      </p>
                  </div>
                </button>

                {/* Option 3: Craft Another Message */}
                 <button
                  onClick={() => handleCompleteOnboarding('create')}
                  className="w-full flex items-center text-left p-4 border border-gray-200 dark:border-gray-600/80 rounded-xl bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/80 hover:shadow-md transition-all duration-200 ease-in-out"
                >
                  <Pencil2Icon className="h-6 w-6 mr-4 text-green-500 flex-shrink-0" />
                  <div className="flex-grow">
                     <span className="font-medium text-gray-700 dark:text-gray-200">Craft Another Message</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                       Use the full editor with more tones & styles.
                      </p>
                  </div>
                </button>
            </div>
            {/* Updated General Upgrade Tease with Tiers */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700/50">
               Ready to deepen your journey? <a href="#" onClick={(e) => { e.preventDefault(); /* console.log("[Analytics] Onboarding Action: Click Upgrade Link (Step 7 - Footer)"); */ logOnboardingEvent('onboarding_action', { action_description: 'click_upgrade_link', source: 'step_7_footer' }); triggerPaywall('step_7_footer_link'); }} className="text-heartglow-pink font-semibold hover:underline">Upgrade anytime</a> to save all your progress, revisit messages, and unlock your full potential:
               <br/> <span className="font-mono text-xs tracking-tight">🌱 Opening Up → 🔥 In Bloom → 🕊️ Legacy Builder</span>
            </p>
            {/* GlowGuide Hint */} 
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                 Confused? The 💡 guide explains each option.
              </p>
             <button
               onClick={() => setCurrentStep(6)} // Go back to HeartSteps (Step 6)
               className="w-full sm:w-auto mt-6 px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
            >
              Back
            </button>
          </div>
        );
        break;

      default:
        stepContent = <div>Unknown Step: {currentStep}</div>;
    }

    // IMPORTANT: This return statement wraps the chosen stepContent in the motion div
    // It MUST be inside renderCurrentStep but AFTER the switch statement.
    return (
      <motion.div
        key={currentStep} // Key change triggers animation
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {stepContent} 
      </motion.div>
    );
  }; // END of renderCurrentStep function

  // MAIN RETURN STATEMENT FOR THE COMPONENT
  // This is what OnboardingFlowWrapper actually returns
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"> {/* Darker card background */}
        <AnimatePresence mode="wait">
          {renderCurrentStep()} // Call the function that returns the step content
        </AnimatePresence>
      </div>
      {/* Render the modal outside the step animation */}
      <AddConnectionModal
        isOpen={isAddConnectionModalOpen}
        onClose={() => setIsAddConnectionModalOpen(false)}
        onSave={handleSaveConnection}
      />
      {/* Render the Paywall Modal conditionally */} 
      {showPaywall && (
          <PaywallModal
            isOpen={showPaywall}
            onClose={() => {
              // console.log("[Analytics] Onboarding Action: Dismissed Paywall - Continuing Onboarding");
              logOnboardingEvent('onboarding_action', { action_description: 'dismiss_paywall' });
              setShowPaywall(false);
              // Ensure we log the view for step 7 if they came from step 6
              if (currentStep === 6) {
                  logOnboardingEvent('onboarding_step_viewed', { step_number: 7 }); 
              }
              setCurrentStep(7); // Go to the final onboarding step (Next Steps)
            }}
            content={onboardingPaywallContent} // Pass the specific onboarding content
          />
      )}
    </div>
  );
}; // END of OnboardingFlowWrapper component definition

export default OnboardingFlowWrapper; 