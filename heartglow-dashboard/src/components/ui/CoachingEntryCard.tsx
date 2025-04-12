import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './card'; // Assuming shadcn card component
// import { Button } from './button'; // Removed shadcn button import
import { Zap } from 'lucide-react'; // Example icon

const CoachingEntryCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border-purple-200 dark:border-purple-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800 dark:text-gray-100">
          <Zap className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
          AI Coaching
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Enhance your communication skills with personalized feedback and guidance.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href="/coaching" passHref legacyBehavior>
          {/* Replaced shadcn Button with standard button + Tailwind */}
          <a className="w-full">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-purple-300 dark:border-purple-700 text-sm font-medium rounded-md shadow-sm text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
              Start Coaching Session
            </button>
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CoachingEntryCard; 