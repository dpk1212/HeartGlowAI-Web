import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/50 backdrop-blur-sm">
      <div className="bg-white/20 rounded-3xl p-8 flex flex-col items-center max-w-md mx-auto text-center">
        <div className="relative mb-4">
          {/* Animated heart */}
          <div className="animate-pulse">
            <HeartIcon className="h-16 w-16 text-white" />
          </div>
          
          {/* Pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-24 h-24 bg-white/10 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Animated dots */}
        <p className="text-xl font-medium text-white mb-2">{message}</p>
        <div className="flex space-x-2 mt-2">
          <div className="h-3 w-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="h-3 w-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          <div className="h-3 w-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
        </div>
      </div>
    </div>
  );
}; 