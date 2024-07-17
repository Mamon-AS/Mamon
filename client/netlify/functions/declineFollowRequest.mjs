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
      const { requesterId, receiverId, followRequestId } = JSON.parse(event.body);

      if (requesterId === undefined || receiverId === undefined || followRequestId === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required parameters" }),
        };
      }

      const followRequestRef = db.collection('followRequests').doc(followRequestId);
      await followRequestRef.update({
        status: 'closed'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
          message: "Follow request declined.",
          requestId: followRequestId,
          response: 'closed',
         }),
      };
    } catch (error) {
      console.error('Error declining request', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to decline request" }),
      };
    }
  };