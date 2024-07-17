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
        const { userId, reviewedItem } = JSON.parse(event.body);

        const reviewSnapshot = await db.collection('reviews')
            .where('userId', '==', userId)
            .where('reviewedItem', '==', reviewedItem)
            .get();

        if (!reviewSnapshot.empty) {
            return {
                statusCode: 200,
                body: JSON.stringify({ exists: true }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ exists: false }),
        };
    } catch (error) {
        console.error('Error checking review existence:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to check review existence" }),
        };
    }
};
