import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

interface LoginForm {
  email: string;
  password: string;
}

export const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  // Focus email input on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);
  
  const onSubmit = (data: LoginForm) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dashboard
      window.location.href = '/login';
    }, 1500);
  };
  
  return (
    <div className="premium-gradient min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Floating animated elements */}
      <motion.div 
        className="floating-coin floating-coin-1"
        animate={{ y: [0, -15, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="floating-coin floating-coin-2" 
        animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      <motion.div 
        className="w-full max-w-sm px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <HeartIcon className="h-32 w-32 text-white/20 animate-heartbeat" />
              </div>
              <div className="relative z-10">
                <motion.h1 
                  className="text-5xl font-extrabold text-white text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  HeartGlow<span className="font-light">AI</span>
                </motion.h1>
              </div>
            </div>
          </div>
          <motion.p 
            className="text-xl text-white/90 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Express your feelings with the perfect words
          </motion.p>
        </motion.div>

        <motion.form 
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="app-input-icon-wrapper">
            <input
              type="email"
              placeholder="Email"
              className={`app-input app-input-with-icon ${errors.email ? 'ring-2 ring-red-500' : ''}`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              ref={emailRef}
            />
            <EnvelopeIcon className="app-input-icon" />
            {errors.email && <div className="form-error">{errors.email.message}</div>}
          </div>
          
          <div className="app-input-icon-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`app-input app-input-with-icon ${errors.password ? 'ring-2 ring-red-500' : ''}`}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-white/70"
            >
              {showPassword ? 
                <EyeSlashIcon className="h-5 w-5" /> : 
                <EyeIcon className="h-5 w-5" />
              }
            </button>
            {errors.password && <div className="form-error">{errors.password.message}</div>}
          </div>
          
          <motion.button
            type="submit"
            className="app-btn-primary font-bold mt-6 text-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "SIGN IN"}
          </motion.button>
          
          <div className="mt-6 text-center">
            <motion.p 
              className="text-sm text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              Don't have an account? {' '}
              <Link to="/dashboard" className="font-medium text-white underline">
                Sign up
              </Link>
            </motion.p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}; 