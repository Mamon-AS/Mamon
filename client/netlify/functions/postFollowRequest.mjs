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
      const { currentUserId, targetUserId, displayName } = JSON.parse(event.body);

      if (currentUserId === targetUserId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "You cannot follow yourself" }),
        };
      }
      if (currentUserId === undefined || targetUserId === undefined) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required parameters" }),
        };
      }
      const followRequestsRef = db.collection('followRequests');
      const request = {
        senderId: currentUserId,
        receiverId: targetUserId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        respondedAt: null,
      };

      const docRef = await followRequestsRef.add(request);
      
      const notificationMessage = `${displayName} har sent deg en følgeforespørsel.`;
      const notificationData = {
        userId:currentUserId,
        type: 'followRequest',
        message: notificationMessage,
        seen: false,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        notificationUserId: targetUserId,
      }
      await db.collection('notifications').add(notificationData);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Follow request sent successfully.",
          requestId: docRef.id, 
          ...request,
        }),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch users" }),
      };
    }
  };