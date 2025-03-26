import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthNav from '../components/AuthNav';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="home-container">
      <AuthNav />
      
      <div className="home-content">
        <h1>Welcome, {user.displayName || user.email}!</h1>
        <p>You are now logged in to the application.</p>
        
        <div className="home-card">
          <h2>Your Account</h2>
          <p>Email: {user.email}</p>
          <p>Account created: {user.metadata.creationTime}</p>
          <p>Last sign in: {user.metadata.lastSignInTime}</p>
          
          <button 
            className="signout-button"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 