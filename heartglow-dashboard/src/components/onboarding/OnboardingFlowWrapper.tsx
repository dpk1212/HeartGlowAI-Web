import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
// Import the message generation function and type
import { generateMessage, MessageGenerationParams } from '../../lib/messageGenerator';
import { ChatBubbleIcon, DashboardIcon, PersonIcon, Pencil2Icon } from '@radix-ui/react-icons'; // Example Icons
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
        // --- Step 1: Welcome & Core Value ---
        stepContent = (
          <div className="text-center">
            {/* Optional: Add Logo/Illustration here */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Welcome to HeartGlow AI! ✨
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Effortlessly express yourself and build stronger connections. 
              Let's craft your first message in seconds.
            </p>
            {/* --- GlowGuide Hint --- */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8">
               Need help anytime? Click the 💡 icon!
            </p>
            <button 
              onClick={() => { console.log("[Analytics] Onboarding Action: Click 'Get Started'"); setCurrentStep(2); }} // Analytics
              className="w-full px-6 py-3 bg-heartglow-pink text-white font-semibold rounded-lg shadow-md hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
            >
              Get Started
            </button>
          </div>
        );
        // --- End Step 1 ---
        break;
      case 2:
        // --- Step 2: Guided Message Generation - Minimal Input ---
        stepContent = (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
              Craft Your First Message
            </h2>

            <div className="mb-6">
              <label htmlFor="recipientInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Who is this message for?
              </label>
              <input 
                type="text"
                id="recipientInput"
                value={onboardingData.recipientInput}
                onChange={(e) => setOnboardingData({ ...onboardingData, recipientInput: e.target.value })}
                placeholder="e.g., Friend, Mom, Partner, Colleague"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-heartglow-pink focus:border-heartglow-pink dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's the main goal?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coreIntents.map((intent) => (
                  <button 
                    key={intent.id}
                    onClick={() => setOnboardingData({ ...onboardingData, selectedIntent: intent.id })}
                    className={`flex items-center justify-center text-left p-3 border rounded-lg transition-colors duration-150 ${onboardingData.selectedIntent === intent.id 
                      ? 'bg-heartglow-pink/10 border-heartglow-pink ring-2 ring-heartglow-pink text-heartglow-pink dark:bg-heartglow-pink/20 dark:border-heartglow-pink/80 dark:text-heartglow-pink/90' 
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <span className="text-xl mr-2" role="img" aria-label={intent.label}>{intent.emoji}</span>
                    <span className="text-sm font-medium">{intent.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- GlowGuide Hint --- */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-6 text-center">
              Tip: Choose the goal that feels closest. Check 💡 for more guidance.
            </p>

            <button 
              onClick={handleGenerateFirstMessage}
              disabled={!onboardingData.recipientInput || !onboardingData.selectedIntent || isGenerating}
              className="w-full px-6 py-3 bg-heartglow-pink text-white font-semibold rounded-lg shadow-md hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            <button 
               onClick={() => setCurrentStep(1)} // Go back to previous step
               className="w-full mt-3 px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Back
            </button>
          </div>
        );
        // --- End Step 2 ---
        break;
      case 3:
        // --- Step 3: The "Aha!" Moment - Message Reveal ---
        stepContent = (
          <div className="text-center">
            {isGenerating ? ( // Should typically be false when reaching here, but handle just in case
              <div className="flex justify-center items-center p-8">
                 <svg className="animate-spin h-8 w-8 text-heartglow-pink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              </div>
            ) : generationError ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                  Oops! Couldn't Draft Message
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 p-3 rounded-md">
                  {generationError}
                </p>
                <button 
                  onClick={() => setCurrentStep(2)} // Go back to retry
                  className="w-full px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Try Again
                </button>
              </div>
            ) : generatedMessage ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Here's your first draft!
                </h2>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-left">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{generatedMessage}</p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Our AI crafted this based on your input. Feel free to edit it later, or continue onboarding.
                </p>
                {/* --- GlowGuide Hint --- */}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Not quite right? Check the 💡 guide for tips on refining prompts later.
                </p>
                <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                   <button 
                      onClick={() => setCurrentStep(2)} // Go back to retry/change input
                      className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => { console.log("[Analytics] Onboarding Action: Click 'Continue' from Step 3"); setCurrentStep(4); }} // Analytics
                      className="w-full sm:w-auto flex-1 px-6 py-3 bg-heartglow-pink text-white font-semibold rounded-lg shadow-md hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                    >
                      Continue
                    </button>
                </div>
              </div>
            ) : (
              // Should not happen if logic is correct, but as a fallback:
              <div>Loading message or an unexpected state occurred.</div>
            )}
          </div>
        );
        // --- End Step 3 ---
        break;
      case 4:
        // --- Step 4: Introduce Coaching (Briefly) ---
        stepContent = (
          <div className="text-center space-y-6">
             {/* Placeholder Icon */}
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <ChatBubbleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
             </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Need More Guidance?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Beyond single messages, our AI Coach can help you navigate 
              conversations and communication challenges.
               We'll show you where to find it on your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-2">
                <button 
                  onClick={() => setCurrentStep(3)} // Go back to previous step
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Back
                </button>
                <button 
                  onClick={() => { console.log("[Analytics] Onboarding Action: Click 'Got It' from Step 4"); setCurrentStep(5); }} // Analytics
                  className="w-full sm:w-auto flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-heartglow-gray transition duration-200 ease-in-out"
                >
                  Got It
                </button>
            </div>
          </div>
        );
        // --- End Step 4 ---
        break;
      case 5:
        // --- Step 5: Next Steps & Bridge to App ---
        stepContent = (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              You're Ready to Glow!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 pb-2">
              You've crafted your first message. Explore other features or continue refining your communication.
            </p>
            
            {/* Action Buttons/Cards */}
            <div className="space-y-4">
                {/* Option 1: Add Connection - Opens Modal */}
                <button 
                  onClick={() => {
                     console.log("[Analytics] Onboarding Action: Click 'Add Your First Connection'"); // Analytics
                     setIsAddConnectionModalOpen(true);
                  }}
                  className="w-full flex items-center text-left p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <PersonIcon className="h-6 w-6 mr-3 text-heartglow-pink" />
                  <div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">Add Your First Connection</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Save contacts to easily message them later.</p>
                  </div>
                </button>

                {/* Option 2: Explore Dashboard */}
                 <button 
                  onClick={() => handleCompleteOnboarding('dashboard')} 
                  className="w-full flex items-center text-left p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <DashboardIcon className="h-6 w-6 mr-3 text-indigo-500" />
                  <div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">Explore Your Dashboard</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">See challenges, coaching, and more.</p>
                  </div>
                </button>

                {/* Option 3: Craft Another Message */}
                 <button 
                  onClick={() => handleCompleteOnboarding('create')} 
                  className="w-full flex items-center text-left p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <Pencil2Icon className="h-6 w-6 mr-3 text-green-500" />
                  <div>
                     <span className="font-medium text-gray-800 dark:text-gray-200">Craft Another Message</span>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Use the full editor with more options.</p>
                  </div>
                </button>

                {/* Optional: Link to GlowGuide? Could be redundant with persistent button */}
            </div>
             <button 
               onClick={() => setCurrentStep(4)} // Go back to previous step
               className="w-full mt-6 px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Back
            </button>
          </div>
        );
        // --- End Step 5 ---
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
      <h1 className="text-2xl font-bold text-heartglow-pink mb-6">HeartGlow Onboarding</h1>
      <div className="bg-white dark:bg-heartglow-gray p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-lg overflow-hidden"> {/* Added overflow-hidden */}
        {/* AnimatePresence handles the exit animation */}
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