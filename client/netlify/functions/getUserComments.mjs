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

exports.handler = async (event) => {
  try {
    const { reviewId } = JSON.parse(event.body);
    console.log('Fetching comments... for reviewId:', reviewId);
    log('Fetching comments... for reviewId:', reviewId);
    if (!reviewId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing reviewId' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    const reviewRef = db.collection('reviews').doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists || !reviewDoc.data().comments) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Review or comment not found' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    
    let comments = reviewDoc.data().comments;
    const totalComments = reviewDoc.data().totalComments;

    // Flatten comments and replies to fetch profile pictures in one go
    let usersToFetch = [];
    comments.forEach(comment => {
      usersToFetch.push({ userId: comment.userId, commentId: comment.commentId });
      (comment.replies || []).forEach(reply => {
        usersToFetch.push({ userId: reply.userId, commentId: reply.commentId });
      });
    });

    const profilePicPromises = usersToFetch.map(async ({ userId, commentId }) => {
      const profilePicPath = `users/${userId}/profilePicture.png`;
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

      return { userId, commentId, photoUrl };
    });

    const profiles = await Promise.all(profilePicPromises);

    // Attach the reviewId and map photo URLs back to comments and replies
    comments = comments.map(comment => {
      const userPhoto = profiles.find(profile => profile.userId === comment.userId && profile.commentId === comment.commentId);
      comment.photoUrl = userPhoto ? userPhoto.photoUrl : defaultPhotoUrl;
      
      if (comment.replies) {
        comment.replies = comment.replies.map(reply => {
          const replyPhoto = profiles.find(profile => profile.userId === reply.userId && profile.commentId === reply.commentId);
          reply.photoUrl = replyPhoto ? replyPhoto.photoUrl : defaultPhotoUrl;
          return { ...reply, reviewId }; 
        });
      }
      
      return { ...comment, reviewId }; 
    });
    // log('Fetched comments:', comments);
    return {
      statusCode: 200,
      body: JSON.stringify({ comments, totalComments }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch comments' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};