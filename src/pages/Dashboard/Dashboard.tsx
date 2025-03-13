import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  HeartIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('today');

  const renderTabs = () => {
    const tabs = [
      { id: 'today', label: 'Today' },
      { id: 'weekly', label: 'Weekly' },
      { id: 'monthly', label: 'Monthly' },
      { id: 'yearly', label: 'Yearly' },
    ];

    return (
      <div className="flex justify-between mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-2 px-3 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-white/80 hover:text-white'
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
    <div className="app-gradient min-h-screen">
      <div className="app-container">
        <header className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="h-10 w-10 rounded-full border-2 border-white"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </span>
                </div>
              )}
              
              <div>
                <p className="text-white font-medium">Welcome back, {user?.displayName || 'Friend'}</p>
                <p className="text-xs text-white/70">Your relationship insights are looking good!</p>
              </div>
            </div>
            <button className="text-white">
              <span className="sr-only">Menu</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4">
            <div className="bg-white/10 h-2 rounded-full w-full">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-white/70">Beginner Level</span>
              <span className="text-xs text-white/70">XP 380/500</span>
            </div>
          </div>
        </header>

        {renderTabs()}

        <div className="space-y-4">
          {/* First insight card */}
          <div className="app-card bg-blue-500/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-white mr-2" />
                  <h3 className="text-lg font-semibold text-white">Communication Insight</h3>
                </div>
                <div className="mt-2 text-sm text-white/90">
                  <p>Active listening improves relationships by 73%. Try repeating back what you hear to show understanding.</p>
                  
                  <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-semibold">
                    LEARN MORE
                  </button>
                </div>
              </div>
              <button className="text-white/80 hover:text-white">
                <HeartIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="text-right text-xs text-white/60 mt-2">
              Today
            </div>
          </div>

          {/* Second insight card */}
          <div className="app-card bg-teal-500/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-white mr-2" />
                  <h3 className="text-lg font-semibold text-white">Anniversary Reminder</h3>
                </div>
                <div className="mt-2 text-sm text-white/90">
                  <p>Your friend Sarah's birthday is coming up next week. Want to craft a special message for her?</p>
                  
                  <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-semibold">
                    CREATE MESSAGE
                  </button>
                </div>
              </div>
              <button className="text-white hover:text-white/80">
                <HeartIcon className="h-6 w-6 text-white/80" />
              </button>
            </div>
            <div className="text-right text-xs text-white/60 mt-2">
              3 days
            </div>
          </div>

          {/* MessageSpark Card */}
          <Link to="/messagespark" className="block">
            <div className="app-card bg-purple-500/30 transform transition hover:scale-[1.02]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <SparklesIcon className="h-5 w-5 text-white mr-2" />
                    <h3 className="text-lg font-semibold text-white">Create New Message</h3>
                  </div>
                  <div className="mt-2 text-sm text-white/90">
                    <p>Generate a thoughtful, personalized message for someone special with AI assistance.</p>
                    
                    <div className="mt-4 bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-semibold inline-block">
                      GET STARTED →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}; 