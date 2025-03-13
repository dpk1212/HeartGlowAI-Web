import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HeartIcon, 
  Bars3Icon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { signOutUser } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <HeartIcon className="h-8 w-8 text-pink-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              HeartGlowAI
            </span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/messagespark" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  MessageSpark
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="space-y-1 px-4">
            <Link 
              to="/dashboard" 
              className="block p-3 rounded-md text-gray-600 hover:bg-gray-50 font-medium"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/messagespark" 
              className="block p-3 rounded-md text-gray-600 hover:bg-gray-50 font-medium"
              onClick={toggleMenu}
            >
              MessageSpark
            </Link>
            <button 
              onClick={() => {
                handleSignOut();
                toggleMenu();
              }}
              className="flex w-full items-center p-3 rounded-md text-gray-600 hover:bg-gray-50 font-medium"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}; 