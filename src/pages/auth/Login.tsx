import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HeartIcon } from '@heroicons/react/24/outline';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8">
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
          <h2 className="text-xl font-medium text-white">Sign in to Your Account</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg">
            <p className="text-white text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="input-field"
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
              className="input-field"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Signing in...' : 'LOG IN'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-white hover:text-white/80 underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/reset-password" className="text-xs text-white/80 hover:text-white">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}; 