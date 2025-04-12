import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace('/login');
      }
      setAuthCheckComplete(true);
    }
    
    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!authCheckComplete) {
        console.warn('Auth guard timeout - forcing completion');
        setAuthCheckComplete(true);
        if (!currentUser) {
          router.replace('/login');
        }
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [currentUser, loading, router]);

  // Show loading state
  if (loading && !authCheckComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <h2 className="text-2xl font-medium text-heartglow-charcoal dark:text-heartglow-offwhite">
            Verifying your identity...
          </h2>
        </div>
      </div>
    );
  }

  // If not logged in, we're redirecting so don't show anything
  if (!currentUser) {
    return null;
  }

  // If logged in, show protected content
  return <>{children}</>;
};

export default AuthGuard; 