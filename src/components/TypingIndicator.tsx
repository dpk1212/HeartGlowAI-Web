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

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex space-x-2 mb-4">
        <div className="w-3 h-3 bg-gradient-accent rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-gradient-accent rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="w-3 h-3 bg-gradient-accent rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
      </div>
      <p className="text-gray-600 italic">{message}{dots}</p>
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
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
      <TypingIndicator message={message} />
    </div>
  );
}; 