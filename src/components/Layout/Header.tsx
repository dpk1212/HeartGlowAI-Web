import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HeartIcon } from '@heroicons/react/24/solid';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <HeartIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                HeartGlowAI
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/messagespark" className="text-gray-700 hover:text-primary">
                  MessageSpark
                </Link>
                <button
                  onClick={logout}
                  className="btn-primary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}; 