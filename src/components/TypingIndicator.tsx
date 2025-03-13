import React, { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  message?: string;
  className?: string;
}

/**
 * Displays an animated typing indicator with optional message
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  message = "Generating heartfelt message", 
  className = "" 
}) => {
  const [dots, setDots] = useState('');
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Animation phase for the heart
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 6);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative mb-5">
        {/* Animated Heart SVG */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse"
        >
          <path
            d="M40 65.6667C40 65.6667 10 48.3333 10 27.5C10 20.5 15.5 13.3333 24 13.3333C32.5 13.3333 40 21.6667 40 21.6667C40 21.6667 47.5 13.3333 56 13.3333C64.5 13.3333 70 20.5 70 27.5C70 48.3333 40 65.6667 40 65.6667Z"
            fill="url(#heart-gradient)"
            stroke="#FF66B3"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="heart-gradient" x1="10" y1="13.3333" x2="70" y2="65.6667" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF66B3" />
              <stop offset="1" stopColor="#FF0066" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Animated circles/particles */}
        <div className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center`}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute h-2 w-2 rounded-full bg-pink-400 opacity-0 transition-all duration-300 ease-in-out`}
              style={{
                opacity: animationPhase === i ? 0.8 : 0,
                transform: `translate(${Math.sin(i * 60 * (Math.PI / 180)) * 35}px, ${Math.cos(i * 60 * (Math.PI / 180)) * 35}px) scale(${animationPhase === i ? 1.5 : 0})`,
              }}
            />
          ))}
        </div>
        
        {/* Pulse effect */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute top-0 left-0 right-0 bottom-0 rounded-full border border-pink-400 opacity-0"
            style={{
              animation: `ping ${2 * i}s cubic-bezier(0, 0, 0.2, 1) infinite ${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-gray-700 text-xl font-medium mb-1">{message}{dots}</p>
        <p className="text-gray-500 text-sm">Crafting the perfect words for your relationship</p>
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

/**
 * Provides a full overlay with typing indicator for async operations
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/95 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300">
      <div className="max-w-md w-full p-8 rounded-lg shadow-lg bg-white border border-pink-100">
        <TypingIndicator message={message} />
      </div>
    </div>
  );
}; 