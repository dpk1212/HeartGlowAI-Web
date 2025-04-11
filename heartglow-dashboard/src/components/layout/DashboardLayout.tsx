import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Footer from '../ui/Footer';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

// Helper function to get initials from email
const getInitials = (email: string): string => {
  if (!email) return '?';
  const parts = email.split('@');
  return parts[0].substring(0, 2).toUpperCase();
};

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user's first name from email for welcome message
  const getFirstName = (): string => {
    if (!currentUser?.email) return 'there';
    const name = currentUser.email.split('@')[0];
    // Capitalize first letter and handle special characters
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9]/g, ' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-heartglow-offwhite dark:bg-heartglow-charcoal">
      {/* Header */}
      <header className="bg-heartglow-charcoal text-white py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            href={getRouteWithBasePath("/dashboard")} 
            className="flex items-center gap-2"
            aria-label="HeartGlow Dashboard Home"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-heartglow-pink to-heartglow-violet bg-clip-text text-transparent">
              HeartGlow
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link 
              href={getRouteWithBasePath("/dashboard")} 
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Dashboard"
            >
              Dashboard
            </Link>
            <Link 
              href={getRouteWithBasePath("/create")} 
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Create a new message"
            >
              Create
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {currentUser && (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                    aria-label="User menu"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-heartglow-pink to-heartglow-violet flex items-center justify-center text-white font-medium shadow-lg hover:shadow-glow transition-all duration-300">
                      {getInitials(currentUser.email || '')}
                    </div>
                    <span className="hidden md:flex items-center text-sm text-white gap-1 font-medium">
                      Hi {getFirstName()} <span className="animate-wiggle">👋</span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-heartglow-deepgray rounded-lg shadow-lg py-2 z-20 border border-gray-100 dark:border-gray-800 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-medium text-heartglow-charcoal dark:text-white">{currentUser.email}</p>
                      </div>
                      <Link 
                        href={getRouteWithBasePath("/profile")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link 
                        href={getRouteWithBasePath("/settings")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-white dark:bg-heartglow-deepgray py-4 px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-xl font-medium text-heartglow-charcoal dark:text-heartglow-offwhite">
            Hi {getFirstName()} — <span className="text-heartglow-pink">welcome to HeartGlow AI! Ready to reach out today?</span>
          </h1>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout; 