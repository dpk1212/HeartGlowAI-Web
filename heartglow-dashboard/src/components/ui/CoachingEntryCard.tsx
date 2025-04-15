import React from 'react';
import Link from 'next/link';
// import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './card'; // Removed shadcn card import
// import { Button } from './button'; // Removed shadcn button import
import { Heart } from 'lucide-react'; // Changed from Zap to Heart icon

const CoachingEntryCard: React.FC = () => {
  return (
    // Replaced Card with div and Tailwind classes
    <div className="rounded-lg border border-rose-200 dark:border-rose-800/50 bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
      {/* Replaced CardHeader with div */}
      <div className="mb-4">
        {/* Replaced CardTitle with div */}
        <div className="flex items-center text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
          <Heart className="mr-2 h-5 w-5 text-rose-600 dark:text-rose-400" />
          HeartGlow Guide
        </div>
        {/* Replaced CardDescription with div */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          More than a message — a moment of growth, connection, and care.
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
        Express yourself clearly, rebuild relationships, and nurture connections over time.
      </div>
      {/* Replaced CardFooter with div */}
      <div>
        <Link href="/coaching" passHref legacyBehavior>
          <a className="w-full">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-rose-300 dark:border-rose-700 text-sm font-medium rounded-md shadow-sm text-rose-700 dark:text-rose-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors">
              Connect with Your Guide
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CoachingEntryCard; 