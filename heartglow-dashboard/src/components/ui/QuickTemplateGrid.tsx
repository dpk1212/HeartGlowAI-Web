import React from 'react';
import Link from 'next/link';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

type Template = {
  id: string;
  title: string;
  description: string;
  intent: string;
  tone: string;
  icon: React.ReactNode;
};

const templates: Template[] = [
  {
    id: 'reconnect',
    title: 'Reconnect',
    description: 'Reach out to someone you\'ve lost touch with, in a thoughtful way.',
    intent: 'reconnect',
    tone: 'Sincere',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'thank-you',
    title: 'Thank You',
    description: 'Express gratitude that feels genuine and specific to the recipient.',
    intent: 'gratitude',
    tone: 'Warm',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'apologize',
    title: 'Apologize',
    description: 'Say sorry in a way that acknowledges impact and shows understanding.',
    intent: 'apology',
    tone: 'Sincere',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Offer encouragement that feels genuine and empathetic.',
    intent: 'support',
    tone: 'Empathetic',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 'celebrate',
    title: 'Celebrate',
    description: 'Join in someone\'s joy with a message that amplifies their happiness.',
    intent: 'celebration',
    tone: 'Excited',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'request',
    title: 'Request',
    description: 'Ask for something in a way that\'s clear, kind, and respectful.',
    intent: 'request',
    tone: 'Respectful',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
  }
];

const getToneColor = (tone: string): string => {
  switch (tone.toLowerCase()) {
    case 'sincere':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'warm':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'empathetic':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'excited':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'respectful':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

const TemplateCard: React.FC<{ template: Template; index: number }> = ({ template, index }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = getRouteWithBasePath(`/create?intent=${template.intent}&tone=${template.tone.toLowerCase()}`);
    }
  };

  return (
    <Link 
      href={getRouteWithBasePath(`/create?intent=${template.intent}&tone=${template.tone.toLowerCase()}`)}
      className="bg-white dark:bg-heartglow-deepgray p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col group transform hover:-translate-y-1 hover:scale-105 animate-fadeIn hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-heartglow-pink focus:ring-opacity-50"
      style={{ animationDelay: `${index * 100}ms` }}
      aria-label={`Use ${template.title} template with ${template.tone} tone`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-gradient-to-br from-heartglow-pink/20 to-heartglow-violet/20 text-heartglow-indigo dark:text-heartglow-pink group-hover:from-heartglow-pink/30 group-hover:to-heartglow-violet/30 transition-colors duration-300">
        {template.icon}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-heartglow-charcoal dark:text-heartglow-offwhite group-hover:text-heartglow-pink dark:group-hover:text-heartglow-pink transition-colors duration-300">
          {template.title}
        </h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getToneColor(template.tone)}`}>
          {template.tone}
        </span>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
        {template.description}
      </p>
      
      <div className="mt-4 text-heartglow-indigo dark:text-heartglow-pink text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Get started</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

const QuickTemplateGrid: React.FC = () => {
  return (
    <div className="mb-16" id="templates">
      <h2 className="text-2xl font-bold mb-6 text-heartglow-charcoal dark:text-heartglow-offwhite flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-heartglow-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Templates
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <TemplateCard key={template.id} template={template} index={index} />
        ))}
      </div>
    </div>
  );
};

export default QuickTemplateGrid;

// Add this CSS to globals.css or create a keyframes in _document.tsx
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn {
//   animation: fadeIn 0.5s ease-out forwards;
// } 