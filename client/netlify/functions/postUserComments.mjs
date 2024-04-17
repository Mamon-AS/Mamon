import admin from 'firebase-admin';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';

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
        const { action, commentId, text, reviewId, userId, displayName, parentCommentId, notificationUserId } = JSON.parse(event.body);
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
        console.log('Updating comments... for action:', action, 'commentId:', commentId, 'text:', text, 'reviewId:', reviewId, 'userId:', userId, 'displayName:', displayName, 'parentCommentId:', parentCommentId, ' notificationUserId:', notificationUserId);
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
        let newOrReplyCommentId = null;

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
                newOrReplyCommentId = uuidv4();
                const parentCommentIndex = comments.findIndex(comment => comment.commentId === parentCommentId);
                if (parentCommentIndex !== -1) {
                    comments[parentCommentIndex].replies = Array.isArray(comments[parentCommentIndex].replies) ? comments[parentCommentIndex].replies : [];
                    comments[parentCommentIndex].replies.push({ commentId: newOrReplyCommentId, text, displayName, userId, createdAt });
                }
            } else {
                const existingCommentIndex = comments.findIndex(comment => comment.commentId === commentId && comment.userId === userId);
                if (existingCommentIndex !== -1) {
                    comments[existingCommentIndex].text = text;
                } else {
                    newOrReplyCommentId = uuidv4();
                    comments.push({ commentId: newOrReplyCommentId, text, displayName, userId, createdAt });
                    totalComments += 1;
                }
            }
        }
       
        await reviewRef.update({ comments, totalComments });
        if(userId !== notificationUserId) {
            if (action === 'add' || action === 'reply') {
                const notificationMessage = action === 'add' ? 
                    `${displayName} kommenterte "${text}" på din anmeldelse.` : 
                    `${displayName} svarte med "${text}" på din kommentar.`;

                const notificationData = {
                    userId: reviewDoc.data().userId,
                    type: 'comment',
                    message: notificationMessage,
                    seen: false,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    reviewId: reviewId,
                    notificationUserId: notificationUserId,
                    commentId: newOrReplyCommentId
                };
            
                await db.collection('notifications').add(notificationData);
            }
        }
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