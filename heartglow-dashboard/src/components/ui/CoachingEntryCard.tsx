import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './card'; // Assuming shadcn card component
import { Button } from './button'; // Assuming shadcn button component
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
          <Button variant="outline" className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200">
            Start Coaching Session
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CoachingEntryCard; 