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
    try {
      const { query } = JSON.parse(event.body);
      const usersRef = db.collection('users');
  
    
      const snapshot = await usersRef
        .where('displayName', '>=', query)
        .where('displayName', '<=', query + '\uf8ff')
        .get();
  
      if (snapshot.empty) {
        return {
          statusCode: 200,
          body: JSON.stringify({ results: [] }),
        };
      }
  
      const users = snapshot.docs.map(doc => ({
        userId: doc.id, 
        ...doc.data() 
         }));
      return {
        statusCode: 200,
        body: JSON.stringify({ results: users }),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch users" }),
      };
    }
  };