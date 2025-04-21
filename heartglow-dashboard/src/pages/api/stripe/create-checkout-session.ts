import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import admin from 'firebase-admin';
import { UserProfile } from '../../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

// Initialize Firebase Admin SDK (only once)
// It automatically uses GOOGLE_APPLICATION_CREDENTIALS env var if set
try {
  if (!admin.apps.length) {
    admin.initializeApp();
    console.log('Firebase Admin SDK Initialized');
  } else {
    admin.app(); //if already initialized, use that one
  }
} catch (e) {
  console.error('Firebase Admin SDK initialization error:', e);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// TODO: Replace with your actual Price ID from Stripe dashboard
const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID || 'price_YOUR_PREMIUM_PRICE_ID'; // Use env var

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
    const userEmail = decodedToken.email; // Get email from token

    // 2. Get User Profile (Optional but good for existing Stripe Customer ID)
    let stripeCustomerId: string | undefined;
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userProfile = userSnap.data() as UserProfile;
        stripeCustomerId = userProfile.stripeCustomerId; // Assuming you add this field
      } else {
         console.warn(`User profile not found for ID: ${userId} during checkout creation.`);
         // Decide if you want to proceed without a profile or return an error
      }
    } catch (profileError) {
       console.error('Error fetching user profile:', profileError);
       // Decide how to handle profile fetch errors
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 3. Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer: stripeCustomerId, // Pass existing customer ID if available
      customer_email: !stripeCustomerId ? userEmail : undefined, // Pass email if creating new customer
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
      // Store user ID in metadata to link Stripe customer/subscription back
      metadata: {
        userId: userId,
      },
       // Optionally enable automatic tax calculation
       // automatic_tax: { enabled: true }, 
       // Optionally collect billing address if needed for tax/invoicing
       // billing_address_collection: 'required', 
    });

    if (!checkoutSession.url) {
        throw new Error('Could not create checkout session');
    }

    // 4. Return the Checkout Session URL
    return res.status(200).json({ sessionId: checkoutSession.id, url: checkoutSession.url });

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: errorMessage });
  }
} 