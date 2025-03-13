import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';

export const Home = () => {
  return (
    <div className="app-gradient min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <HeartIcon className="h-32 w-32 text-white/20" />
              </div>
              <div className="relative z-10">
                <h1 className="text-5xl font-extrabold text-white text-center">
                  STRYVE
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="USERNAME"
            className="app-input uppercase text-center"
          />
          
          <input
            type="password"
            placeholder="PASSWORD"
            className="app-input uppercase text-center"
          />
          
          <Link
            to="/login"
            className="app-btn-primary uppercase font-bold mt-6 text-center"
          >
            LOG IN
          </Link>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Don't have an account? {' '}
              <Link to="/signup" className="font-medium text-white underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 