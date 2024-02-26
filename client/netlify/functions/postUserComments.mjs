import admin from 'firebase-admin';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
import { log } from 'console';

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
    try {
        const { action, commentId, text, reviewId, userId, displayName, parentCommentId } = JSON.parse(event.body);
        if (!action || !['add', 'delete', 'reply'].includes(action)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid or missing action field' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        if ((action === 'add' || action === 'reply') && (!text || !reviewId || !userId || !displayName)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        } else if (action === 'delete' && (!commentId || !reviewId || !userId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };

        } 

        // Limit comment length to 280 characters
        if ( (action === 'add' || action === 'reply') && text.length > 280) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Comment exceeds 280 characters' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        const reviewRef = db.collection('reviews').doc(reviewId);
        const reviewDoc = await reviewRef.get();

        const createdAt = new Date();

        if (!reviewDoc.exists) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Review does not exist' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
        let { comments = [], totalComments = 0 } = reviewDoc.data();
        comments = Array.isArray(comments) ? comments : [];
        if (action === 'delete') {
            comments = comments.map(comment => {
                // If the comment itself is the target
                if (comment.commentId === commentId && comment.userId === userId) {
                    totalComments--; 
                    return null; 
                }
                
                // targeting a reply within the comment
                if (comment.replies && Array.isArray(comment.replies)) {
                    const initialLength = comment.replies.length;   
                    comment.replies = comment.replies.filter(reply => reply.commentId !== commentId || reply.userId !== userId);
                    // If the length changed, a reply was deleted
                    if (comment.replies.length < initialLength) {
                        totalComments--; // Decrement total comments count
                    }
                }
            
                return comment; 
            }).filter(comment => comment !== null); 
        } else {
            if (parentCommentId) {
                const parentCommentIndex = comments.findIndex(comment => comment.commentId === parentCommentId);
                if (parentCommentIndex !== -1) {
                    comments[parentCommentIndex].replies = Array.isArray(comments[parentCommentIndex].replies) ? comments[parentCommentIndex].replies : [];
                    comments[parentCommentIndex].replies.push({ commentId: uuidv4(), text, displayName, userId, createdAt });
                }
            } else {
                const existingCommentIndex = comments.findIndex(comment => comment.commentId === commentId && comment.userId === userId);
                if (existingCommentIndex !== -1) {
                    comments[existingCommentIndex].text = text;
                } else {
                    comments.push({ commentId: uuidv4(), text, displayName, userId, createdAt });
                    totalComments += 1;
                }
            }
        }

        await reviewRef.update({ comments, totalComments });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Comments updated successfully',
                comment: {
                    commentId,
                    text,
                    displayName,
                    userId,
                    createdAt,
                    parentCommentId,
                }
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update comments' }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
}