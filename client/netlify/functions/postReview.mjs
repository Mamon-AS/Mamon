import admin from 'firebase-admin';
import { Buffer } from 'buffer';
import axios from 'axios';

import sanity from './sanityClient';

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
async function uploadImageToSanity(imageUrl) {
    try {
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(response.data);
        const imageAsset = await sanity.assets.upload('image', buffer, {
            filename: 'reviewImage.jpg',
            contentType: 'image/jpeg',
          });

        return imageAsset
    } catch (error) {
        console.error('Error uploading image to Sanity:', error);
        throw error;
    }
}

  exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    try {
        const { reviewedItem, rating, userId, userName, fetchedTitle, fetchedImage, reviewedItemDescription } = JSON.parse(event.body);
        const uploadedImageAsset = await uploadImageToSanity(fetchedImage);
        
        const imageReference = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: uploadedImageAsset._id,
            }
          };

          
        const createdReview = await sanity.create({
            _type: 'review',
            reviewedItem: fetchedTitle,
            rating: rating,
            userId: userId,
            userName: userName,
            description: reviewedItemDescription,
            reviewedImage: imageReference,
          });

          const sanityReviewId = createdReview._id;
          await db.collection('reviews').doc(sanityReviewId).set({
            sanityReviewId: sanityReviewId,
            userId: userId,
            userName: userName,
            reviewedItem: fetchedTitle,
            rating:rating,
            description: reviewedItemDescription
          });
          return {
            statusCode: 200,
            body: JSON.stringify(createdReview),
          };

    } catch (error) {
        console.error('Error submitting review:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to submit review' }),
        };
      }
    
    

}