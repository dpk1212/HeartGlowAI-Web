import React from 'react';
import '../../styles/GlowGuide.css'; // Import the CSS file

interface GlowGuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  isOnboarding?: boolean;
  currentOnboardingStep?: number;
}

const GlowGuidePanel: React.FC<GlowGuidePanelProps> = ({ 
  isOpen, 
  onClose, 
  isOnboarding, 
  currentOnboardingStep 
}) => {
  if (!isOpen) return null;

  const renderOnboardingContent = () => {
    switch (currentOnboardingStep) {
      case 1:
        return (
          <>
            <h3 className="font-semibold text-lg mb-2">Step 1: Welcome!</h3>
            <p className="text-sm mb-3">HeartGlow helps you express yourself clearly and kindly. Let's generate your first message draft!</p>
            <ul className="list-disc list-inside text-sm space-y-1">
                <li>Click "Get Started" to begin.</li>
                <li>This guide is always here if you need tips (click 💡).</li>
             </ul>
          </>
        );
      case 2:
         return (
          <>
            <h3 className="font-semibold text-lg mb-2">Step 2: Message Details</h3>
            <p className="text-sm mb-3">Just tell the AI who the message is for and the main goal. We'll handle the rest for now.</p>
             <ul className="list-disc list-inside text-sm space-y-1">
                <li>Be specific about the recipient (e.g., "My Mom", "My friend Sarah").</li>
                <li>Choose the intent that feels closest to your goal.</li>
                <li>Don't worry about tone/length yet - we use defaults for the first draft.</li>
             </ul>
          </>
        );
      case 3:
         return (
          <>
            <h3 className="font-semibold text-lg mb-2">Step 3: Your First Draft</h3>
            <p className="text-sm mb-3">The AI generated a starting point based on your input. It's not always perfect, but it's fast!</p>
             <ul className="list-disc list-inside text-sm space-y-1">
                <li>Read the draft - does it capture the feeling?</li>
                <li>Click "Continue" if it looks good, or "Try Again" to adjust your input.</li>
                <li>Remember, you can fully edit messages later in the main editor.</li>
             </ul>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="font-semibold text-lg mb-2">Step 4: AI Coaching</h3>
            <p className="text-sm mb-3">HeartGlow also offers AI coaching to help with tricky conversations or relationship goals.</p>
             <ul className="list-disc list-inside text-sm space-y-1">
                <li>You can start a coaching chat from the main dashboard later.</li>
                <li>It's like having a communication guide in your pocket.</li>
             </ul>
          </>
        );
      case 5:
        return (
          <>
            <h3 className="font-semibold text-lg mb-2">Step 5: Ready to Explore!</h3>
            <p className="text-sm mb-3">You've done it! Choose where you want to go next.</p>
             <ul className="list-disc list-inside text-sm space-y-1">
                <li>Adding connections makes messaging easier later.</li>
                <li>The Dashboard shows challenges, coaching access, and your progress.</li>
                <li>The full Message Editor offers more control (tone, length, etc.).</li>
             </ul>
          </>
        );
      default:
        return <p className="text-sm text-gray-600 dark:text-gray-400">Loading onboarding tips...</p>;
    }
  };

  const renderGeneralContent = () => {
     // Placeholder for general content when not onboarding
     // TODO: Make this route-aware or provide general help
      return (
          <>
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">General Tips</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Need help navigating HeartGlow? Here are some common topics.
            </p>
             <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>How to start a new message from the dashboard.</li>
              <li>Understanding your GlowScore.</li>
              <li>Starting an AI Coaching session.</li>
            </ul>
          </>
      );
  };

  return (
    <div className="glow-guide-panel-overlay" onClick={onClose}>
      <div className="glow-guide-panel-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="glow-guide-close-button" aria-label="Close Glow Guide">×</button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">GlowGuide</h2>
        
        {/* Conditionally render content */}
        <div className="mt-4">
          {isOnboarding ? renderOnboardingContent() : renderGeneralContent()}
        </div>

      </div>
    </div>
  );
};

export default GlowGuidePanel; 