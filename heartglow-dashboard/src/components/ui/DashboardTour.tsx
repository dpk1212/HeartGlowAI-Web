import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardTourProps {
  isActive: boolean;
  onComplete: () => void;
}

// Define the steps (content and potentially target selectors/positions)
const tourSteps = [
  { step: 1, title: "Start Here!", text: "Ready to connect? ✨ This is your main starting point for crafting AI-powered messages.", targetElementId: null }, // Example: target element ID
  { step: 2, title: "Take on Challenges!", text: "🎯 These guided activities help you practice communication skills and earn GlowScore XP.", targetElementId: null },
  { step: 3, title: "Track Your Progress!", text: "📈 See your XP, communication streaks, and growth over time.", targetElementId: null },
  { step: 4, title: "Need Deeper Support?", text: "❤️ Access AI coaching sessions or helpful guides here anytime.", targetElementId: null },
  { step: 5, title: "Always Here to Help!", text: "✅ Click the 💡 GlowGuide anytime for tips related to what you're doing.", targetElementId: null },
];

const DashboardTour: React.FC<DashboardTourProps> = ({ isActive, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isActive) return null;

  const currentStepData = tourSteps[currentStepIndex];
  const isLastStep = currentStepIndex === tourSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleDone = () => {
    console.log("[Analytics] Dashboard Tour Completed");
    onComplete(); // Call the function passed from _app to update user profile
  };

  // TODO: Implement positioning logic based on targetElementId if needed

  return (
    // Overlay to capture clicks outside the tooltip (optional)
    <div className="fixed inset-0 z-[1100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
            <motion.div 
                key={currentStepData.step}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full text-center border border-gray-200 dark:border-gray-700"
            >
                 {/* Placeholder for arrow pointing to element */}
                 {/* <div className="absolute ... arrow-styles ..."></div> */}

                <h3 className="text-lg font-semibold text-heartglow-pink mb-3">{currentStepData.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">
                    {currentStepData.text}
                </p>
                
                <div className="flex justify-between items-center mt-4">
                    {/* Step Counter */}
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                        Step {currentStepData.step} of {tourSteps.length}
                    </span>

                    {/* Buttons */}
                    {isLastStep ? (
                        <button 
                            onClick={handleDone}
                            className="px-5 py-2 bg-heartglow-pink text-white font-semibold rounded-lg shadow-md hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-200"
                        >
                            Done
                        </button>
                    ) : (
                         <button 
                            onClick={handleNext}
                            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-200"
                         >
                            Next
                        </button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    </div>
  );
};

export default DashboardTour; 