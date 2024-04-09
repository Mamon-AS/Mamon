import axios from 'axios';
import sanity from '../client'; 
import { getUserComments } from '../utils';

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
    SET_REVIEWS(state, reviewItems) {
      state.reviewItems = reviewItems;
    },
    APPEND_REVIEW(state, newReview) {
      state.reviewItems.push(newReview);
    },
    SET_TOTAL_REVIEWS(state, total_reviews) {
      state.total_reviews = total_reviews;
    },
    SET_REVIEWS_ERROR(state, error) {
      state.reviewItems = { error };
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
    DELETE_COMMENT(state, { reviewId, commentId }) { 
      const review = state.reviewItems.find((r) => r._id === reviewId)
      if (review) {
        review.comments = review.comments.filter((c) => c._id !== commentId);
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
    async SubmitReview({ commit, dispatch }, { reviewedItem, rating, userId, userName, fetchedTitle, fetchedImage, reviewedItemDescription }) {
      try {
         const response = await axios.post(`/.netlify/functions/postReview`, { reviewedItem, rating, userId, userName, fetchedTitle, fetchedImage, reviewedItemDescription });
         if (response.status === 200) {
          const newReview = (response.data);
          commit('APPEND_REVIEW', newReview);
          dispatch('invalidateReviewCaches', userId)

          return { success: true, message: 'Review submitted successfully' };
        } else {
          return { success: false, message: 'Failed to submit review' };
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        return { success: false, message: 'Failed to submit review' };
      }
  },

  async FetchPersonalReviews({ commit }, userId) {
    const cacheKey = `reviews_${userId}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < 3600000) { 
          commit('SET_REVIEWS', data.reviewItems);
          commit('SET_TOTAL_REVIEWS', data.totalReviews);
          return;
      } else {
          console.log("Personal reviews cache expired, fetching new data");
          localStorage.removeItem(cacheKey); // Remove expired cache
      }
  }
  
    // Continue to fetch new data if cache is expired or not present
    console.log("fetching new data");
    const query = `*[_type == "review" && userId == "${userId}"] | order(_createdAt desc)`;
    const count_query = `count(*[_type == "review" && userId == "${userId}"])`;
  
    try {
      const personalReviews = await sanity.fetch(query);
      const enrichedPersonalReviews = await Promise.all(personalReviews.map(async (review) => {
        const comments = await getUserComments(review._id);
        return { ...review, comments };
      }));

      commit('SET_REVIEWS', enrichedPersonalReviews);
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: { reviewItems: enrichedPersonalReviews, totalReviews: count }
      }));
      const count = await sanity.fetch(count_query);
      commit('SET_TOTAL_REVIEWS', count);
    } catch (error) {
      console.error("Error fetching personal reviews:", error);
    }
  },

  async FetchFollowingReviews({ commit }, payload) {
    const { limit, userId, currentUserId } = payload;
    const cacheKey = `followingReviewsCache_${userId}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      if (Date.now() - timestamp < 3600000) { 
          console.log("Using cached reviews");
          commit('SET_REVIEWS', data.reviewItems);
          commit('SET_TOTAL_REVIEWS', data.totalReviews);
          return;
      } else {
          console.log("Following reviews cache expired, fetching new data");
          localStorage.removeItem(cacheKey); // Remove expired cache
        }
    }
    
    try {
      console.log("fetching new data");
      const response = await axios.post(`/.netlify/functions/getSpecificFollowingReview`, { userId, limit, currentUserId });
      if (response.status === 200) {
        let followingReviews = response.data; 
        let count_query
        let enrichedFollowingReviews = [];
        for (const review of followingReviews) {
          try {

            const sanityQuery = `*[_type == "review" && _id == "${review.sanityReviewId}"]`;
            count_query = `count(*[_type == "review" && _id == "${review.sanityReviewId}"])`;
            const sanityReviewDetails = await sanity.fetch(sanityQuery);
            if (sanityReviewDetails.length > 0) {
              const sanityReview = sanityReviewDetails[0];
              review._updatedAt = sanityReview._updatedAt;
              review.reviewedItem = sanityReview.reviewedItem; 
              review.reviewedImage = sanityReview.reviewedImage;
              review._type = sanityReview._type;
              review._createdAt = sanityReview._createdAt;
              review._id = sanityReview._id;
            }

          } catch (error) {
            console.log(`Error enriching review ID: ${review.sanityReviewId}`, error);
            review.comments = []; 
          }
        
          enrichedFollowingReviews.push(review);
          console.log("enrichedFollowingReviews ", enrichedFollowingReviews);
        }
  
        commit('SET_REVIEWS', enrichedFollowingReviews);
        sanity.fetch(count_query).then(count => {
          // Cache the enriched data
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: { reviewItems: enrichedFollowingReviews }
          }))
          commit('SET_TOTAL_REVIEWS', count)
        })
    
      } else {
        console.error("Unexpected response status:", response.status);
        if (response.status === 403) {
          console.log("403 Forbidden error encountered:", response.data.error);
          commit('SET_REVIEWS_ERROR', response.data.error);
        }
      }
    } catch (error) {
      console.error("Error fetching following reviews:", error);
      commit('SET_REVIEWS_ERROR', "You are not following this user");
    }
  },
    
  async FetchAllFollowingReviews({ commit }, payload) {
    const { limit, userId } = payload;

    const cacheKey = `allFollowingReviewsCache_${userId}`;
    const cachedData = localStorage.getItem(cacheKey);

     if (cachedData) {
       const { timestamp, data } = JSON.parse(cachedData);
       if (Date.now() - timestamp < 3600000) { 
           commit('SET_REVIEWS', data.reviewItems);
           commit('SET_TOTAL_REVIEWS', data.totalReviews);
           return;
       } else {
           console.log("ALL following reviews cache expired, fetching new data");
           localStorage.removeItem(cacheKey); // Remove expired cache
         }
     }
    
    try {
      console.log("fetching new data");
      const response = await axios.post(`/.netlify/functions/getAllFollowingReviews`, { userId, limit });
      if (response.status === 200) {
        let followingReviews = response.data; 
        let countPromises = [];
        let enrichedFollowingReviews = [];
        for (const review of followingReviews) {
          try {
            const sanityQuery = `*[_type == "review" && _id == "${review.sanityReviewId}"]`;
            const count_query = `count(*[_type == "review" && _id == "${review.sanityReviewId}"])`;
            countPromises.push(sanity.fetch(count_query));
            const sanityReviewDetails = await sanity.fetch(sanityQuery);
            console.log("sanityReviewDetails ", sanityReviewDetails);
            if (sanityReviewDetails.length > 0) {
              const sanityReview = sanityReviewDetails[0];
              review._updatedAt = sanityReview._updatedAt;
              review.reviewedItem = sanityReview.reviewedItem; 
              review.reviewedImage = sanityReview.reviewedImage;
              review._type = sanityReview._type;
              review._createdAt = sanityReview._createdAt;
              review._id = sanityReview._id;
            }

          } catch (error) {
            console.log(`Error enriching review ID: ${review.sanityReviewId}`, error);
            review.comments = []; 
          }
          enrichedFollowingReviews.push(review);

        }
  
        commit('SET_REVIEWS', enrichedFollowingReviews);
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: { reviewItems: enrichedFollowingReviews }
        }))
        
        Promise.all(countPromises)
        .then(counts => {
            // Sum up all counts to get the total
            const totalReviews = counts.reduce((acc, count) => acc + count, 0);
            commit('SET_TOTAL_REVIEWS', totalReviews);
        })
        .catch(error => {
            console.error("Error fetching review counts:", error);
        });

    
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching following reviews:", error);
      commit('SET_REVIEWS_ERROR', error);
    }
  
  },
  async fetchSingleReview({ commit }, reviewId ) {
    const query = `*[_type == "review" && _id == "${reviewId}"]`    
    try {
        const reviewItems = await sanity.fetch(query); 
        const enrichedReviewItems = await Promise.all(reviewItems.map(async (review) => {
          const comments = await getUserComments(review._id);
          return { ...review, comments };
        }));
        commit('SET_REVIEWS', enrichedReviewItems);        
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },
    async LoadReviews ({ commit, state }, limit = 10)  {
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

  async postComment({ commit, dispatch }, { action = 'add', text, reviewId, userId, displayName, commentId = null, parentCommentId, notificationUserId }) {
    try {
      const payload = {
          action,
          text,
          reviewId,
          userId,
          displayName,
          commentId, 
          parentCommentId,
          notificationUserId
      };
      console.log('Posting comment:', payload);
      const response = await axios.post(`/.netlify/functions/postUserComments`, payload);
        
        if (response.status >= 200 && response.status < 300) {
          dispatch('invalidateReviewCaches', userId)
          if(action === 'add' || action === 'reply') {
              commit('ADD_COMMENT', response.data);
            } 
            dispatch('fetchComments', { reviewId });
          }
      } catch (error) {
          console.error("Error posting comment:", error);
      }
    },
    async deleteComment({ dispatch, commit }, { action = 'delete', reviewId, commentId, userId }) {
      try {
        const payload = {
            action,
            reviewId,
            commentId,
            userId
        };

        const response = await axios.post(`/.netlify/functions/postUserComments`, payload);
        
        if (response.status >= 200 && response.status < 300) {
          dispatch('invalidateReviewCaches', userId)
          commit('DELETE_COMMENT', response.data);
          dispatch('fetchComments', { reviewId });
        }
      } catch (error) {
          console.error("Error deleting comment:", error);
      }
    },
    async invalidateReviewCache({ commit }, reviewId) {
      localStorage.removeItem(`reviews_${reviewId}`);
  },
  
  async invalidateReviewCaches({ commit }, userId) {
      localStorage.removeItem(`reviews_${userId}`);
      localStorage.removeItem(`followingReviewsCache_${userId}`);
      localStorage.removeItem(`allFollowingReviewsCache_${userId}`);
  },

  },
  getters: {
    reviewItems: (state) => {
      if (state.reviewItems && Array.isArray(state.reviewItems)) {
        return state.reviewItems.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
      }
      return [];
    } 
  },
    
};
