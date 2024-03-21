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
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const notificationId = event.body;

    if (!notificationId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing notification ID' }),
        };
    }

    try {
        const notificationRef = db.collection('notifications').doc(notificationId);
        
        await notificationRef.update({ seen: true });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notification marked as seen successfully' }),
        };
    } catch (error) {
        console.error('Error deleting notification:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to mark notification as seen' }),
        };
    }
};
