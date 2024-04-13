import admin from 'firebase-admin';
import { Buffer } from 'buffer'

const storageBucketId = process.env.VITE_FIREBASE_STORAGE_BUCKET;
const base64 = process.env.VITE_FIREBASE_SDK
const decodedString = Buffer.from(base64, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decodedString);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: storageBucketId
    })
}

const bucket = admin.storage().bucket();
const defaultPhotoUrl = '/images/blank_profile.jpg';

exports.handler = async (event) => {
    console.log("Fetching user data...")
    try {
        const userId = (event.body);
        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid user id' }),
            };
        }
        
        const userRecord = await admin.auth().getUser(userId);

        const profilePicPath = `users/${userId}/profilePicture.png`; 
        const file = bucket.file(profilePicPath);
        let photoUrl = defaultPhotoUrl;
        
        try {
            const [ exists ] = await file.exists();
            if(exists) {
                const signedUrls = await file.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 15 * 60 * 1000, 
                });
                photoUrl = signedUrls[0];
            }
        }
        catch (signedUrlError) {
            console.warn(`Could not generate signed URL for ${profilePicPath}, using default. Error: ${signedUrlError.message}`);
            
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                userId: userRecord.uid,
                name: userRecord.displayName,
                photoUrl: photoUrl,

            }),
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};