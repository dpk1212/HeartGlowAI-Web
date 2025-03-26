import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/auth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password || !name || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // Use Firebase signUp function
      await signUp(email, password, name);
      
      // If successful, navigate to home page
      navigate("/home");
    } catch (err) {
      console.error("Signup error:", err);
      
      // Handle different Firebase error codes
      const errorCode = err?.code;
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setError("An account with this email already exists");
          break;
        case 'auth/invalid-email':
          setError("Invalid email address format");
          break;
        case 'auth/operation-not-allowed':
          setError("Account creation is disabled at this time");
          break;
        case 'auth/weak-password':
          setError("Password is too weak. Please use a stronger password");
          break;
        default:
          setError("Failed to create account. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign Up</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="auth-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
