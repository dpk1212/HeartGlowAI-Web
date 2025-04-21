import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardTourProps {
  isActive: boolean;
  onComplete: () => void;
}

// Define the steps with target selectors
const tourSteps = [
  // NOTE: Selectors need to be added to the actual elements in index.tsx/components
  { step: 1, title: "Start Here!", text: "Ready to connect? ✨ This is your main starting point for crafting AI-powered messages.", targetSelector: "[data-tour-id='hero-start-message']" }, 
  { step: 2, title: "Take on Challenges!", text: "🎯 These guided activities help you practice communication skills and earn GlowScore XP.", targetSelector: "[data-tour-id='challenge-section']" },
  { step: 3, title: "Track Your Progress!", text: "📈 See your XP, communication streaks, and growth over time.", targetSelector: "[data-tour-id='glowscore-card']" },
  { step: 4, title: "Need Deeper Support?", text: "❤️ Access AI coaching sessions or helpful guides here anytime.", targetSelector: "[data-tour-id='coaching-card']" },
  { step: 5, title: "Always Here to Help!", text: "✅ Click the 💡 GlowGuide anytime for tips related to what you're doing.", targetSelector: ".glow-guide-button" }, // Use existing class for GlowGuide button
];

const DashboardTour: React.FC<DashboardTourProps> = ({ isActive, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // State for target element dimensions and tooltip position
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
  const tooltipRef = useRef<HTMLDivElement>(null); // Ref to measure the tooltip itself

  const currentStepData = tourSteps[currentStepIndex];
  const isLastStep = currentStepIndex === tourSteps.length - 1;

  // Effect to find target element and calculate positions
  useEffect(() => {
    if (isActive && currentStepData?.targetSelector) {
      // Timeout to allow DOM to update after step change/initial render
      const timer = setTimeout(() => {
        const targetElement = document.querySelector(currentStepData.targetSelector);
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          setTargetRect(rect);

          // --- Calculate Tooltip Position --- 
          // Simple example: position below the target, centered horizontally
          // Needs adjustment based on screen edges and tooltip size
          const tooltipHeight = tooltipRef.current?.offsetHeight || 150; // Estimate height
          const spaceBelow = window.innerHeight - rect.bottom;
          let topPos = rect.bottom + 15; // Default below
          
          // If not enough space below, position above
          if (spaceBelow < (tooltipHeight + 20)) { 
              topPos = rect.top - tooltipHeight - 15; // Position above
          }
          // Clamp top position to stay within viewport (rough)
          topPos = Math.max(10, Math.min(topPos, window.innerHeight - tooltipHeight - 10));

          let leftPos = rect.left + rect.width / 2; // Center horizontally
          
          setTooltipPosition({
              top: `${topPos}px`,
              left: `${leftPos}px`,
              transform: 'translateX(-50%)', // Center horizontally
          });
          // ----------------------------------

        } else {
          console.warn(`DashboardTour: Target element not found for selector: ${currentStepData.targetSelector}`);
          // Fallback to centered position if target not found
          setTargetRect(null);
          setTooltipPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
        }
      }, 100); // Small delay for DOM updates

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStepIndex, currentStepData]); // Rerun when step changes

  if (!isActive) return null;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleDone = () => {
    console.log("[Analytics] Dashboard Tour Completed");
    onComplete(); // Call the function passed from _app to update user profile
  };

  // Calculate overlay style using box-shadow for cutout effect
  const overlayStyle: React.CSSProperties = targetRect ? {
      boxShadow: `0 0 0 5000px rgba(0, 0, 0, 0.6)`, // Dim overlay
      clipPath: `polygon(
          0% 0%, 
          0% 100%, 
          ${targetRect.left - 5}px 100%, 
          ${targetRect.left - 5}px ${targetRect.top - 5}px, 
          ${targetRect.right + 5}px ${targetRect.top - 5}px, 
          ${targetRect.right + 5}px ${targetRect.bottom + 5}px, 
          ${targetRect.left - 5}px ${targetRect.bottom + 5}px, 
          ${targetRect.left - 5}px 100%, 
          100% 100%, 
          100% 0%
      )`, // Cutout (added 5px padding)
  } : {
      background: 'rgba(0, 0, 0, 0.6)', // Default dim if no target
  };

  // Tooltip position style
  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    top: tooltipPosition.top,
    left: tooltipPosition.left,
    transform: tooltipPosition.transform,
    zIndex: 1150, // Ensure tooltip is above overlay cutout mechanics
  };

  return (
    // Overlay div - applies the cutout effect
    <div 
      className="fixed inset-0 z-[1100] transition-opacity duration-300 pointer-events-none" // pointer-events-none on overlay
      style={overlayStyle} 
    >
      {/* Tooltip/Modal (positioned absolutely) */}
      <motion.div 
          ref={tooltipRef} // Add ref to measure tooltip
          key={currentStepData.step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full text-center border border-gray-200 dark:border-gray-700 pointer-events-auto" // Add pointer-events-auto here
          style={tooltipStyle} 
      >
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
          {/* TODO: Add arrow element based on position */}
      </motion.div>
    </div>
  );
};

export default DashboardTour; 