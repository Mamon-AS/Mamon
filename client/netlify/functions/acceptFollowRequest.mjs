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
      const userFollowersRef = db.collection('users/'+receiverId+'/followers').doc(requesterId);
      const userFollowingRef = db.collection('users/'+requesterId+'/following').doc(receiverId);
      
      const notificationMessage = `Følgeforespøselen ble godkjent!`;
       const notificationData = {
         userId:receiverId,
         type: 'followRequestAccepted',
         message: notificationMessage,
         seen: false,
         timestamp: admin.firestore.FieldValue.serverTimestamp(),
         notificationUserId: requesterId,
       }
      await userFollowersRef.set({userId: requesterId, createdAt: admin.firestore.FieldValue.serverTimestamp()});
      await userFollowingRef.set({userId: receiverId, createdAt: admin.firestore.FieldValue.serverTimestamp()});
      await db.collection('notifications').add(notificationData);
      await followRequestRef.update({
        status: 'accepted'
      });



    return {
      statusCode: 200,
      body: JSON.stringify({
          message: "Follow request accepted.",
          requestId: followRequestId,
          response: 'closed',
         }),
      };
    } catch (error) {
      console.error('Error accepting request', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to accept request" }),
      };
    }
  };