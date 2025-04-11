import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

const HeroSection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-heartglow-deepgray rounded-xl shadow-lg p-8 mb-12 border border-gray-100 dark:border-gray-800 overflow-hidden relative transform transition-all duration-300 hover:shadow-xl"
    >
      {/* Background decorative elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-heartglow-pink/10 to-heartglow-violet/10 rounded-full -mr-32 -mt-32 blur-2xl"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-heartglow-indigo/10 to-heartglow-violet/10 rounded-full -ml-24 -mb-24 blur-xl"
      ></motion.div>
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite leading-tight"
        >
          Say what matters. <span className="text-heartglow-pink">Gently.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-xl mx-auto"
        >
          Craft AI-powered messages for tough conversations. Reconnect, apologize, or open up
          — without overthinking it.
        </motion.p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href={getRouteWithBasePath("/create")}
              className="inline-flex items-center justify-center bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-violet hover:to-heartglow-indigo text-white font-medium rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:shadow-glow group"
              aria-label="Start creating a new message"
            >
              <span className="mr-2">Start a New Message</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-pulse-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={getRouteWithBasePath("/#templates")}
              className="text-heartglow-indigo dark:text-heartglow-pink font-medium hover:underline inline-flex items-center group"
              aria-label="Explore message templates"
            >
              <span>Need help deciding?</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-sm text-gray-500 dark:text-gray-400"
        >
          Be authentic. Be thoughtful. Be yourself.
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-light"
        >
          Not sure what to say? Try a message template below ⬇️
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection; 