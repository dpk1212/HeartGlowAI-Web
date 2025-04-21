import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// Import the message generation function and type
import { generateMessage, MessageGenerationParams } from '../../lib/messageGenerator';
import { ChatBubbleIcon, DashboardIcon, PersonIcon, Pencil2Icon, MagicWandIcon } from '@radix-ui/react-icons'; // Example Icons
import { useRouter } from 'next/router'; // Import useRouter
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
// Import the modal
import AddConnectionModal from './AddConnectionModal';

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

const OnboardingFlowWrapper: React.FC<OnboardingFlowWrapperProps> = ({ currentStep, setCurrentStep }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const router = useRouter();
  // State to hold onboarding form data
  const [onboardingData, setOnboardingData] = useState<any>({ // Use a more specific type later
    recipientInput: '', 
    selectedIntent: null,
  });
  // State for message generation result
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isAddConnectionModalOpen, setIsAddConnectionModalOpen] = useState(false); // State for modal

  // --- Analytics: Log step view ---
  useEffect(() => {
    console.log(`[Analytics] Onboarding Step View: ${currentStep}`);
  }, [currentStep]);

  // TODO: Implement logic to advance steps (handleNext)
  // TODO: Implement logic to update userProfile.hasCompletedOnboarding via a function from AuthContext or Firestore call

  // Intents for Step 2
  const coreIntents = [
    { id: 'check_in', label: 'Just Checking In', emoji: '👋' },
    { id: 'thank_you', label: 'Say Thanks', emoji: '🙏' },
    { id: 'offer_support', label: 'Offer Support', emoji: '❤️' },
    { id: 'celebrate', label: 'Celebrate Good News', emoji: '🎉' },
  ];

  // Renamed from handleStep2Submit for clarity
  const handleGenerateFirstMessage = async () => {
    console.log("[Analytics] Onboarding Action: Click 'Draft my Message'"); // Analytics
    setIsGenerating(true);
    setGeneratedMessage(null); // Clear previous message
    setGenerationError(null);

    // --- Construct Params with Defaults ---
    const params: MessageGenerationParams = {
      recipient: {
        name: onboardingData.recipientInput,
        relationship: 'Unknown' // Placeholder relationship for onboarding
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
        console.log("[Analytics] Onboarding Event: Message Generation Success"); // Analytics
        setCurrentStep(3); // Move to reveal step on success
      } else {
        console.error("[Analytics] Onboarding Event: Message Generation Failed - Empty response"); // Analytics
        throw new Error(result.content || 'Empty response from generation function'); // Throw error if content is missing
      }
    } catch (error: any) { // Catch errors
      console.error("[Onboarding] Error generating message:", error);
      console.error("[Analytics] Onboarding Event: Message Generation Failed", { error: error.message }); // Analytics
      setGenerationError(error.message || 'An unknown error occurred during message generation.');
      // Don't advance step on error, stay on step 2 for user to see/retry?
      // Or maybe advance to step 3 to show the error there? Let's show error on step 3.
      setCurrentStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to mark onboarding complete and handle navigation/actions
  const handleCompleteOnboarding = async (nextAction: 'dashboard' | 'connections' | 'create') => {
    console.log(`[Analytics] Onboarding Action: Complete Onboarding - ${nextAction}`); // Analytics
    try {
      console.log("[Onboarding] Marking onboarding as complete...");
      await updateUserProfile({ hasCompletedOnboarding: true });
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
    console.log(`[Analytics] Onboarding Event: First Connection Added (ID: ${connectionId})`);
    setIsAddConnectionModalOpen(false);
    // After saving, mark onboarding complete and go to dashboard
    handleCompleteOnboarding('dashboard'); 
  };

  // --- Motion Variants for Step Transitions ---
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderCurrentStep = () => {
    let stepContent;
    switch (currentStep) {
      case 1:
        stepContent = (
          <div className="text-center flex flex-col items-center">
             {/* Enhanced Visual: Add an Icon */}
             <div className="p-3 bg-gradient-to-br from-heartglow-pink/20 to-heartglow-violet/20 rounded-full mb-5">
                 <MagicWandIcon className="w-8 h-8 text-heartglow-pink" />
             </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Welcome to HeartGlow AI!
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Unlock authentic communication. Let our AI help you craft the perfect message in seconds.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8">
               Need help anytime? Click the 💡 icon!
            </p>
            <button 
              onClick={() => { console.log("[Analytics] Onboarding Action: Click 'Get Started'"); setCurrentStep(2); }}
              // Enhanced Styling for CTA
              className="w-full px-8 py-3 bg-heartglow-pink text-white font-bold rounded-lg shadow-lg hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-300 ease-in-out transform hover:scale-105"
            >
              Let's Craft Your First Message!
            </button>
          </div>
        );
        break;
      case 2:
        stepContent = (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5 text-center">
              Craft Your First Message
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
              Tell us who this is for and the main goal. Our AI will draft a starting point.
            </p>

            <div className="mb-6">
              <label htmlFor="recipientInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Who is this message for?
              </label>
              <input 
                type="text"
                id="recipientInput"
                value={onboardingData.recipientInput}
                onChange={(e) => setOnboardingData({ ...onboardingData, recipientInput: e.target.value })}
                placeholder="e.g., Friend, Mom, Partner, Colleague"
                // Enhanced input styling
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What's the main goal?
              </label>
              {/* Enhanced Intent Selection Grid */}
              <div className="grid grid-cols-2 gap-4">
                {coreIntents.map((intent) => (
                  <button 
                    key={intent.id}
                    onClick={() => setOnboardingData({ ...onboardingData, selectedIntent: intent.id })}
                    // Enhanced card-like styling for buttons
                    className={`flex flex-col items-center justify-center text-center p-4 border rounded-xl transition-all duration-200 ease-in-out shadow-sm h-28 ${onboardingData.selectedIntent === intent.id 
                      ? 'bg-heartglow-pink/10 border-heartglow-pink ring-2 ring-heartglow-pink dark:bg-heartglow-pink/20 dark:border-heartglow-pink/80 transform scale-105' 
                      : 'border-gray-200 dark:border-gray-600/50 bg-white dark:bg-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:shadow-md'}`}
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

            {/* Buttons Section */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
                 <button 
                   onClick={() => setCurrentStep(1)} // Go back
                   className="w-full sm:w-auto px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Back
                </button>
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
                      Drafting...
                    </>
                  ) : (
                    'Draft my Message ✨'
                  )}
                </button>
            </div>
          </div>
        );
        break;
      case 3:
        stepContent = (
          <div className="text-center flex flex-col">
            {isGenerating ? ( 
              <div className="flex justify-center items-center p-16">
                 <svg className="animate-spin h-10 w-10 text-heartglow-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                 <span className="ml-3 text-gray-600 dark:text-gray-400">Drafting your message...</span>
              </div>
            ) : generationError ? (
              <div className="space-y-6 flex flex-col items-center">
                 <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                 </div>
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                  Oops! Couldn't Draft Message
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-800/20 border border-red-200 dark:border-red-700/50 p-4 rounded-lg">
                  {generationError} 
                  <br/> Please try again, or adjust your inputs.
                </p>
                <button 
                  onClick={() => setCurrentStep(2)} // Go back to retry
                  className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Go Back & Try Again
                </button>
              </div>
            ) : generatedMessage ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Here's your first draft!
                </h2>
                 {/* Enhanced Message Display */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner text-left min-h-[150px]">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-base">
                    {generatedMessage}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                   ✨ Our AI crafted this starting point. You can fully edit messages later.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                   Not quite right? Check the 💡 guide for tips on refining prompts later.
                </p>
                {/* Enhanced Button Layout */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
                   <button 
                      onClick={() => setCurrentStep(2)} // Go back to retry/change input
                      className="w-full sm:w-auto px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => { console.log("[Analytics] Onboarding Action: Click 'Continue' from Step 3"); setCurrentStep(4); }}
                      // Primary action style
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
      case 4:
        stepContent = (
          <div className="text-center space-y-6 flex flex-col items-center">
             {/* Enhanced Icon Presentation */}
             <div className="p-3 bg-gradient-to-br from-indigo-200 to-violet-200 dark:from-indigo-800/50 dark:to-violet-800/50 rounded-full mb-4 shadow-inner">
                <ChatBubbleIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
             </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Need More Guidance?
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Beyond single messages, our AI Coach helps you navigate 
              tricky conversations and communication challenges.
              Find it anytime on your dashboard!
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 w-full">
                <button 
                  onClick={() => setCurrentStep(3)} // Go back
                  // Style consistent with other back buttons
                  className="w-full sm:w-auto px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Back
                </button>
                <button 
                  onClick={() => { console.log("[Analytics] Onboarding Action: Click 'Got It' from Step 4"); setCurrentStep(5); }}
                   // Style consistent with primary CTAs, but maybe different color?
                  className="w-full sm:flex-1 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Got It!
                </button>
            </div>
          </div>
        );
        break;
      case 5:
        stepContent = (
          <div className="text-center flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              You're Ready to Glow!
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              You've crafted your first message! Choose where to go next, or add your first connection (recommended).
            </p>
            
            {/* Enhanced Action Cards */}
            <div className="space-y-4">
                {/* Option 1: Add Connection (Highlighted) */}
                <button 
                  onClick={() => {
                     console.log("[Analytics] Onboarding Action: Click 'Add Your First Connection'");
                     setIsAddConnectionModalOpen(true);
                  }}
                  // Highlighted Card Style
                  className="w-full flex items-center text-left p-5 border-2 border-heartglow-pink dark:border-heartglow-pink rounded-xl bg-heartglow-pink/5 hover:bg-heartglow-pink/10 dark:hover:bg-heartglow-pink/20 ring-2 ring-heartglow-pink/50 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                >
                  <PersonIcon className="h-7 w-7 mr-4 text-heartglow-pink flex-shrink-0" />
                  <div className="flex-grow">
                     <span className="font-semibold text-base text-gray-800 dark:text-gray-200">Add Your First Connection</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Save contacts to easily message them later.</p>
                  </div>
                   <span className="text-xs font-medium text-white bg-heartglow-pink px-2 py-0.5 rounded-full ml-2">Recommended</span>
                </button>

                {/* Option 2: Explore Dashboard */}
                 <button 
                  onClick={() => handleCompleteOnboarding('dashboard')} 
                  // Standard Card Style
                   className="w-full flex items-center text-left p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:shadow-md transition-all duration-200 ease-in-out"
                 >
                  <DashboardIcon className="h-6 w-6 mr-4 text-indigo-500 flex-shrink-0" />
                  <div className="flex-grow">
                     <span className="font-medium text-gray-700 dark:text-gray-300">Explore Your Dashboard</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">See challenges, coaching, and more.</p>
                  </div>
                </button>

                {/* Option 3: Craft Another Message */}
                 <button 
                  onClick={() => handleCompleteOnboarding('create')} 
                  // Standard Card Style
                   className="w-full flex items-center text-left p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:shadow-md transition-all duration-200 ease-in-out"
                >
                  <Pencil2Icon className="h-6 w-6 mr-4 text-green-500 flex-shrink-0" />
                  <div className="flex-grow">
                     <span className="font-medium text-gray-700 dark:text-gray-300">Craft Another Message</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Use the full editor with more options.</p>
                  </div>
                </button>
            </div>
            {/* GlowGuide Hint */} 
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                 Confused? The 💡 guide explains each option.
              </p>
             <button 
               onClick={() => setCurrentStep(4)} // Go back 
               className="w-full sm:w-auto mt-6 px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
            >
              Back
            </button>
          </div>
        );
        break;
      default:
        stepContent = <div>Unknown Step</div>;
    }
    // --- Wrap step content with motion.div ---
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
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-heartglow-deepgray dark:to-gray-900 p-4 sm:p-6">
      <div className="bg-white dark:bg-heartglow-gray p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"> {/* Enhanced card style */}
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </div>
      {/* Render the modal outside the step animation */}
      <AddConnectionModal 
        isOpen={isAddConnectionModalOpen}
        onClose={() => setIsAddConnectionModalOpen(false)}
        onSave={handleSaveConnection}
      />
    </div>
  );
};

export default OnboardingFlowWrapper; 