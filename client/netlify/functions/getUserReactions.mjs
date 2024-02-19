
import admin from 'firebase-admin';
import { Buffer } from 'buffer';
import { log } from 'console';

// Initialize Firebase Admin SDK once
if (admin.apps.length === 0) {
  const base64 = process.env.VITE_FIREBASE_SDK;
  const decodedString = Buffer.from(base64, 'base64').toString('utf-8');
  const serviceAccount = JSON.parse(decodedString);
  const storageBucketId = process.env.VITE_FIREBASE_STORAGE_BUCKET;

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucketId,
  });
}

const bucket = admin.storage().bucket();
const defaultPhotoUrl = '/images/frosk.png';

const db = admin.firestore();

// this function gets the reaction/emoji for a review. 
// However, a review collection document will not exists if it has no reactions. So we need to return a default empty object if the document does not exist
// We also need to return the user's reaction if it exists 
// We also need to return the total number of reactions for the review, and the photoUrl for each user who reacted
exports.handler = async (event) => {
  try {
    log('Fetching reactions...');
    const { reviewId, userId } = JSON.parse(event.body);
    if (!reviewId || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing reviewId or userId' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    const reviewRef = db.collection('reviews').doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists || !reviewDoc.data().reactions) {
      return {
        statusCode: 200, 
        body: JSON.stringify({ reactions: {}, userReaction: null }), 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    const reactions = reviewDoc.data().reactions;
    const totalReactions = reviewDoc.data().totalReactions;
    const userReaction = reactions[userId] || null;
    

    const transformedReactions = {};
    const profilePicPromises = Object.keys(reactions).map(async key => {
    const profilePicPath = `users/${key}/profilePicture.png`; 
    const file = bucket.file(profilePicPath);
    let photoUrl = defaultPhotoUrl; 
  
    try {
      const [exists] = await file.exists();
      if (exists) {
        const signedUrls = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 15 * 60 * 1000, 
        });
        photoUrl = signedUrls[0]; 
      }
    } catch (signedUrlError) {
      console.warn(`Could not generate signed URL for ${profilePicPath}, using default. Error: ${signedUrlError.message}`);
    }
  
    return { key, photoUrl }; 
  });
  
 
  const profiles = await Promise.all(profilePicPromises);
  
 
    profiles.forEach(({ key, photoUrl }) => {
      transformedReactions[key] = {
        ...reactions[key],
        userId: key,
        photoUrl 
      };
    });


    return {
      statusCode: 200,
      body: JSON.stringify({ reactions: transformedReactions, userReaction, totalReactions }), 
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch reactions' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};