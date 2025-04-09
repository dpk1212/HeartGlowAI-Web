import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { onAuthStateChangedListener } from '../lib/auth';
import '../styles/globals.css';

// Simple auth context
import { createContext, useContext } from 'react';

type AuthContextType = {
  user: any | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

// Prefix for routing with the basePath
export const getRouteWithBasePath = (path: string): string => {
  // Handle paths for GitHub Pages deployment
  if (typeof window !== 'undefined') {
    // Extract the base directory from the current path
    const pathSegments = window.location.pathname.split('/');
    // For GitHub Pages, the first segment after the domain will be 'dashboard'
    if (pathSegments.includes('dashboard')) {
      // Ensure we don't duplicate the dashboard segment
      const cleanPath = path.startsWith('/dashboard') ? path.replace('/dashboard', '') : path;
      return `/dashboard${cleanPath}`.replace(/\/\/+/g, '/');
    }
  }
  
  // For development or SSR
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`.replace(/\/\/+/g, '/');
};

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      setLoading(false);
      
      // Redirect unauthenticated users from protected pages
      const path = router.pathname;
      if (!user && path !== '/login' && path !== '/signup' && path !== '/') {
        router.push(getRouteWithBasePath('/login'));
      }
    });

    return unsubscribe;
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

export default MyApp; 