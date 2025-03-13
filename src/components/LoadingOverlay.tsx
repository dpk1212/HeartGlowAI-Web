import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/60 backdrop-blur-sm">
      <div className="bg-white/10 rounded-2xl p-6 flex flex-col items-center max-w-sm mx-auto text-center animate-pulse">
        <HeartIcon className="h-14 w-14 text-white mb-4 animate-heartbeat" />
        <p className="text-lg font-medium text-white mb-2">{message}</p>
        <div className="flex space-x-2 mt-2">
          <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
        </div>
      </div>
    </div>
  );
}; 