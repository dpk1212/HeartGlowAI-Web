import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

const Footer: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize theme based on system preference or localStorage
  useEffect(() => {
    // Check if user has already set a preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-heartglow-deepgray py-8 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Copyright */}
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <svg className="h-8 w-8 text-heartglow-pink" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
              </svg>
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-heartglow-pink to-heartglow-violet">
                HeartGlow AI
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Crafting messages that connect hearts, powered by AI
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-auto">
              &copy; {currentYear} HeartGlow AI. All rights reserved.
            </p>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-heartglow-charcoal dark:text-heartglow-offwhite mb-3">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href={getRouteWithBasePath("/")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-heartglow-pink dark:hover:text-heartglow-pink transition-colors duration-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href={getRouteWithBasePath("/create")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-heartglow-pink dark:hover:text-heartglow-pink transition-colors duration-200">
                    Create Message
                  </Link>
                </li>
                <li>
                  <Link href={getRouteWithBasePath("/connections")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-heartglow-pink dark:hover:text-heartglow-pink transition-colors duration-200">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link href={getRouteWithBasePath("/messages")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-heartglow-pink dark:hover:text-heartglow-pink transition-colors duration-200">
                    Message History
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-heartglow-charcoal dark:text-heartglow-offwhite mb-3">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href={getRouteWithBasePath("/about")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-heartglow-pink dark:hover:text-heartglow-pink transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href={getRouteWithBasePath("/privacy")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-heartglow-pink dark:hover:text-heartglow-pink transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={getRouteWithBasePath("/terms")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-heartglow-pink dark:hover:text-heartglow-pink transition-colors duration-200">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href={getRouteWithBasePath("/contact")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-heartglow-pink dark:hover:text-heartglow-pink transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Social & Theme Toggle */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-heartglow-charcoal dark:text-heartglow-offwhite mb-3">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://twitter.com/heartglowai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-heartglow-pink transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://instagram.com/heartglowai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-heartglow-pink transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://github.com/heartglowai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-heartglow-pink transition-colors duration-200">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://linkedin.com/company/heartglowai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-heartglow-pink transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center">
                <button
                  onClick={toggleTheme}
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#A347FF' : '#E2E8F0'
                  }}
                  aria-pressed={theme === 'dark'}
                >
                  <span className="sr-only">Toggle theme</span>
                  <span 
                    className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    <span
                      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                        theme === 'dark' ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                      }`}
                      aria-hidden="true"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-heartglow-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    <span
                      className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                        theme === 'dark' ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                      }`}
                      aria-hidden="true"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-heartglow-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </span>
                  </span>
                </button>
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 