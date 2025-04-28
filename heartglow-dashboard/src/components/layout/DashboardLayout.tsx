import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon, ArrowLeftOnRectangleIcon, UserCircleIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, HomeIcon } from '@heroicons/react/24/outline'; // Added HomeIcon
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  onNavigateToGuides?: () => void; // Add new prop
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onNavigateToGuides }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, userProfile } = useAuth();
  const router = useRouter();

  // --- Navigation items ---
  const navigation = [
    // { name: 'Dashboard', href: '/', icon: HomeIcon, current: router.pathname === '/' },
    { name: 'Guides', onClick: onNavigateToGuides, icon: HomeIcon, current: false }, // New Guides item
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon, current: router.pathname.startsWith('/chat') },
    { name: 'Connections', href: '/connections', icon: UserCircleIcon, current: router.pathname.startsWith('/connections') },
    // Add other main navigation items here if needed
  ];

  // --- Handle Logout ---
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally show an error message to the user
    }
  };

  // --- Determine User Initial for Fallback ---
  const getUserInitial = (name?: string | null) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E1A] to-[#14141F] flex flex-col">
      {/* Static header */}
      <header className="sticky top-0 z-30 bg-[#13131D]/80 backdrop-blur-md border-b border-[#2A2A40]/30 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                 <Link href="/" legacyBehavior>
                   <a className="flex items-center space-x-2">
                     <img
                       className="h-8 w-auto"
                       src="/assets/heartglow-logo-mark-pink.svg" 
                       alt="HeartGlow AI"
                     />
                     <span className="text-xl font-bold text-white hidden sm:inline">HeartGlow</span>
                   </a>
                 </Link>
              </div>
            </div>
            {/* Centered Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {navigation.map((item) => (
                item.href ? (
                  <Link key={item.name} href={item.href} legacyBehavior>
                    <a
                      className={cn(
                        'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                        item.current
                          ? 'bg-heartglow-pink/10 text-heartglow-pink'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      {item.name}
                    </a>
                  </Link>
                ) : (
                  <Button
                    key={item.name}
                    variant="ghost"
                    onClick={item.onClick} // Use onClick for non-href items
                    className={cn(
                      'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                      item.current // Note: 'current' might not make sense for onClick actions
                        ? 'bg-heartglow-pink/10 text-heartglow-pink' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <item.icon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Button>
                )
              ))}
            </div>
            <div className="ml-6 flex items-center">
              {/* Help Icon */}
              <Link href="/support" legacyBehavior>
                 <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/40 focus:ring-offset-2 focus:ring-offset-[#13131D] mr-3">
                  <span className="sr-only">Help & Support</span>
                  <QuestionMarkCircleIcon className="h-6 w-6" aria-hidden="true" />
                </Button>
              </Link>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="rounded-full focus:outline-none focus:ring-2 focus:ring-heartglow-pink/40 focus:ring-offset-2 focus:ring-offset-[#13131D]">
                    <span className="sr-only">Open user menu</span>
                    <Avatar className="h-8 w-8 border border-white/10">
                       <AvatarImage src={currentUser?.photoURL || undefined} alt={userProfile?.displayName || 'User'} />
                       <AvatarFallback className="bg-gradient-to-br from-heartglow-pink to-heartglow-violet font-semibold text-white">
                         {getUserInitial(userProfile?.displayName)}
                       </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#1A1A2E] border-[#2A2A40] text-gray-200 shadow-xl">
                  <DropdownMenuLabel className="text-sm font-medium text-white px-2 py-1.5">{userProfile?.displayName || 'My Account'}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#2A2A40]/50" />
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-heartglow-pink/10 focus:text-heartglow-pink">
                    <Link href="/profile">
                       <UserCircleIcon className="mr-2 h-4 w-4" />
                       <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-heartglow-pink/10 focus:text-heartglow-pink">
                     <Link href="/settings">
                       <Cog6ToothIcon className="mr-2 h-4 w-4" />
                       <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2A2A40]/50"/>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-red-500/20 focus:text-red-400">
                    <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */} 
      <main className="flex-1 py-4 md:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 