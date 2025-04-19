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
      await linkWithCredential(currentUser!, result.credential);
      console.log("Google account linked successfully!");
      router.push('/'); // Redirect to dashboard on success
    } catch (err) {
      console.error("Google linking error:", err);
      if (typeof err === 'object' && err !== null && 'code' in err) {
         const firebaseError = err as { code: string; message: string };
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
           default:
             setError(`An unexpected error occurred: ${firebaseError.message}`);
         }
      } else {
         setError("An unexpected error occurred during Google linking.");
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Show loading indicator while waiting for currentUser or if linking
  if (!currentUser) {
     return <div className="flex justify-center items-center min-h-screen">Loading user data...</div>;
  }
  // Redirect is handled by useEffect, but we can show a message if not anonymous yet
  if (!currentUser.isAnonymous) {
    return <div className="flex justify-center items-center min-h-screen">Redirecting...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Head>
        <title>Create Account - HeartGlow AI</title>
      </Head>
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Create Your HeartGlow Account</h1>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Save your connections, messages, and progress permanently by linking your current session to an account.
        </p>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* Email/Password Linking Form */}
        <form onSubmit={handleLinkWithEmail} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loadingEmail || loadingGoogle} // Disable if either is loading
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loadingEmail ? 'Linking Email...' : 'Create Account with Email'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Google Linking Button */}
        <div>
          <button
            type="button"
            onClick={handleLinkWithGoogle}
            disabled={loadingEmail || loadingGoogle} // Disable if either is loading
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {/* Basic Google Icon Placeholder */}
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M10 2C5.03 2 1 6.03 1 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm5.2 6.88l-1.52.93C13.17 10.6 12.14 11 11 11h-.06c-1.3 0-2.4-.84-2.84-2H10c.4 0 .77-.14.95-.38.18-.24.26-.52.23-.8l-.09-.75c-.03-.28-.14-.55-.34-.75s-.47-.31-.75-.31H8.1c-.66 0-1.2.54-1.2 1.2v.01c0 .66.54 1.2 1.2 1.2H10c.17 0 .33.03.48.09l.02.01c.5.18.9.56 1.12 1.04.23.48.29.98.17 1.46l-.17.68c-.12.48-.4.9-.8 1.2-.4.3-.88.46-1.38.46h-.01c-.66 0-1.2-.54-1.2-1.2 0-.1.01-.19.04-.28l.11-.44c.12-.48.4-.9.8-1.2.4-.3.88-.46 1.38-.46h.16c.34 0 .67.07.97.2l1.52.93c.49.3.49.8 0 1.1l-1.52.93c-.3.18-.63.28-.97.28h-.16c-.96 0-1.84-.45-2.4-1.18-.56-.73-.8-1.66-.64-2.58l.11-.44C7.81 8.84 8.6 8 9.9 8h.16c.96 0 1.84.45 2.4 1.18.56.73.8 1.66.64 2.58l-.11.44c-.03.09-.04.18-.04.28 0 .66-.54 1.2-1.2 1.2h-.01c-.5 0-.98-.16-1.38-.46-.4-.3-.68-.72-.8-1.2l-.17-.68c-.12-.48-.06-.98.17-1.46.22-.48.62-.86 1.12-1.04l.02-.01c.15-.06.31-.09.48-.09H10v-1h-.06c-.5 0-.98.16-1.38.46-.4.3-.68.72-.8 1.2l-.11.44c-.16.92.08 1.85.64 2.58.56.73 1.44 1.18 2.4 1.18h.16c.5 0 .98-.16 1.38-.46.4-.3.68-.72.8-1.2l1.52-.93c.49-.3.49-.8 0-1.1z" clipRule="evenodd" /> </svg>
            {loadingGoogle ? 'Linking Google...' : 'Continue with Google'}
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our Terms of Service and Privacy Policy (links to be added).
        </p>
      </div>
    </div>
  );
};

export default LinkAccountPage; 