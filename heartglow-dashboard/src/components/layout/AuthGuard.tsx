import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // Only redirect if loading is complete and there's definitely no user
    if (!loading && !currentUser) {
      router.replace('/login');
    }
  }, [loading, currentUser, router]);

  // Show loading state while checking auth
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

  // If loading is complete and we have a user, show the children
  // If no user, the useEffect above will handle the redirect, 
  // and rendering null prevents rendering children briefly before redirecting.
  if (currentUser) {
    return <>{children}</>;
  }

  // If no user and loading is false, render null while redirecting
  return null;
};

export default AuthGuard; 