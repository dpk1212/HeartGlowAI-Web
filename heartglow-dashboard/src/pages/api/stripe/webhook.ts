import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import admin from 'firebase-admin';
import { db } from '../../../firebase/config'; // Adjust path as needed
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Firebase Admin SDK (ensure it's initialized elsewhere or add initialization here)
// Consider moving initialization to a shared config file if not already done
try {
  if (!admin.apps.length) {
    admin.initializeApp(); // Uses GOOGLE_APPLICATION_CREDENTIALS
    console.log('Firebase Admin SDK Initialized (Webhook)');
  } else {
    admin.app(); 
  }
} catch (e) {
  console.error('Firebase Admin SDK (Webhook) initialization error:', e);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

// IMPORTANT: Replace with your actual webhook signing secret from the Stripe dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; 

// Disable Next.js body parsing for this route to access the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  if (!webhookSecret) {
      console.error('Stripe webhook secret is not set in environment variables.');
      return res.status(500).send('Webhook secret not configured.');
  }

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req); // Read the raw request body

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session.id);

      // Metadata should contain our userId
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId) {
        console.error('Error: userId missing from checkout session metadata.', session.id);
        // Optionally alert or log more details
        return res.status(400).send('Webhook Error: Missing userId in metadata');
      }

      if (!stripeCustomerId || !stripeSubscriptionId) {
        console.error('Error: Stripe customer or subscription ID missing from session.', session.id);
        return res.status(400).send('Webhook Error: Missing customer/subscription ID');
      }

      try {
        // Update user document in Firestore
        const userRef = doc(db, 'users', userId);
        
        // TODO: Review UserProfile structure - ensure these fields exist or adjust as needed
        await updateDoc(userRef, {
          isPremium: true,
          stripeCustomerId: stripeCustomerId,
          stripeSubscriptionId: stripeSubscriptionId,
          subscriptionStatus: 'active', // Consider adding a status field
          premiumActivatedAt: serverTimestamp(), 
          // Reset free tier counters if applicable (optional)
          // totalMessageCount: 0, 
          // coachingSessionsStarted: 0,
          // connectionsCount: 0, // Assuming connections are tracked elsewhere or reset needed
        });
        
        console.log(`Successfully updated user ${userId} to premium.`);

      } catch (dbError) {
        console.error(`Error updating Firestore for user ${userId}:`, dbError);
        // TODO: Implement retry logic or alert admin
        return res.status(500).send('Database update error');
      }
      break;

    // Handle subscription cancellations (optional but recommended)
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': // Handles cancellations via status change
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription ${event.type}:`, subscription.id);
      
      // Find user by stripeSubscriptionId or stripeCustomerId 
      // (Query Firestore - requires indexing these fields)
      // For simplicity, assume we stored stripeSubscriptionId on the user doc:
      // const userQuery = query(collection(db, 'users'), where('stripeSubscriptionId', '==', subscription.id));
      // const userSnap = await getDocs(userQuery);
      // if (!userSnap.empty) {
      //    const userIdToUpdate = userSnap.docs[0].id;
      //    const userRefToUpdate = doc(db, 'users', userIdToUpdate);
      
           // Check subscription status ('canceled', 'active', 'past_due', etc.)
           const status = subscription.status;
           const isCancelled = status === 'canceled' || subscription.cancel_at_period_end; 

           // Update user document in Firestore
      //     await updateDoc(userRefToUpdate, {
      //       isPremium: status === 'active' || status === 'trialing', // Or based on your logic
      //       subscriptionStatus: status,
      //       // Clear subscription ID if fully canceled? Or keep for history?
      //       // stripeSubscriptionId: isCancelled ? null : subscription.id, 
      //     });
      //     console.log(`Updated subscription status ('${status}') for user associated with sub ${subscription.id}`);
      // } else {
      //    console.warn(`Could not find user for subscription ${event.type} event: ${subscription.id}`);
      // }
      
      // Placeholder: Add logic to find user by subscription ID and update isPremium/status
      console.warn('TODO: Implement user lookup and update for subscription changes.');
      break;
      
    // Handle payment failures if needed
    case 'invoice.payment_failed':
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice payment failed:', invoice.id);
      // Potentially notify user or update subscription status to 'past_due'
      // Placeholder: Add logic if needed
      console.warn('TODO: Implement handling for invoice payment failures.');
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
} 