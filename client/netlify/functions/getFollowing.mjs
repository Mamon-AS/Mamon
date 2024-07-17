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
const defaultPhotoUrl = '/images/blank_profile.jpg';

const getFollowingData = async (followingId) => {
    const followingRef = db.doc(`users/${followingId}`);
    const followingProfileSnapshot = await followingRef.get();
    const followingProfile = followingProfileSnapshot.data();

    return followingProfile;
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

exports.handler = async (event) => {
    try {
        const { userId, action } = JSON.parse(event.body);
        if (!userId || !action) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid user id, or missing action' }),
            };
        }
        
        // Fetch following:
        // 1. The profile picture is in firebase storage
        // 2. Followers and following are in firestore
        // 3. Name is fetched from the followers collection document and not from the user's profile

        if (action === 'followers') {
            try {
            const followersRef = db.collection(`users/${userId}/followers`);
            const snapshot = await followersRef.get();
            const followersDataPromises = snapshot.docs.map(async (doc) => {
                const followerData = doc.data(); 
                const followerId = doc.id;
        
                const followerProfile = await getFollowingData(followerId);
                const photoUrl = await getPhotoUrl(followerId);

                return {
                    userId: followerId,
                    name: followerData.name, 
                    bio: followerProfile ? followerProfile.bio : '', 
                    photoUrl: photoUrl,
                };
            });
            
            const followersData = await Promise.all(followersDataPromises);

            return {
                statusCode: 200,
                body: JSON.stringify({ following: followersData }),
            };
            
            } catch (error) {
                console.error('Error fetching user data:', error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: error.message }),
                };
            }

        } else if (action === 'following') {
            const followingRef = db.collection(`users/${userId}/following`);
            const snapshot = await followingRef.get();
            const followingDataPromises = snapshot.docs.map(async (doc) => {
            const followingData = doc.data(); 
            const followingId = doc.id;
            
            const followingProfile = await getFollowingData(followingId);
            const photoUrl = await getPhotoUrl(followingId);

            return {
                userId: followingId,
                name: followingData.name, 
                bio: followingProfile ? followingProfile.bio : '', 
                photoUrl: photoUrl,
            };
            });
                const followingData = await Promise.all(followingDataPromises);

                return {
                    statusCode: 200,
                    body: JSON.stringify({ following: followingData }),
                    };
                    
                }
            }
            catch (error) {
                console.error('Error fetching user data:', error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: error.message }),
                };
            }
};