import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../pages/_app';
import UserProfileMenu from './UserProfileMenu';
import { fadeIn } from '../lib/animations';
import { getRouteWithBasePath } from '../pages/_app';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title = 'HeartGlow AI', 
  description = 'Say what matters. Gently.'
}: LayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  const isActive = (path: string) => {
    const currentPath = router.pathname;
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        {/* Add accessibility meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1C1C1E" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-heartglow-charcoal text-heartglow-offwhite p-4 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => router.push(getRouteWithBasePath('/dashboard'))}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-heartglow-indigo rounded-md p-1 mr-6"
                aria-label="Go to dashboard home"
              >
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-heartglow-pink to-heartglow-violet">
                  HeartGlow
                </h1>
              </button>
              
              {/* Navigation Links */}
              {user && (
                <nav className="hidden md:flex space-x-6">
                  <button
                    onClick={() => router.push(getRouteWithBasePath('/dashboard'))}
                    className={`text-sm transition-colors ${isActive('/dashboard') 
                      ? 'text-heartglow-violet font-medium' 
                      : 'text-heartglow-offwhite hover:text-heartglow-softpurple'}`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => router.push(getRouteWithBasePath('/connections'))}
                    className={`text-sm transition-colors ${isActive('/connections') 
                      ? 'text-heartglow-violet font-medium' 
                      : 'text-heartglow-offwhite hover:text-heartglow-softpurple'}`}
                  >
                    Connections
                  </button>
                </nav>
              )}
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <UserProfileMenu />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <motion.main 
          className="flex-grow page-container"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.main>

        {/* Footer */}
        <footer className="bg-heartglow-offwhite dark:bg-heartglow-charcoal py-6 border-t border-heartglow-softgray/20 dark:border-heartglow-deepgray">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm text-heartglow-deepgray dark:text-heartglow-softgray">
              &copy; {new Date().getFullYear()} HeartGlow AI. All rights reserved.
            </p>
            <div className="mt-2 flex justify-center space-x-4">
              <button 
                className="text-xs text-heartglow-deepgray/70 dark:text-heartglow-softgray/70 hover:text-heartglow-indigo transition-colors"
                onClick={() => router.push('/privacy')}
              >
                Privacy Policy
              </button>
              <button 
                className="text-xs text-heartglow-deepgray/70 dark:text-heartglow-softgray/70 hover:text-heartglow-indigo transition-colors"
                onClick={() => router.push('/terms')}
              >
                Terms of Service
              </button>
              <button 
                className="text-xs text-heartglow-deepgray/70 dark:text-heartglow-softgray/70 hover:text-heartglow-indigo transition-colors"
                onClick={() => router.push('/help')}
              >
                Help Center
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 