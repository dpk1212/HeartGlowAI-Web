import { Link } from 'react-router-dom';
import { HeartIcon, SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl">
        <div className="flex justify-center mb-6">
          <HeartIcon className="h-16 w-16 text-red-500 animate-heartbeat" />
        </div>
        
        <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 sm:text-6xl">
          <span className="text-primary">HeartGlow</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-start to-secondary-end">AI</span>
        </h1>
        
        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
          Create meaningful connections through heartfelt messages crafted with the help of AI. Express your emotions with clarity and authenticity.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 text-white bg-gradient-to-r from-secondary-start to-secondary-end hover:opacity-90 rounded-lg shadow-lg transition-all duration-200 font-medium text-lg flex items-center justify-center gap-2"
          >
            <SparklesIcon className="h-5 w-5" />
            Get Started
          </Link>
          
          <Link
            to="/login"
            className="w-full sm:w-auto mt-4 sm:mt-0 px-8 py-4 text-primary border-2 border-primary hover:bg-primary/5 rounded-lg font-medium text-lg flex items-center justify-center gap-2"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            Sign In
          </Link>
        </div>
      </div>
      
      <div className="mt-24 max-w-6xl w-full">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="card bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 p-8 rounded-xl">
            <div className="rounded-full bg-gradient-to-r from-primary to-primary/70 p-4 w-16 h-16 flex items-center justify-center mb-6">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Emotional Intelligence</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Our AI helps you express emotions in a way that resonates with your recipient's needs and feelings.
            </p>
          </div>

          <div className="card bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 p-8 rounded-xl">
            <div className="rounded-full bg-gradient-to-r from-secondary-start to-secondary-end p-4 w-16 h-16 flex items-center justify-center mb-6">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Perfect Messaging</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Create perfectly crafted messages for any relationship or situation in seconds.
            </p>
          </div>

          <div className="card bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 p-8 rounded-xl">
            <div className="rounded-full bg-gradient-to-r from-primary/70 to-secondary-start p-4 w-16 h-16 flex items-center justify-center mb-6">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Communication Growth</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Learn how to improve your communication skills with insights from every message you create.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 