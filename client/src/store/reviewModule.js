import axios from 'axios';

import sanity from '../client'; 

export default {
  namespaced: true,
  state: () => ({
    excerpts: [],
    reviewItems: [],
    total_reviews: 0,
    comments: [],
    totalComments: 0,
  }),
  mutations: {
    // Reviews
    SET_REVIEWS(state, reviewItems) {
      state.reviewItems = reviewItems;
    },
    SET_TOTAL_REVIEWS(state, total_reviews) {
      state.total_reviews = total_reviews;
    },
    INCREMENT_TOTAL_REVIEWS(state, increment = 1) {
      state.total_reviews += increment;
    },

    // Comments
    ADD_COMMENT(state, { reviewId, comment }) {
      const review = state.reviewItems.find((r) => r._id === reviewId);
      if (review) {
        if (!review.comments) {
          review.comments = [];
        }
        review.comments.push(comment);
      }
    },
    SET_COMMENTS(state, { reviewId, comments }) {
      const review = state.reviewItems.find((r) => r._id === reviewId);
      if (review) {
        review.comments = comments;
      }
    },
    CLEAR_COMMENTS(state, reviewId) {
      const review = state.reviewItems.find((r) => r._id === reviewId);
      if (review) {
        review.comments = [];
      }
    },
  },
  actions: {
    async SubmitReview({ commit }, { reviewedItem, rating, userId, userName, fetchedTitle, fetchedImage, reviewedItemDescription }) {
      try {
         const response = await axios.post(`/.netlify/functions/postReview`, { reviewedItem, rating, userId, userName, fetchedTitle, fetchedImage, reviewedItemDescription });
         if (response.status === 200) {
          commit('INCREMENT_TOTAL_REVIEWS');
          return { success: true, message: 'Review submitted successfully' }
          } else {
            return { success: false, message: 'Failed to submit review' };
          }
     } catch (error) {
       console.error("Error submitting review:", error);
       return { success: false, message: 'Failed to submit review' };
     }
  },

    async FetchReviews( {commit}, limit = null  ) {
      console.log("fetching reviews");
      const query = `*[_type == "review"] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''}`
      const count_query = 'count(*[_type == "review"])'
      try {
        const reviewItems = await sanity.fetch(query);
        console.log("reviewItems", reviewItems);
         let enrichedReviewItems = [];
          // Fetch comments for each review asynchronously
         for (const review of reviewItems) {
           try {
             const response = await axios.post(`/.netlify/functions/getUserComments`, { reviewId: review._id });
             if (response.status === 200) {
               review.comments = response.data.comments;
             } else {
               review.comments = [];
             }
           } catch (error) {
             if (error.response && error.response.status === 404) {
               console.log(`No comments found for review ID: ${review._id}`);
               review.comments = []; 
             } else {
               console.error(`Error fetching comments for review ID ${review._id}:`, error);
               review.comments = []; 
             }
           }
           
           enrichedReviewItems.push(review);
         }
         commit('SET_REVIEWS', enrichedReviewItems);
         sanity.fetch(count_query).then(count => {
          commit('SET_TOTAL_REVIEWS', count)
        })
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },

    async LoadReviews ({ commit, state }, limit = 10)  {
      console.log("loading reviews");
      console.log(limit);
			const query = `*[_type == "review"] | order(_createdAt desc) [${state.reviewItems.length}...${state.reviewItems.length + limit}]`
      try {
        const reviewItems = await sanity.fetch(query);
         let enrichedReviewItems = [];
         for (const review of reviewItems) {
           try {
             const response = await axios.post(`/.netlify/functions/getUserComments`, { reviewId: review._id });
             if (response.status === 200) {
               review.comments = response.data.comments;
             } else {
               review.comments = [];
             }
           } catch (error) {
             if (error.response && error.response.status === 404) {
               console.log(`No comments found for review ID: ${review._id}`);
               review.comments = []; 
             } else {
               console.error(`Error fetching comments for review ID ${review._id}:`, error);
               review.comments = []; 
             }
           }
           enrichedReviewItems.push(review);
         }
         console.log("new enrichedReviewItems", enrichedReviewItems);
         console.log(enrichedReviewItems);
         commit('SET_REVIEWS', [...state.reviewItems, ...enrichedReviewItems]);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    
    async fetchComments({ commit }, { reviewId }) {
      try {
        const response = await axios.post(`/.netlify/functions/getUserComments`, { reviewId });
        if (response.status === 200) {
          commit('SET_COMMENTS', { reviewId, comments: response.data.comments });
        } else {
          commit('CLEAR_COMMENTS', reviewId);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        commit('CLEAR_COMMENTS', reviewId);
      }
    },

  async postComment({ commit, dispatch }, { action = 'add', text, reviewId, userId, displayName, commentId = null, parentCommentId }) {
    try {
      const payload = {
          action,
          text,
          reviewId,
          userId,
          displayName,
          commentId, 
          parentCommentId,
      };

      const response = await axios.post(`/.netlify/functions/postUserComments`, payload);
      
      if (response.status >= 200 && response.status < 300) {
        
          if(action === 'add' || action === 'reply') {
              commit('ADD_COMMENT', response.data);
          } else if(action === 'delete') {
              // Handle deletion locally if necessary, e.g., remove the comment from state
          }

          dispatch('fetchComments', { reviewId });
      }
  } catch (error) {
      console.error("Error posting comment:", error);
  }
},
},
  getters: {
    reviewItems: (state) => state.reviewItems.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()),
  },
};
