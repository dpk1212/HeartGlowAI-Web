import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon, ChatBubbleLeftRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { getMessages, Message } from '../../services/messages';

export const Dashboard = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const recentMessages = await getMessages(5);
        setMessages(recentMessages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.displayName || 'User'}!
            </h1>
            <p className="mt-1 text-gray-600">Here's what's happening with your messages</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-medium bg-gradient-accent text-white rounded-full">
              Beta User
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/messagespark"
          className="card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-accent p-3 rounded-lg">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">MessageSpark</h3>
              <p className="text-sm text-gray-600">Create a new message</p>
            </div>
          </div>
        </Link>

        <Link
          to="/saved-messages"
          className="card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-3 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Saved Messages</h3>
              <p className="text-sm text-gray-600">View your message history</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="card hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-3 rounded-lg">
              <UserCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
              <p className="text-sm text-gray-600">Update your preferences</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Messages */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Messages</h2>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {message.relationshipType}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {message.status} • {message.frequency}
                    </p>
                    <p className="mt-2 text-gray-600 line-clamp-2">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 border rounded-lg">
            <p className="text-gray-600">No messages yet. Start by creating one!</p>
          </div>
        )}
      </div>
    </div>
  );
}; 