import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthNav() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="auth-nav">
      <div className="auth-nav-brand" onClick={() => navigate('/')}>
        MyApp
      </div>
      <div className="auth-nav-links">
        {user ? (
          <>
            <span className="auth-nav-user">Hello, {user.displayName || user.email}</span>
            <button className="auth-nav-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button 
              className="auth-nav-button" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="auth-nav-button auth-nav-button-primary" 
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
} 