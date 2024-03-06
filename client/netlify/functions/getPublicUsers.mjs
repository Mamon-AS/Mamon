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
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Method Not Allowed' };
     }
    try {
        const usersQuerySnapshot = await db.collection('users').where('isPrivate', '==', false).get();
        if (usersQuerySnapshot.empty) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No public users found' }),
            };
        }

        let users = [];
        usersQuerySnapshot.forEach(doc => {
            users.push({ id: doc.id });
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ users }),
        };
    } catch (error) {
        console.error('Error fetching public users:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch public users' }),
        };
    }
};