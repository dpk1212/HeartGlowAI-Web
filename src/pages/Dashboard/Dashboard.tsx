import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, SparklesIcon, ChatBubbleLeftRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderTabs = () => {
    const tabs = [
      { id: 'today', label: 'Today' },
      { id: 'weekly', label: 'Weekly' },
      { id: 'monthly', label: 'Monthly' },
      { id: 'yearly', label: 'Yearly' },
    ];

    return (
      <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600'
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-teal-400 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex items-center">
            <div className="bg-blue-600/30 p-3 rounded-full mr-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User avatar'}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.displayName || 'Friend'}
              </h1>
              <p className="text-white/80">Your relationship insights are looking good!</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-white/10 rounded-full h-4 w-full mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-teal-500 h-4 rounded-full"
                style={{ width: '38%' }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Beginner Level</span>
              <span className="text-white/80 text-sm">XP 380/1000</span>
            </div>
          </div>
        </div>

        {renderTabs()}

        <div className="space-y-6">
          <div className="bg-blue-500/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <SparklesIcon className="h-6 w-6 text-white mr-2" />
                <h2 className="text-xl font-bold text-white">Recent Messages</h2>
              </div>
              <span className="text-xs text-white/80 bg-white/20 py-1 px-3 rounded-full">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <p className="text-white/90 mb-4">
              You've crafted 3 heartfelt messages this week. Your loved ones appreciate your thoughtfulness!
            </p>
            <Link
              to="/messagespark"
              className="block w-full bg-white/30 hover:bg-white/40 text-white font-medium py-3 px-4 rounded-xl text-center"
            >
              Craft a New Message
            </Link>
            <button className="absolute top-4 right-4 text-white hover:text-white/80">
              <StarIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-teal-500/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white mr-2" />
                <h2 className="text-xl font-bold text-white">Communication Tips</h2>
              </div>
              <span className="text-xs text-white/80 bg-white/20 py-1 px-3 rounded-full">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <p className="text-white/90 mb-4">
              Active listening is key to deeper relationships. Try reflecting back what you hear to show understanding.
            </p>
            <button className="block w-full bg-white/30 hover:bg-white/40 text-white font-medium py-3 px-4 rounded-xl text-center">
              Get More Tips
            </button>
            <button className="absolute top-4 right-4 text-white hover:text-white/80">
              <StarIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 