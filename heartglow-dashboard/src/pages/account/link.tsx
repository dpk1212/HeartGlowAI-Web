import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
// Import necessary Firebase functions
import { 
  EmailAuthProvider, 
  GoogleAuthProvider,
  linkWithCredential,
  signInWithPopup // Needed for Google linking flow
} from 'firebase/auth';
import { auth } from '../../firebase/auth'; // Import the exported auth instance
import { motion } from 'framer-motion'; // Import motion
import { LockKeyhole, Save, Mail, User } from 'lucide-react'; // Import icons

const LinkAccountPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);

  React.useEffect(() => {
    // Redirect immediately if we know the user is not anonymous
    if (currentUser && !currentUser.isAnonymous) {
      console.log("User is already permanent, redirecting from link page...");
      router.replace('/'); // Use replace to avoid adding to history
    }
    // No dependency on loading here, rely on currentUser state
  }, [currentUser, router]);

  const handleLinkWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingEmail(true);
    if (!currentUser?.isAnonymous) {
      setError("No anonymous user found to link, or user state changed.");
      setLoadingEmail(false);
      return;
    }
    console.log("Attempting to link with Email/Password...");
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(currentUser!, credential);
      console.log("Email account linked successfully!");
      router.push('/'); // Redirect to dashboard on success
    } catch (err) {
      console.error("Email linking error:", err);
      if (typeof err === 'object' && err !== null && 'code' in err) {
        const firebaseError = err as { code: string; message: string };
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setError("This email address is already associated with another account.");
            break;
          case 'auth/invalid-credential':
            setError("Incorrect email or password. Please try again.");
            break;
          case 'auth/weak-password':
            setError("Password is too weak. Please choose a stronger password.");
            break;
          case 'auth/credential-already-in-use':
             setError("This email/password is already linked to your account.");
             break;
          default:
            setError(`An unexpected error occurred: ${firebaseError.message}`);
        }
      } else {
        setError("An unexpected error occurred during email linking.");
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleLinkWithGoogle = async () => {
    setError(null);
    setLoadingGoogle(true);
    if (!currentUser?.isAnonymous) {
      setError("No anonymous user found to link, or user state changed.");
      setLoadingGoogle(false);
      return;
    }
    console.log("Attempting to link with Google...");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // --- Correct way to get OAuth credential for linking --- 
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) {
        // This case might happen if the popup result doesn't contain expected tokens.
        throw new Error("Could not get Google credential from result.");
      }
      // --- End correction ---

      // currentUser is checked above, assert non-null for linkWithCredential
      await linkWithCredential(currentUser!, credential); // Use the obtained OAuthCredential
      console.log("Google account linked successfully!");
      router.push('/'); // Redirect to dashboard on success
    } catch (err) {
      console.error("Google linking error:", err);
      // Check if the error object has a 'code' property
      if (typeof err === 'object' && err !== null && 'code' in err) {
         const firebaseError = err as { code: string; message: string }; // Type assertion
         switch (firebaseError.code) {
           case 'auth/credential-already-in-use':
             setError("This Google account is already associated with another HeartGlow account or already linked.");
             break;
           case 'auth/popup-closed-by-user':
             setError("Google sign-in popup closed before completion.");
             break;
          case 'auth/cancelled-popup-request':
             setError("Multiple popups opened. Please close others and try again.");
             break;
           case 'auth/unauthorized-domain':
             setError("This domain isn't authorized for Google Sign-In. (Configuration Issue)");
             break;
           case 'auth/user-mismatch': // Error if linking different users
             setError("Cannot link credentials for different users.") 
             break;
           default:
             setError(`An unexpected error occurred: ${firebaseError.message}`);
         }
      } else {
         // Handle the case from the explicit throw above
         if (err instanceof Error) {
           setError(err.message);
         } else {
           setError("An unexpected error occurred during Google linking.");
         }
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Show loading indicator while waiting for currentUser or if linking
  if (!currentUser) {
     return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-heartglow-charcoal dark:to-indigo-900/50">Loading user data...</div>;
  }
  // Redirect is handled by useEffect, but we can show a message if not anonymous yet
  if (!currentUser.isAnonymous) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-heartglow-charcoal dark:to-indigo-900/50">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-heartglow-charcoal dark:to-indigo-900/50">
      <Head>
        <title>Secure Your Account - HeartGlow AI</title>
      </Head>
      
      {/* Use motion for subtle animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50"
      >
        <div className="text-center">
           {/* Add an icon */}
           <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-500 shadow-lg">
              <Save className="w-8 h-8" />
           </div>
           <h1 className="text-2xl md:text-3xl font-bold text-heartglow-charcoal dark:text-heartglow-offwhite">Secure Your Account</h1>
           <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
             Save your progress permanently and access your messages across all devices by creating a free account.
           </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300 rounded-lg text-sm text-center shadow-sm"
          >
            {error}
          </motion.div> 
        )}

        {/* Email/Password Linking Form */}
        <form onSubmit={handleLinkWithEmail} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
            {/* Input with icon */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/50 focus:border-heartglow-pink dark:bg-gray-800 dark:text-white transition duration-200"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            {/* Input with icon */}
             <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <LockKeyhole className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-heartglow-pink/50 focus:border-heartglow-pink dark:bg-gray-800 dark:text-white transition duration-200"
                  placeholder="Create a password"
                />
            </div>
          </div>
          {/* Updated Button Style */}
          <button
            type="submit"
            disabled={loadingEmail || loadingGoogle}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-pink/90 hover:to-heartglow-violet/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heartglow-pink dark:focus:ring-offset-gray-900 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loadingEmail ? 'Linking Email...' : 'Create Account with Email'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-gray-700/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-gray-900/80 text-gray-500 dark:text-gray-400">
              Or
            </span>
          </div>
        </div>

        {/* Google Linking Button - Updated Style */}
        <div>
          <button
            type="button"
            onClick={handleLinkWithGoogle}
            disabled={loadingEmail || loadingGoogle}
            className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-base font-medium text-heartglow-charcoal dark:text-heartglow-offwhite hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 261.8S110.3 11.6 244 11.6c67.3 0 120.3 24.1 162.6 63.9L349.3 127c-36.1-33.6-81.3-51.6-105.3-51.6-84.9 0-153.9 69.1-153.9 153.9s69 153.9 153.9 153.9c97.2 0 135.1-67.3 140.8-103.8H244v-71.5h244c2.6 12.9 3.9 26.7 3.9 41.4z"></path></svg>
            {loadingGoogle ? 'Linking Google...' : 'Continue with Google'}
          </button>
        </div>

        {/* Terms Link Placeholder */}
        <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our Terms of Service and Privacy Policy (links to be added).
        </p>
      </motion.div>
    </div>
  );
};

export default LinkAccountPage; 