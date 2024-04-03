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

const getFollowingData = async (userId) => {
    const followingRef = db.collection(`users/${userId}/following`);
    const followingSnapshot = await followingRef.get();

    // Initialize an array to store followed user IDs
    const followedUserIds = [];

    // Iterate over each document in the following collection
    followingSnapshot.forEach((doc) => {
        // Get the followed user ID from the document ID
        followedUserIds.push(doc.id);
    });

    return followedUserIds;
};




const getPhotoUrl = async (followingId) => {
    let photoUrl = defaultPhotoUrl;
    const profilePicPath = `users/${followingId}/profilePicture.png`;
    const file = bucket.file(profilePicPath);
    try {
        const [exists] = await file.exists();
        if (exists) {
            const signedUrls = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000, 
            });
            photoUrl = signedUrls[0];
        }
    } catch (signedUrlError) {
        console.warn(`Could not generate signed URL for ${profilePicPath}, using default. Error: ${signedUrlError.message}`);
    }
    return photoUrl;
}

const getUserProfileData = async (userId) => {
    try {
        const userDoc = await db.doc(`users/${userId}`).get();
        if (!userDoc.exists) {
            console.error(`User document with ID ${userId} does not exist.`);
            return null;
        }
        const userData = userDoc.data();
        return {
            displayName: userData.displayName || '',
            bio: userData.bio || ''
        };
    } catch (error) {
        console.error(`Error fetching user profile data for user ${userId}:`, error);
        return null;
    }
};

exports.handler = async (event) => {
    try {
        const { userId, followingUserIds } = JSON.parse(event.body);
        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid user id, or missing action' }),
            };
        }
        if (!followingUserIds || followingUserIds.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'User is not following anyone' }),
            };
        }
        const allFollowedUserIds = [];

        // Fetch followed user IDs for each user you are following
        for (const followingUserId of followingUserIds) {
            const followedUserIds = await getFollowingData(followingUserId);
            // Concatenate the arrays of followed user IDs
            allFollowedUserIds.push(...followedUserIds);
        }

        // Remove duplicates and filter out own ID
        const uniqueFollowedUserIds = Array.from(new Set(allFollowedUserIds)).filter(id => id !== userId);

        // Filter out users you are already following
        const usersYouMayKnow = uniqueFollowedUserIds.filter(id => !followingUserIds.includes(id));


        // Enrich usersYouMayKnow with profile data and photo URLs
        const enrichedUsersYouMayKnow = await Promise.all(
            usersYouMayKnow.map(async (userId) => {
                const userData = await getUserProfileData(userId); // Fetch profile data
                const photoUrl = await getPhotoUrl(userId); // Fetch photo URL

                return {
                    userId,
                    profileData: userData, // Add profile data
                    photoUrl // Add photo URL
                };
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ usersYouMayKnow: enrichedUsersYouMayKnow }),
        };
    } catch (error) {
        console.error('Failed to fetch following data', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch following data' }),
        };
    }
};