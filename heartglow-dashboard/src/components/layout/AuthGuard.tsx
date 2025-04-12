import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Perform redirect check only after initial loading is complete
    if (!loading && !currentUser) {
      console.log('AuthGuard: Not loading and no user, redirecting to /login');
      router.replace('/login'); 
    }
  }, [loading, currentUser, router]);

  // While loading, or if there's no user (and redirect is pending), render nothing.
  // A global loading indicator could be placed in _app.tsx or DashboardLayout if needed.
  if (loading || !currentUser) {
    return null; 
  }

  // Only render children when loading is false and a user exists.
  console.log('AuthGuard: Rendering children');
  return <>{children}</>; 
};

export default AuthGuard; 