import { Fragment, useRef } from 'react';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '../pages/_app';
import { logOut } from '../lib/auth';
import { getRouteWithBasePath } from '../pages/_app';

export default function UserProfileMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logOut();
      router.push(getRouteWithBasePath('/login'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitial = () => {
    if (!user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  const formatEmail = (email: string | null) => {
    if (!email) return '';
    // Mask part of the email for privacy if displayed publicly
    const [username, domain] = email.split('@');
    if (username.length <= 3) return email;
    return `${username.substring(0, 3)}...@${domain}`;
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-10">
      <div>
        <Menu.Button
          ref={buttonRef}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-heartglow-pink to-heartglow-violet text-white focus:outline-none focus:ring-2 focus:ring-heartglow-indigo"
          aria-label="User menu"
        >
          {getUserInitial()}
        </Menu.Button>
      </div>
      
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-heartglow-charcoal shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm text-heartglow-deepgray dark:text-heartglow-softgray truncate">
              Signed in as
            </p>
            <p className="text-sm font-medium text-heartglow-charcoal dark:text-heartglow-offwhite truncate" title={user.email || ''}>
              {user.email}
            </p>
          </div>
          
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-heartglow-softgray/30 dark:bg-heartglow-deepgray' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-heartglow-charcoal dark:text-heartglow-offwhite`}
                  onClick={() => router.push(getRouteWithBasePath('/profile'))}
                >
                  Your Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-heartglow-softgray/30 dark:bg-heartglow-deepgray' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-heartglow-charcoal dark:text-heartglow-offwhite`}
                  onClick={() => router.push(getRouteWithBasePath('/settings'))}
                >
                  Settings
                </button>
              )}
            </Menu.Item>
          </div>
          
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-heartglow-softgray/30 dark:bg-heartglow-deepgray' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-red-500`}
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 