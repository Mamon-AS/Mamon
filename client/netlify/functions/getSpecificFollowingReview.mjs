import admin from 'firebase-admin';
import { Buffer } from 'buffer';

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
const defaultPhotoUrl = '/images/blank_profile.jpg'; 

const db = admin.firestore();

async function isUserFollowing(userId, currentUserId) {
  // Check if the current user is following the target user
  const followerRef = db.collection('users').doc(userId).collection('followers').doc(currentUserId);
  const doc = await followerRef.get();
  return doc.exists;
}

async function fetchReviewsByUser(userId, limit) {
  const reviewsRef = db.collection('reviews').where('userId', '==', userId).limit(limit);
  const snapshot = await reviewsRef.get();
  const reviews = [];
  snapshot.forEach(doc => reviews.push({ ...doc.data(), reviewId: doc.id }));
  return reviews;
}

async function fetchProfilePictureUrl(userId) {
  try {
    const filePath = `users/${userId}/profilePicture.png`;
    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    if (!exists) {
      return defaultPhotoUrl; // Return a default photo URL if the file doesn't exist
    }
    const [url] = await file.getSignedUrl({ action: 'read', expires: '03-09-2491' });
    return url;
  } catch (error) {
    console.error(`Failed to fetch profile picture for userId ${userId}`, error);
    return defaultPhotoUrl; // Fallback to default photo URL on error
  }
}


exports.handler = async (event) => {
  try {
    const { userId, limit, currentUserId } = JSON.parse(event.body);
    if (!userId || !currentUserId || typeof userId !== 'string' || typeof currentUserId !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing parameters' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }
    if (limit && typeof limit !== 'number' && limit < 1 && limit > 4) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Stop it' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
      }

      const isFollowing = await isUserFollowing(userId, currentUserId);
      if (!isFollowing) {
        console.log('User is not following this user');
        return {
          statusCode: 403,
          body: JSON.stringify({ error: "You are not following this user" }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        };
      }

    let reviews = await fetchReviewsByUser(userId, limit)

    // Extract all unique user IDs from comments and replies
    let userIds = new Set();
    reviews.forEach(review => {
      if (review.comments) {
        review.comments.forEach(comment => {
          userIds.add(comment.userId);
          if (comment.replies) {
            comment.replies.forEach(reply => userIds.add(reply.userId));
          }
        });
      }
    });

    // Fetch profile pictures
    let userPhotoUrls = {};
    for (let id of userIds) {
      userPhotoUrls[id] = await fetchProfilePictureUrl(id);
    }

    // Insert photoUrl into comments and replies
    reviews = reviews.map(review => {
      if (review.comments) {
        review.comments = review.comments.map(comment => {
          comment.photoUrl = userPhotoUrls[comment.userId];
          if (comment.replies) {
            comment.replies = comment.replies.map(reply => {
              reply.photoUrl = userPhotoUrls[reply.userId];
              return reply;
            });
          }
          return comment;
        });
      }
      return review;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch reviews or profile pictures' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};
