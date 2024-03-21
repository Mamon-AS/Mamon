import admin from 'firebase-admin';
import { Buffer } from 'buffer';

const base64 = process.env.VITE_FIREBASE_SDK;
const decodedString = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decodedString);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

exports.handler = async (event) => {
    try {
      const { currentUserId, targetUserId } = JSON.parse(event.body);
      console.log(currentUserId, targetUserId, 'currentUserId, targetUserId');
      if (currentUserId === targetUserId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "You cannot follow or even unfollow yourself" }),
        };
      }
      if (currentUserId === undefined || targetUserId === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required parameters" }),
        };
      }
      const followingRef = db.doc(`users/${currentUserId}/following/${targetUserId}`);
      const followersRef = db.doc(`users/${targetUserId}/followers/${currentUserId}`);
      
      console.log(followingRef, followersRef);
      await followingRef.delete();
      await followersRef.delete();
      
      return {
        statusCode: 200,
        body: JSON.stringify( "Unfollowed" ),
      };

    } catch (error) {
      console.error('Failed to unfollow user:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to unfollow user" }),
      };
    }
};
