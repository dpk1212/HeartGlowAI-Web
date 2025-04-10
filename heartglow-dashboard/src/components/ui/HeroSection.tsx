import React from 'react';
import Link from 'next/link';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

const HeroSection = () => {
  return (
    <div className="bg-white dark:bg-heartglow-deepgray rounded-xl shadow-lg p-8 mb-12 border border-gray-100 dark:border-gray-800 overflow-hidden relative transform transition-all duration-300 hover:shadow-xl">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-heartglow-pink/10 to-heartglow-violet/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-heartglow-indigo/10 to-heartglow-violet/10 rounded-full -ml-24 -mb-24 blur-xl"></div>
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite leading-tight">
          Say what matters. <span className="text-heartglow-pink">Gently.</span>
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-xl mx-auto">
          Craft AI-powered messages for tough conversations. Reconnect, apologize, or open up
          — without overthinking it.
        </p>
        
        <Link 
          href={getRouteWithBasePath("/create")}
          className="inline-flex items-center justify-center bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-violet hover:to-heartglow-indigo text-white font-medium rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          aria-label="Start creating a new message"
        >
          <span className="mr-2">Start a New Message</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Be authentic. Be thoughtful. Be yourself.
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 