<template>
    <div class="p-4 max-w-md mx-auto">
      <form @submit.prevent="submitReview">
        <div class="mb-4">
          <label for="reviewedItem" class="block text-gray-700 text-sm font-bold mb-2">Reviewed Item:</label>
          <input type="text" id="reviewedItem" v-model="review.reviewedItem" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
  
        <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
        <div class="flex items-center">
            <span v-for="star in 5" :key="star" class="cursor-pointer" @click="setRating(star)" @mouseover="hoverRating(star)" @mouseleave="hoverRating(0)">
            <svg v-if="star <= hoverIndex || star <= review.rating" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 .587l3.668 7.431 8.332 1.21-6.02 5.864 1.42 8.308-7.4-3.89-7.4 3.89 1.42-8.308-6.02-5.864 8.332-1.21z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300 hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 .587l3.668 7.431 8.332 1.21-6.02 5.864 1.42 8.308-7.4-3.89-7.4 3.89 1.42-8.308-6.02-5.864 8.332-1.21z"/>
            </svg>
            </span>
        </div>
        </div>
  
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import sanity from "../client";
  
  export default {
    data() {
      return {
        review: {
          reviewedItem: '',
          rating: null,
          userId: ''
        },
        hoverIndex: 0,
        user: null 
      }
    },
    created() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user;
          this.review.userId = user.uid; 
        } else {
            alert('Du må være innlogga!')
        }
      });
    },
    methods: {
      setRating(rating) {
        this.review.rating = rating
      },
      hoverRating(star) {
        this.hoverIndex = star;
      },
      async submitReview() {
        try {
          await sanity.create({
            _type: 'review',
            reviewedItem: this.review.reviewedItem,
            rating: this.review.rating,
            userId: this.review.userId
          })
          // after submitting reset the form but keep the userId and set the hoverIndex back to 0
          this.review = { reviewedItem: '', rating: null, userId:this.review.userId, hoverRating: 0}
          alert('Registrert!')
        } catch (err) {
          console.error('Submission error:', err)
          alert('Error submitting review')
        }
      }
    }
  }
  </script>
  

  