import { Link } from 'react-router-dom';
import { HeartIcon, SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export const Home = () => {
  return (
    <div className="gradient-bg min-h-screen w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <HeartIcon className="h-24 w-24 text-white/30" />
            </div>
            <div className="relative z-10 p-2">
              <h1 className="text-5xl font-extrabold text-white text-center">
                HeartGlow<span className="font-light">AI</span>
              </h1>
            </div>
          </div>
          <p className="text-xl text-white text-center max-w-2xl">
            Nurture your relationships with AI-powered insights and thoughtful message crafting
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-card p-8 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600/30 p-3 rounded-2xl mr-4">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Message Spark</h2>
            </div>
            <p className="text-white/90 mb-6">
              Generate thoughtful, personalized messages for your loved ones with AI assistance. Perfect for special occasions or just to show you care.
            </p>
            <Link
              to="/messagespark"
              className="btn-secondary"
            >
              Craft a Message
            </Link>
          </div>

          <div className="glass-card p-8 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-6">
              <div className="bg-pink-600/30 p-3 rounded-2xl mr-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Relationship Coach</h2>
            </div>
            <p className="text-white/90 mb-6">
              Get personalized advice and insights to strengthen your relationships. Learn effective communication strategies and emotional intelligence.
            </p>
            <Link
              to="/dashboard"
              className="btn-secondary"
            >
              Get Insights
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="max-w-md mx-auto glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-white/90 font-medium py-3 px-4 rounded-xl text-center"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600/70 text-white hover:bg-blue-600/60 font-medium py-3 px-4 rounded-xl text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 