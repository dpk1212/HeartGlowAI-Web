import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react'; // Using lucide icon

const AccountLinkBanner: React.FC = () => {
  const { user, loading } = useAuth();

  // Don't show banner if loading, no user, or user is not anonymous
  if (loading || !user || !user.isAnonymous) {
    return null;
  }

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border-b border-yellow-300 dark:border-yellow-700 p-2 text-center text-sm text-yellow-800 dark:text-yellow-100 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-center space-x-2">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <span>
          All data will be lost when this page is closed.{' '}
          <Link href="/account/link" className="font-medium underline hover:text-yellow-900 dark:hover:text-yellow-50">
            Create a free permanent account.
          </Link>
        </span>
      </div>
      {/* Maybe add a subtle rolling animation later if desired */}
    </div>
  );
};

export default AccountLinkBanner; 