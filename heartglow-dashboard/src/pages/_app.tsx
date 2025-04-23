import '../styles/globals.css';
import '../styles/GlowGuide.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { PaywallProvider, usePaywall } from '../context/PaywallContext';
import PaywallModal from '../components/ui/PaywallModal';
import onboardingPaywallContent from '../components/ui/OnboardingPaywallContent';
import AccountLinkBanner from '../components/ui/AccountLinkBanner';
import DashboardTour from '../components/ui/DashboardTour';

// Helper function to get route with base path
export function getRouteWithBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
}

// --- Add InnerApp component to use hooks ---
function InnerApp({ Component, pageProps, router }: AppProps & { router: AppProps['router'] }) {
  const { userProfile, loading, updateUserProfile } = useAuth();
  const { isPaywallOpen, closePaywall } = usePaywall();
  const [isTourActiveDelayed, setIsTourActiveDelayed] = useState(false);
  // Track if paywall is shown after welcome
  const [isPostWelcome, setIsPostWelcome] = useState(false);

  // Listen for changes in localStorage to detect when paywall should be shown after welcome
  useEffect(() => {
    const handleStorageChange = () => {
      const shouldShowPaywall = localStorage.getItem('show-paywall-after-welcome');
      if (shouldShowPaywall === 'true') {
        setIsPostWelcome(true);
      } else {
        setIsPostWelcome(false);
      }
    };

    // Check on mount
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-window changes
    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, []);

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

  // --- START: Tour Delay Logic ---
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    const shouldShowTour = userProfile && userProfile.hasCompletedOnboarding === true && userProfile.hasSeenDashboardTour === false;

    if (shouldShowTour && !isTourActiveDelayed) {
      timerId = setTimeout(() => {
        setIsTourActiveDelayed(true);
      }, 500); // 500ms delay
    } else if (!shouldShowTour) {
      setIsTourActiveDelayed(false); // Reset if tour should not be shown
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [userProfile, isTourActiveDelayed]); // Depend on userProfile and the delayed state itself
  // --- END: Tour Delay Logic ---

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

  // Determine if the tour should show - based only on profile flags now
  const showDashboardTour = userProfile && userProfile.hasCompletedOnboarding === true && userProfile.hasSeenDashboardTour === false;

  // Function to mark tour as complete
  const handleCompleteTour = async () => {
    setIsTourActiveDelayed(false);
    try {
        await updateUserProfile({ hasSeenDashboardTour: true });
        // State will update via listener, no need to manually set state here
    } catch (error) {
        console.error("Failed to update profile after dashboard tour:", error);
        // Maybe show an error to the user
    }
  };

  // Custom onClose handler to reset the isPostWelcome flag
  const handleClosePaywall = () => {
    setIsPostWelcome(false);
    closePaywall();
  };

  // --- START: Onboarding Completion Logic (if needed) ---
  // We need to ensure new users eventually get `hasCompletedOnboarding` set to true
  // so the DashboardTour can trigger. Let's set it to true automatically
  // if it's false, now that the modal flow is removed.
  useEffect(() => {
    if (userProfile && userProfile.hasCompletedOnboarding === false) {
      console.log("Old onboarding flow removed. Marking onboarding as complete automatically.");
      updateUserProfile({ hasCompletedOnboarding: true });
      // Optionally, force the Dashboard Tour to start immediately for these users?
      // Or let the regular logic handle it after profile update.
    }
  }, [userProfile, updateUserProfile]);
  // --- END: Onboarding Completion Logic ---

  // --- START: Loading Check (Moved Here) ---
  if (loading) {
    // Apply gradient to loading screen as well for consistency
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-gradientFrom to-gradientTo">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
      </div>
    );
  }
  // --- END: Loading Check ---

  return (
    <>
      {/* Apply gradient, min-height, and default text color to this main wrapper div */}
      <div className="min-h-screen bg-gradient-to-tr from-gradientFrom to-gradientTo text-foreground"> 
        <AccountLinkBanner />
        <Component {...pageProps} />
      </div>

      {/* DashboardTour now handles its own overlay/highlighting */}
      {showDashboardTour && (
        <DashboardTour 
          isActive={isTourActiveDelayed} 
          onComplete={handleCompleteTour} 
        />
      )}

      {/* Render Paywall Modal Conditionally */}
      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={handleClosePaywall}
        content={isPostWelcome ? onboardingPaywallContent : undefined}
      />
    </>
  );
}

// --- Main App Component ---
export default function App({ Component, pageProps, router }: AppProps) {
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
        <PaywallProvider>
          <InnerApp Component={Component} pageProps={pageProps} router={router} />
        </PaywallProvider>
      </AuthProvider>
    </>
  );
} 