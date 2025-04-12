import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (loading) {
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

  // If loading is complete but no user, redirect
  if (!currentUser) {
    // Use useEffect to avoid rendering during redirect state change
    React.useEffect(() => {
      router.replace('/login');
    }, [router]);
    return null; // Render nothing while redirecting
  }

  // If loading complete and user exists, show protected content
  return <>{children}</>;
};

export default AuthGuard; 