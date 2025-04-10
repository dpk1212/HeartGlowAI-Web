import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';

// Helper function to get route with base path
export function getRouteWithBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
}

export default function App({ Component, pageProps }: AppProps) {
  // Force cache refresh on new deployments
  useEffect(() => {
    // Add a version timestamp to the window object for cache busting
    const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || Date.now().toString();
    window.localStorage.setItem('HeartGlowVersion', buildTimestamp);
    
    // Force reload if version differs
    const lastVersion = window.localStorage.getItem('HeartGlowLastVersion');
    if (lastVersion && lastVersion !== buildTimestamp) {
      window.localStorage.setItem('HeartGlowLastVersion', buildTimestamp);
      window.location.reload();
    } else {
      window.localStorage.setItem('HeartGlowLastVersion', buildTimestamp);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
} 