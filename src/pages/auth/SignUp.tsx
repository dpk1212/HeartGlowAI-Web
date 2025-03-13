import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HeartIcon } from '@heroicons/react/24/outline';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-teal-400 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <HeartIcon className="h-20 w-20 text-white/30" />
              </div>
              <div className="relative z-10 p-1">
                <h1 className="text-4xl font-extrabold text-white">
                  HeartGlow<span className="font-light">AI</span>
                </h1>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-medium text-white">Create Your Account</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg">
            <p className="text-white text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-blue-600 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Creating Account...' : 'SIGN UP'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-white hover:text-white/80 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}; 