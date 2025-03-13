import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
      navigate('/message');
    } catch (err) {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-5 overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute w-40 h-40 rounded-full bg-white/10"
        style={{ top: '10%', right: '5%' }}
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute w-60 h-60 rounded-full bg-white/10"
        style={{ bottom: '5%', left: '10%' }}
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className="w-full max-w-md z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="mb-10 flex flex-col items-center"
          variants={itemVariants}
        >
          <motion.div
            className="w-24 h-24 mb-6 relative"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" className="w-12 h-12">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">HeartGlowAI</h1>
          <p className="text-white/80 text-center max-w-xs">Express your feelings with the perfect words</p>
        </motion.div>
        
        <motion.div 
          className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          
          {error && (
            <motion.div
              className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 text-sm backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 bg-white/30 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-white/50"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-white/90 text-sm font-medium">Password</label>
                <Link to="/forgot-password" className="text-white/70 hover:text-white text-xs">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 bg-white/30 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-white/50"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="pt-2"
            >
              <motion.button 
                type="submit" 
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 flex items-center justify-center"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex space-x-2">
                    <motion.div 
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                ) : 'Sign In'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
        
        <motion.div 
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <p className="text-white/80">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-white hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 