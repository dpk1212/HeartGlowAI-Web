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
                <HeartIcon className="h-32 w-32 text-white/20 animate-heartbeat" />
              </div>
              <div className="relative z-10">
                <h1 className="text-5xl font-extrabold text-white text-center">
                  HeartGlow<span className="font-light">AI</span>
                </h1>
              </div>
            </div>
          </div>
          <p className="text-xl text-white/90 mt-4">
            Express your feelings with the perfect words
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            className="app-input text-center"
          />
          
          <input
            type="password"
            placeholder="Password"
            className="app-input text-center"
          />
          
          <Link
            to="/login"
            className="app-btn-primary font-bold mt-6 text-center"
          >
            Sign In
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