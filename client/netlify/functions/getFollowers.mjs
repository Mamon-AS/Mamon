import admin from 'firebase-admin';
import { Buffer } from 'buffer';

const storageBucketId = process.env.VITE_FIREBASE_STORAGE_BUCKET;
const base64 = process.env.VITE_FIREBASE_SDK;
const decodedString = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decodedString);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: storageBucketId
    });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();
const defaultPhotoUrl = '/images/frosk.png';

exports.handler = async (event) => {
    console.log("Fetching user data...");
    try {
        const { userId } = JSON.parse(event.body);
        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid user id' }),
            };
        }

        // Fetch followers:
        // 1. The profile picture is in firebase storage
        // 2. Followers and following are in firestore
        // 3. Name is fetched from the followers collection document and not from the user's profile
        const followersRef = db.collection(`users/${userId}/followers`);
        const snapshot = await followersRef.get();
        const followersDataPromises = snapshot.docs.map(async (doc) => {
            const followerData = doc.data(); 
            const followerId = doc.id;

 
            const followerProfileRef = db.doc(`users/${followerId}`);
            const followerProfileSnapshot = await followerProfileRef.get();
            const followerProfile = followerProfileSnapshot.data();

            let photoUrl = defaultPhotoUrl;
            const profilePicPath = `users/${followerId}/profilePicture.png`;
            const file = bucket.file(profilePicPath);
            try {
                const [exists] = await file.exists();
                if (exists) {
                    const signedUrls = await file.getSignedUrl({
                        action: 'read',
                        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
                    });
                    photoUrl = signedUrls[0];
                }
            } catch (signedUrlError) {
                console.warn(`Could not generate signed URL for ${profilePicPath}, using default. Error: ${signedUrlError.message}`);
            }

            return {
                userId: followerId,
                name: followerData.name, // Using name from the followers collection document
                bio: followerProfile ? followerProfile.bio : '', // Fetch bio from the user's profile, default to empty if not found
                photoUrl: photoUrl,
            };
        });
        const followersData = await Promise.all(followersDataPromises);

        return {
            statusCode: 200,
            body: JSON.stringify({ followers: followersData }),
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};