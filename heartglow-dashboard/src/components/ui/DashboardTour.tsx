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

const TOOLTIP_PADDING = 15; // Space between target and tooltip
const VIEWPORT_PADDING = 10; // Minimum space from viewport edge

const DashboardTour: React.FC<DashboardTourProps> = ({ isActive, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
  const [arrowPosition, setArrowPosition] = useState<{ top?: string, bottom?: string, left?: string, right?: string, transform: string } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = tourSteps[currentStepIndex];
  const isLastStep = currentStepIndex === tourSteps.length - 1;

  useEffect(() => {
    if (isActive && currentStepData?.targetSelector) {
      const timer = setTimeout(() => {
        const targetElement = document.querySelector<HTMLElement>(currentStepData.targetSelector);
        
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          setTargetRect(rect);
          
          const tooltipWidth = tooltipRef.current?.offsetWidth || 300; // Estimate width
          const tooltipHeight = tooltipRef.current?.offsetHeight || 150; // Estimate height
          
          let topPos = rect.bottom + TOOLTIP_PADDING;
          let leftPos = rect.left + rect.width / 2;
          let transform = 'translateX(-50%)';
          let arrowStyle: typeof arrowPosition = { bottom: '100%', left: '50%', transform: 'translateX(-50%) rotate(180deg)' }; // Default arrow pointing up from bottom

          // Check vertical space
          if (topPos + tooltipHeight + VIEWPORT_PADDING > window.innerHeight) { // Not enough space below
            topPos = rect.top - tooltipHeight - TOOLTIP_PADDING; // Position above
            arrowStyle = { top: '100%', left: '50%', transform: 'translateX(-50%)' }; // Arrow pointing down from top
          }

          // Check horizontal space & adjust left/transform
          const maxLeft = window.innerWidth - tooltipWidth - VIEWPORT_PADDING;
          const minLeftCentered = VIEWPORT_PADDING + tooltipWidth / 2;
          const maxLeftCentered = window.innerWidth - VIEWPORT_PADDING - tooltipWidth / 2;
          
          if (leftPos < minLeftCentered) { // Too far left if centered
              leftPos = VIEWPORT_PADDING;
              transform = 'translateX(0%)';
              arrowStyle.left = `${rect.left + rect.width / 2 - VIEWPORT_PADDING}px`; // Adjust arrow horizontal position
          } else if (leftPos > maxLeftCentered) { // Too far right if centered
              leftPos = maxLeft;
              transform = 'translateX(0%)';
              // Adjust arrow pos based on final left and target center
              arrowStyle.left = `${rect.left + rect.width / 2 - maxLeft}px`;
          }

          // Clamp top position
          topPos = Math.max(VIEWPORT_PADDING, Math.min(topPos, window.innerHeight - tooltipHeight - VIEWPORT_PADDING));

          setTooltipPosition({
              top: `${topPos}px`,
              left: `${leftPos}px`,
              transform: transform,
          });
          setArrowPosition(arrowStyle);

        } else {
          console.warn(`DashboardTour: Target element not found: ${currentStepData.targetSelector}`);
          setTargetRect(null);
          setTooltipPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
          setArrowPosition(null);
        }
      }, 150); // Slightly longer delay to ensure styles/refs are ready

      return () => clearTimeout(timer);
    }
  }, [isActive, currentStepIndex, currentStepData]);

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

  // Calculate overlay style using clip-path for cutout effect
   const overlayPadding = 10; // Space around the highlighted element
   const overlayStyle: React.CSSProperties = targetRect ? {
       // Using clip-path for the cutout
       clipPath: `polygon(
         0% 0%, 0% 100%, 
         ${targetRect.left - overlayPadding}px 100%,
         ${targetRect.left - overlayPadding}px ${targetRect.top - overlayPadding}px,
         ${targetRect.right + overlayPadding}px ${targetRect.top - overlayPadding}px,
         ${targetRect.right + overlayPadding}px ${targetRect.bottom + overlayPadding}px,
         ${targetRect.left - overlayPadding}px ${targetRect.bottom + overlayPadding}px,
         ${targetRect.left - overlayPadding}px 100%,
         100% 100%, 100% 0%
       )`, 
   } : {
       // Default: cover everything if no target (shouldn't happen ideally)
       clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)',
   };

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    top: tooltipPosition.top,
    left: tooltipPosition.left,
    transform: tooltipPosition.transform,
    zIndex: 1150,
  };

  // Basic CSS Arrow Style
  const arrowBaseStyle: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: '8px',
  };
  const arrowFinalStyle: React.CSSProperties = arrowPosition ? {
      ...arrowBaseStyle,
      top: arrowPosition.top, // e.g., '100%' (points down) or undefined
      bottom: arrowPosition.bottom, // e.g., '100%' (points up) or undefined
      left: arrowPosition.left, // e.g., '50%' or calculated px value
      right: arrowPosition.right,
      transform: arrowPosition.transform, // e.g., 'translateX(-50%)'
      // Set border color based on direction (top border for down arrow, bottom for up)
      borderTopColor: arrowPosition.top === '100%' ? '#ffffff' : 'transparent', // White bg, TODO: dark mode color
      borderBottomColor: arrowPosition.bottom === '100%' ? '#ffffff' : 'transparent', // White bg, TODO: dark mode color
      // Dark mode arrow color (simple example, refine with theme vars)
      ...(document.documentElement.classList.contains('dark') && {
          borderTopColor: arrowPosition.top === '100%' ? 'rgb(31 41 55 / var(--tw-bg-opacity))' : 'transparent', // dark:bg-gray-800 color
          borderBottomColor: arrowPosition.bottom === '100%' ? 'rgb(31 41 55 / var(--tw-bg-opacity))' : 'transparent', // dark:bg-gray-800 color
      })
  } : {};

  return (
    // Overlay div now uses a background color for dimming
    <div 
      className="fixed inset-0 z-[1100] transition-opacity duration-300 bg-black/60 pointer-events-none" 
      style={overlayStyle} 
    >
      {/* Tooltip/Modal (positioned absolutely) */}
      <motion.div 
          ref={tooltipRef} 
          key={currentStepData.step}
          initial={{ opacity: 0, scale: 0.9 }} // Simplified animation
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 w-[90vw] sm:w-full sm:max-w-sm text-center border border-gray-200 dark:border-gray-700 pointer-events-auto" 
          style={tooltipStyle} 
      >
          {/* Arrow Element */}
          {arrowPosition && <div style={arrowFinalStyle}></div>}
          
          <h3 className="text-base sm:text-lg font-semibold text-heartglow-pink mb-2 sm:mb-3">{currentStepData.title}</h3>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-5 leading-relaxed">
              {currentStepData.text}
          </p>
          
          <div className="flex justify-between items-center mt-3 sm:mt-4">
              {/* Step Counter */}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                  Step {currentStepData.step} of {tourSteps.length}
              </span>

              {/* Buttons - Adjust padding/size for mobile? */}
              {isLastStep ? (
                  <button 
                      onClick={handleDone}
                      className="px-4 sm:px-5 py-2 text-sm sm:text-base bg-heartglow-pink text-white font-semibold rounded-lg shadow-md hover:bg-heartglow-violet focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-200"
                  >
                      Done
                  </button>
              ) : (
                   <button 
                      onClick={handleNext}
                      className="px-4 sm:px-5 py-2 text-sm sm:text-base bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-200"
                   >
                      Next
                  </button>
              )}
          </div>
      </motion.div>
    </div>
  );
};

export default DashboardTour; 