import React, { useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface DashboardTourProps {
  isActive: boolean;
  onComplete: () => void;
}

// Define the steps for react-joyride
// Map existing steps to the Step interface
const steps: Step[] = [
  { // Step 1: Message Generation 
    target: "[data-tour-id='hero-start-message']", 
    content: "Ready to connect? ✨ This is your main starting point for crafting AI-powered messages.", 
    title: "Start Here!", 
    disableBeacon: true 
  },
  { // Step 2: GlowGuide
    target: "[data-tour-id='coaching-entry-card']",
    content: "✅ Click the 💡 HeartGlow Guide anytime for personalized coaching and tips.",
    title: "Always Here to Help!" 
  },
  { // Step 3: Connections (New Target)
    target: "[data-tour-id='connections-carousel']", // Updated target
    content: "🫂 Keep track of your important connections here for easy message drafting.", // Updated content
    title: "Your Connections" // Updated title
  },
  { // Step 4: Challenges 
    target: "[data-tour-id='challenge-section']", 
    content: "🎯 These guided activities help you practice communication skills and earn GlowScore XP.", 
    title: "Take on Challenges!" 
  },
  { // Step 5: GlowScore
    target: "[data-tour-id='glowscore-card']", 
    content: "📈 See your XP, communication streaks, and growth over time.", 
    title: "Track Your Progress!" 
  },
];

// Define basic theme styles
// Note: More complex styling might require CSS overrides or more granular style props
const joyrideStyles = {
  options: {
    primaryColor: '#F472B6', // heartglow-pink (example, adjust if needed)
    textColor: '#374151', // gray-700 (example, adjust if needed)
    arrowColor: '#FFFFFF', // white
    backgroundColor: '#FFFFFF', // white
    overlayColor: 'rgba(0, 0, 0, 0.6)', 
    zIndex: 1100,
  },
  tooltip: {
    borderRadius: '0.75rem', // rounded-xl
  },
  buttonNext: {
    backgroundColor: '#6366F1', // indigo-600 (example, adjust if needed)
    borderRadius: '0.5rem', // rounded-lg
    color: 'white',
    fontSize: '0.875rem', // text-sm
    padding: '0.5rem 1rem', // py-2 px-4
  },
  buttonBack: {
    color: '#4B5563', // gray-600
    fontSize: '0.875rem', // text-sm
    marginRight: '0.5rem',
  },
  buttonSkip: {
     color: '#6B7280', // gray-500
     fontSize: '0.75rem', // text-xs
  },
  buttonClose: {
      color: '#6B7280', // gray-500
  },
  // Dark mode considerations (Applied via class check for simplicity)
  ...(typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? {
      options: {
          primaryColor: '#F472B6', // Keep pink for highlight
          textColor: '#D1D5DB', // gray-300
          arrowColor: '#1F2937', // gray-800 
          backgroundColor: '#1F2937', // gray-800
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1100,
      },
       buttonNext: {
          backgroundColor: '#4F46E5', // indigo-500 
          borderRadius: '0.5rem', 
          color: 'white',
          fontSize: '0.875rem', 
          padding: '0.5rem 1rem',
      },
      buttonBack: {
          color: '#9CA3AF', // gray-400
          fontSize: '0.875rem',
          marginRight: '0.5rem',
      },
      buttonSkip: {
         color: '#6B7280', // gray-500
         fontSize: '0.75rem', 
      },
      buttonClose: {
          color: '#9CA3AF', // gray-400
      },
  } : {}),
};


const DashboardTour: React.FC<DashboardTourProps> = ({ isActive, onComplete }) => {

  // Callback function to handle tour events
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      // Tour finished or skipped
      console.log(`[Analytics] Dashboard Tour Ended: ${status}`);
      onComplete(); // Call the original onComplete prop
    }

    // You can add more event handling here if needed (e.g., ACTION.NEXT, EVENT.STEP_AFTER)
    // console.log("Joyride Callback Data:", data); 
  };

  // Log when isActive changes
  useEffect(() => {
      console.log("DashboardTour isActive state:", isActive);
  }, [isActive]);

  // The Joyride component now handles its own visibility based on the `run` prop
  return (
    <Joyride
      steps={steps}
      run={isActive} // Control the tour with the isActive prop
      callback={handleJoyrideCallback}
      continuous // Go to next step on button click
      showProgress // Show step count (e.g., 1/5)
      showSkipButton // Allow users to skip the tour
      scrollToFirstStep // Ensure the first step is visible
      disableScrolling={false} // Allow user scrolling while tour is active if needed
      styles={joyrideStyles} // Apply custom styles
      // Other helpful props:
      // disableOverlayClose={true} // Prevent closing by clicking overlay
      // spotlightClicks={true} // Allow clicking elements in the spotlight
      // Floater props for advanced positioning customization if needed
    />
  );
};

export default DashboardTour; 