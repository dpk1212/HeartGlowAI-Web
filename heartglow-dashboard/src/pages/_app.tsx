import '../styles/globals.css';
import '../styles/GlowGuide.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AccountLinkBanner from '../components/ui/AccountLinkBanner';
import OnboardingFlowWrapper from '../components/onboarding/OnboardingFlowWrapper';
import GlowGuideButton from '../components/onboarding/GlowGuideButton';
import GlowGuidePanel from '../components/onboarding/GlowGuidePanel';
import DashboardTour from '../components/ui/DashboardTour';

// Helper function to get route with base path
export function getRouteWithBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
}

// --- Add InnerApp component to use hooks ---
function InnerApp({ Component, pageProps, router }: AppProps & { router: AppProps['router'] }) {
  const { userProfile, loading, updateUserProfile } = useAuth();
  const [isGlowGuideOpen, setIsGlowGuideOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [isTourActiveDelayed, setIsTourActiveDelayed] = useState(false);

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

  // --- START: Onboarding Logic ---
  if (loading) {
    // Optional: Render a global loading spinner or minimal layout
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
      </div>
    );
  }

  const showOnboarding = userProfile && userProfile.hasCompletedOnboarding === false;
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

  return (
    <>
       {/* REMOVED conditional blur/brightness class from this wrapper */}
      <div> 
        {showOnboarding ? (
          <OnboardingFlowWrapper 
            currentStep={onboardingStep} 
            setCurrentStep={setOnboardingStep} 
          />
        ) : (
          <>
            <AccountLinkBanner />
            <Component {...pageProps} />
          </>
        )}
      </div>

      {/* DashboardTour now handles its own overlay/highlighting */}
      {showDashboardTour && (
        <DashboardTour 
          isActive={isTourActiveDelayed} 
          onComplete={handleCompleteTour} 
        />
      )}

      {/* Render GlowGuide persistently */}
      <GlowGuideButton 
        onClick={() => setIsGlowGuideOpen(true)} 
        pulse={showOnboarding} 
      />
      <GlowGuidePanel 
        isOpen={isGlowGuideOpen} 
        onClose={() => setIsGlowGuideOpen(false)} 
        isOnboarding={showOnboarding} 
        currentOnboardingStep={showOnboarding ? onboardingStep : undefined} 
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
        <InnerApp Component={Component} pageProps={pageProps} router={router} />
      </AuthProvider>
    </>
  );
} 