import admin from 'firebase-admin';
import { Buffer } from 'buffer';

const base64 = process.env.VITE_FIREBASE_SDK;
const decodedString = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decodedString);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),

    })
}

const db = admin.firestore();

  exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing data' }),
        };
      }
      const userId = event.body
      try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
    
        if (userDoc.exists) {
  
          const isPrivate = userDoc.data().isPrivate 
    
          return {
            statusCode: 200,
            body: JSON.stringify({ isPrivate: isPrivate, message: 'Privacy setting' }),
          };
        } else {
          return {
            statusCode: 404,
            body: JSON.stringify({ error: 'User not found' }),
          };
        }
      } catch (error) {
        console.error('Error getting privacy setting:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to get privacy setting' }),
        };
      }
    };