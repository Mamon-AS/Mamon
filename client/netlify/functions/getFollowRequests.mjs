import admin from 'firebase-admin';
import { Buffer } from 'buffer';

const base64 = process.env.VITE_FIREBASE_SDK;
const decodedString = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decodedString);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

exports.handler = async (event) => {
    try {
      const { userId } = JSON.parse(event.body);
      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing or invalid userId parameter" }),
        };
      }

      const followRequestsRef = db.collection('followRequests');
      const sentRequests = await followRequestsRef.where('senderId', '==', userId).get();
      const receivedRequests = await followRequestsRef.where('receiverId', '==', userId).get();

      const sentRequestsData = sentRequests.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const receivedRequestsData = receivedRequests.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          sentRequests: sentRequestsData,
          receivedRequests: receivedRequestsData,
        }),
      };
    } catch (error) {
      console.error('Error fetching follow requests:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch follow requests" }),
      };
    }
};
