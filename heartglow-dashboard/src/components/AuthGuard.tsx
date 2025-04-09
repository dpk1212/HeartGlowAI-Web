import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../pages/_app';
import { getRouteWithBasePath } from '../pages/_app';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(getRouteWithBasePath('/login'));
    }
  }, [user, loading, router]);

  // Show loading indicator while checking auth state
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

  // Only render children when authenticated
  return user ? <>{children}</> : null;
} 