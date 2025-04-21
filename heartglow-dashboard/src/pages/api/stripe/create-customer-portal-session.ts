import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import admin from 'firebase-admin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config'; // Adjust path based on actual config location

// Initialize Firebase Admin SDK (ensure it's initialized elsewhere or handle robustly)
// This initialization is duplicated across API routes, consider a shared helper
try {
  if (!admin.apps.length) {
    admin.initializeApp();
    console.log('Firebase Admin SDK Initialized (Portal)');
  } else {
    admin.app(); // Use existing app
  }
} catch (e) {
  console.error('Firebase Admin SDK (Portal) initialization error:', e);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use your desired Stripe API version
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // 1. Authenticate User using Firebase Admin SDK
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing Bearer token' });
    }
    const idToken = authorization.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authError) {
      console.error('Error verifying Firebase ID token:', authError);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const userId = decodedToken.uid;

    // 2. Get User's Stripe Customer ID from Firestore
    let stripeCustomerId: string | undefined;
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        // Explicitly cast to access potential properties, ensure this structure matches your DB
        const userData = userSnap.data() as { stripeCustomerId?: string };
        stripeCustomerId = userData.stripeCustomerId;
      }

      if (!stripeCustomerId) {
        console.error(`Stripe Customer ID not found for user: ${userId}`);
        return res.status(404).json({ error: 'Billing information not found for this user.' });
      }

    } catch (dbError) {
      console.error(`Error fetching user ${userId} from Firestore:`, dbError);
      return res.status(500).json({ error: 'Failed to retrieve user data.' });
    }

    // 3. Create Stripe Billing Portal Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Ensure NEXT_PUBLIC_APP_URL is set
    const returnUrl = `${appUrl}/`; // Redirect back to the dashboard/root

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    // 4. Return the Portal Session URL
    return res.status(200).json({ url: portalSession.url });

  } catch (error) {
    console.error('Stripe Customer Portal Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    // Avoid exposing raw Stripe errors directly to the client in production
    return res.status(500).json({ error: 'Could not create billing portal session.' });
  }
} 