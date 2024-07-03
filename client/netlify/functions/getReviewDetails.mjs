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
        const { token } = JSON.parse(event.body);
        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing or invalid token parameter" }),
            };
        }

        const reviewsRef = db.collection('reviewTokens').doc(token);
        const doc = await reviewsRef.get();

        if (!doc.exists) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Review token not found" }),
            };
        }

        const data = doc.data();

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                reviewedItem: data.reviewedItem,
                itemImage: data.itemImage,
                website: data.website,
                url: data.url,
            }),
        };
    } catch (error) {
        console.error('Error fetching review details:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch review details" }),
        };
    }
};