import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';

export const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-primary">HeartGlowAI</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Create heartfelt messages that strengthen your relationships. Let AI help you express your feelings in the most meaningful way.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/signup"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              to="/login"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">AI-Powered Messages</h3>
            <p className="mt-2 text-base text-gray-500">
              Generate personalized messages that resonate with your loved ones.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Save & Organize</h3>
            <p className="mt-2 text-base text-gray-500">
              Keep track of your messages and organize them by relationship.
            </p>
          </div>

          <div className="card">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Learn & Improve</h3>
            <p className="mt-2 text-base text-gray-500">
              Get feedback and suggestions to improve your communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 