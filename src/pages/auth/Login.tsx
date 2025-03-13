import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { signIn } from '../../services/auth';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = 'Failed to login. Please try again.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-heartglow-gradient min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute w-32 h-32 bg-white/10 rounded-full"
        style={{ top: '20%', left: '15%' }}
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-40 h-40 bg-white/10 rounded-full"
        style={{ bottom: '15%', right: '10%' }}
        animate={{ y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-10 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-center mb-5">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <HeartIcon className="h-20 w-20 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">HeartGlowAI</h1>
          <p className="text-white/90 text-lg">Express your feelings with the perfect words</p>
        </motion.div>
        
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
          
          {error && (
            <motion.div
              className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="app-input-icon-wrapper">
              <input
                type="email"
                className="app-input app-input-with-icon"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <EnvelopeIcon className="app-input-icon" />
            </div>
            
            <div className="app-input-icon-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="app-input app-input-with-icon"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-500"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="text-right">
              <Link to="/reset-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>
            
            <motion.button 
              type="submit" 
              className="app-btn-primary"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="app-loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>
        </motion.div>
        
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-white hover:text-blue-100">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
