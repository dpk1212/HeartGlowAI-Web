import '../styles/globals.css';
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
  // --- START: Theme Handling --- 
  useEffect(() => {
    // Check localStorage first, then system preference
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Ensure localStorage is set if based on system pref
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Ensure localStorage is set
    }
    // NOTE: This assumes you have a way to SET 'theme' in localStorage elsewhere 
    //       (e.g., a theme toggle button). If not, it will primarily follow system pref.
  }, []);
  // --- END: Theme Handling ---

  // Force cache refresh on new deployments
  useEffect(() => {
    const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || Date.now().toString();
    const storedVersion = window.localStorage.getItem('HeartGlowVersion');
    const lastVersion = window.localStorage.getItem('HeartGlowLastVersion');

    if (storedVersion !== buildTimestamp || lastVersion !== buildTimestamp) {
       window.localStorage.setItem('HeartGlowVersion', buildTimestamp);
       window.localStorage.setItem('HeartGlowLastVersion', buildTimestamp);
       // Consider a less disruptive update mechanism if possible
       // window.location.reload(); 
       console.log('New version detected, consider refreshing for latest updates.');
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        <title>HeartGlow AI</title>
        <meta property="og:title" content="HeartGlow AI: Communicate Authentically, Connect Deeply" />
        <meta property="og:description" content="Struggling to express yourself? HeartGlow AI uses emotional intelligence to help you craft authentic messages, navigate tough conversations, and build stronger bonds. Say what matters, gently." />
        <meta property="og:image" content="https://heartglowai.com/assets/og-image.png" />
        <meta property="og:url" content="https://heartglowai.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
} 