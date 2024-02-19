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

// This function updates the review document with the user's reaction. Current constraints/headsup:
// 1. The user can only react with one emoji per review
// 2. Denormalization: The user's name will be stored aswell because they belong together and I don't want to make another query to get the user's name
exports.handler = async (event) => {
    try {
        const { emoji, reviewId, userId, displayName } = JSON.parse(event.body);

        if (!emoji || !reviewId || !displayName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        const reviewRef = db.collection('reviews').doc(reviewId);
        const reviewDoc = await reviewRef.get();

        if (!reviewDoc.exists) {
            await reviewRef.set({
                reactions: {
                    [userId]: { emoji, displayName }
                },
                totalReactions: 1
            });
        } else {
            let reactions = reviewDoc.data().reactions || {};
            let totalReactions = reviewDoc.data().totalReactions || 0;

            if (reactions[userId] && reactions[userId].emoji === emoji) {
                // User removed their reaction, delete and decrement totalReactions
                delete reactions[userId];
                totalReactions = Math.max(0, totalReactions - 1); 
            } else if (reactions[userId] && reactions[userId].emoji !== emoji) {
                // User changed their reaction, just update the reaction
                reactions[userId] = { emoji, displayName };
                // totalReactions remains unchanged
            } else {
                // New reaction, add and increment totalReactions
                reactions[userId] = { emoji, displayName };
                totalReactions += 1;
            }
            await reviewRef.update({ reactions, totalReactions });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Reaction updated successfully' }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to post reaction' }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};