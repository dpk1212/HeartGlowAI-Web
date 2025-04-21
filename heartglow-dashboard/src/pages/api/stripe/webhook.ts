import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config'; // Adjust path if needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable Next.js body parsing for this route to correctly receive the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'] as string;
  const buf = await buffer(req);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log('✅ Stripe Webhook Received:', event.type);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Error verifying webhook signature: ${errorMessage}`);
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve metadata (contains userId)
    const userId = session.metadata?.userId;
    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
      console.error('❌ Webhook Error: Missing required data (userId, customerId, or subscriptionId) in session metadata or objects.', {
         userId, 
         stripeCustomerId: session.customer,
         stripeSubscriptionId: session.subscription,
         metadata: session.metadata
      });
      return res.status(400).send('Webhook Error: Missing required data.');
    }

    try {
      // Update user document in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isPremium: true,
        stripeCustomerId: stripeCustomerId,
        stripeSubscriptionId: stripeSubscriptionId,
        // Optionally reset any usage limits here if needed
      });
      console.log(`✅ Firestore updated for user ${userId}: Premium status granted.`);
    } catch (error) {
      console.error(`❌ Firestore update error for user ${userId}:`, error);
      // Important: Return 500 to signal Stripe to retry the webhook later
      return res.status(500).send('Webhook handler failed: Could not update user profile.');
    }
  }
  
  // TODO: Handle other events like subscription updates/cancellations
  // if (event.type === 'customer.subscription.updated') { ... }
  // if (event.type === 'customer.subscription.deleted') { ... }
  //   Update isPremium: false, clear stripeSubscriptionId etc.

  // Return 200 to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

export default handler; 