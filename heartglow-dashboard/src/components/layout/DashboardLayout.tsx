import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

// Helper function to add basePath
const getRouteWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
                <div className="hidden md:block">
                  <span className="text-sm text-gray-300">{currentUser.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-heartglow-deepgray hover:bg-heartglow-indigo px-4 py-2 rounded-full text-sm transition-colors duration-200 flex items-center"
                  aria-label="Sign out of your account"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-heartglow-charcoal text-white py-6 mt-auto">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold bg-gradient-to-r from-heartglow-pink to-heartglow-violet bg-clip-text text-transparent">
                HeartGlow
              </span>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} HeartGlow AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout; 