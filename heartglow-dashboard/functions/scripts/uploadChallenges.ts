// File: heartglow-dashboard/functions/scripts/uploadChallenges.ts
import * as admin from 'firebase-admin';
import { challengesData, ChallengeDefinition } from '../src/data/challenges'; // Import the structured data

// ---- IMPORTANT: Configure Firebase Admin SDK ----
// Option 1: Use Application Default Credentials (ADC) - Recommended for local dev/CI
// Ensure GOOGLE_APPLICATION_CREDENTIALS env var is set to your service account key path
try {
   admin.initializeApp({
     // Use the environment variable directly for credentials
     credential: admin.credential.applicationDefault(), 
     projectId: 'heartglowai' // Explicitly set the project ID
   });
} catch (e) { console.log("Admin SDK already initialized or initialization failed."); }

// Option 2: Explicitly provide service account key (Less secure for source control)
/*
import serviceAccount from './path/to/your-service-account-key.json'; // Replace with actual path

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'heartglowai' // Also add projectId here if using this option
    });
} catch (e) { console.log("Admin SDK already initialized or initialization failed."); }
*/
// ----------------------------------------------

const db = admin.firestore();
const challengesCollection = db.collection('challenges');

async function uploadChallenges() {
  console.log(`Starting upload of ${challengesData.length} challenges...`);
  const batch = db.batch();
  let count = 0;

  challengesData.forEach((challenge: ChallengeDefinition) => {
    // Use the predefined 'id' field as the document ID in Firestore
    const docRef = challengesCollection.doc(challenge.id);
    // We remove the 'id' field from the data object itself before saving
    const { id, ...challengeDocData } = challenge;
    batch.set(docRef, challengeDocData, { merge: true }); // Use set with merge to create or update
    count++;
    console.log(` - Added ${challenge.id} (${challenge.name}) to batch.`);
  });

  try {
    await batch.commit();
    console.log(`Successfully uploaded/updated ${count} challenges to Firestore.`);
  } catch (error) {
    console.error("Error uploading challenges:", error);
  }
}

// Run the upload function
uploadChallenges().then(() => {
    console.log("Upload script finished.");
    // Optional: Exit process cleanly if running standalone
    // process.exit(0);
}).catch((error) => {
    console.error("Script failed:", error);
    // Optional: Exit with error code
    // process.exit(1);
}); 