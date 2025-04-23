import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Footer from '../ui/Footer';
import { cn } from "@/lib/utils";

// Import shadcn/ui components & icons
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // navigationMenuTriggerStyle, // Removed for simpler link style
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, BrainCircuit, BarChart3, Sparkles } from 'lucide-react'; // Add new icons if preferred over emojis

// Helper function to get initials - simplified
const getInitials = (email: string): string => {
  if (!email) return '?';
  return email.substring(0, 2).toUpperCase() || '?';
};

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Simplified name logic for label
  const getUserLabel = (): string => {
    if (!currentUser?.email) return 'User';
    return currentUser.email;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      {/* Apply subtle background/blur to header */}
      <header className="bg-card/80 backdrop-blur-sm text-card-foreground border-b border-border/50 py-3 px-6 sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            href="/" // Link to main chat/dashboard
            className="flex items-center gap-2 group" // Added group for potential hover effects
            aria-label="HeartGlow Dashboard Home"
          >
            {/* Add subtle pulse animation to logo text */}
            <span className="text-2xl font-bold bg-gradient-to-r from-heartglow-pink to-heartglow-violet bg-clip-text text-transparent animate-pulse-subtle">
              HeartGlow
            </span>
          </Link>

          {/* Updated Navigation Menu */}
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList className="gap-2"> {/* Added gap */} 
              {/* Chat Link */}
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  {/* Use simple link style, add padding/hover manually */}
                  <NavigationMenuLink className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/50">
                    <BrainCircuit className="h-4 w-4" /> {/* Use icon */}
                    {/* Or 🧠 */}
                    Chat
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/* Insights Link (mapped to /growth for now) */}
              <NavigationMenuItem>
                <Link href="/growth" legacyBehavior passHref>
                  <NavigationMenuLink className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/50">
                    <BarChart3 className="h-4 w-4" /> {/* Use icon */}
                    {/* Or 📈 */}
                    Insights
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/* GlowScore Link (mapped to / for now, could be /glowscore) */}
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref> 
                  <NavigationMenuLink className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/50">
                    <Sparkles className="h-4 w-4" /> {/* Use icon */}
                    {/* Or ✨ */}
                    GlowScore
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* Add hover glow and transition to button */}
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full p-0 transition-shadow hover:shadow-glow focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <Avatar className="h-10 w-10 border-2 border-transparent">
                      <AvatarFallback className="bg-gradient-to-br from-heartglow-pink to-heartglow-violet text-white font-medium">
                        {getInitials(currentUser.email || '')}
                      </AvatarFallback>
                      {/* TODO: Add AvatarImage here if user profile pics are available */}
                      {/* <AvatarImage src={userProfile?.avatarUrl} alt="User avatar" /> */} 
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                {/* Dropdown content remains the same */}
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserLabel()}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Welcome Banner - Consider removing or integrating elsewhere if redundant */}
      {/* <div className="bg-white dark:bg-heartglow-deepgray py-4 px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-xl font-medium text-heartglow-charcoal dark:text-heartglow-offwhite">
            Hi {getFirstName()} — <span className="text-heartglow-pink">welcome to HeartGlow AI! Ready to reach out today?</span>
          </h1>
        </div>
      </div> */}

      {/* Main content */}
      <main className="flex-grow container mx-auto py-8 px-4">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout; 