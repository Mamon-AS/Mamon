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
const defaultPhotoUrl = '/images/frosk.png'; 

const db = admin.firestore();

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
    const { userId, limit } = JSON.parse(event.body);

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId' }),
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

    const followingRef = db.collection('users').doc(userId).collection('following');
    const snapshot = await followingRef.get();
    if (snapshot.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User does not exist or does not follow anyone' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    let followingUserIds = [];
    snapshot.forEach(doc => {
      followingUserIds.push(doc.id);
    });

 
    let reviews = [];

    // Firestore 'in' query supports up to 10 items, so split followingUserIds into the limit parameter
    for (let i = 0; i < followingUserIds.length; i += limit) {
      let chunk = followingUserIds.slice(i, i + limit);
      const reviewsRef = db.collection('reviews')
      .where('userId', 'in', chunk)
      // .limit(limit);
      const reviewsSnapshot = await reviewsRef.get();

      reviewsSnapshot.forEach(doc => {
        reviews.push(doc.data());
      });
    }

    const hasMoreReviews = reviews.length > limit;

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