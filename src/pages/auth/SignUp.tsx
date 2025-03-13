import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  HeartIcon, 
  EnvelopeIcon, 
  UserIcon,
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  
  const password = watch('password');
  
  // Focus name input on mount
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);
  
  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    
    try {
      await signup(data.email, data.password, data.name);
      // Show success animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          className="text-center mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <HeartIcon className="h-20 w-20 text-white/20 animate-heartbeat" />
              </div>
              <div className="relative z-10">
                <motion.h1 
                  className="text-4xl font-extrabold text-white text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  HeartGlow<span className="font-light">AI</span>
                </motion.h1>
              </div>
            </div>
          </div>
          <motion.h2 
            className="text-xl font-medium text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Create Your Account
          </motion.h2>
        </motion.div>

        <motion.form 
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="app-input-icon-wrapper">
            <input
              type="text"
              placeholder="Full Name"
              className={`app-input app-input-with-icon ${errors.name ? 'ring-2 ring-red-500' : ''}`}
              {...register('name', { 
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              ref={nameRef}
            />
            <UserIcon className="app-input-icon" />
            {errors.name && <div className="form-error">{errors.name.message}</div>}
          </div>
          
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
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message: 'Password must include uppercase, lowercase, number and special character'
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
          
          <div className="app-input-icon-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={`app-input app-input-with-icon ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-white/70"
            >
              {showConfirmPassword ? 
                <EyeSlashIcon className="h-5 w-5" /> : 
                <EyeIcon className="h-5 w-5" />
              }
            </button>
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword.message}</div>}
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
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                SIGN UP <CheckCircleIcon className="ml-2 h-5 w-5" />
              </span>
            )}
          </motion.button>
          
          <div className="mt-6 text-center">
            <motion.p 
              className="text-sm text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Already have an account? {' '}
              <Link to="/" className="font-medium text-white underline">
                Sign in
              </Link>
            </motion.p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}; 