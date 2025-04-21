import React, { useState } from 'react';
// import { LightBulbIcon } from '@radix-ui/react-icons'; // Example icon
import '../../styles/GlowGuide.css'; // Import the CSS file

interface GlowGuideButtonProps {
    onClick: () => void;
    pulse?: boolean; // Add optional pulse prop
}

const GlowGuideButton: React.FC<GlowGuideButtonProps> = ({ onClick, pulse }) => {
  return (
    <button 
      onClick={onClick}
      // Conditionally apply pulse class
      className={`glow-guide-button ${pulse ? 'pulse-animation' : ''}`}
      aria-label="Open Glow Guide"
    >
      {/* Placeholder for Icon */}
      <span role="img" aria-label="Lightbulb">💡</span> 
      {/* <LightBulbIcon className="w-6 h-6" /> */}
    </button>
  );
};

export default GlowGuideButton; 