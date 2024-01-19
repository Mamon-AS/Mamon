<template>

    <div class="p-4 max-w-md mx-auto">
      <form @submit.prevent="submitReview">
        <div class="mb-4">
          <label for="reviewedItem" class="block text-gray-700 text-sm font-bold mb-2">Lim inn:</label>
          <input type="text" id="reviewedItem" v-model="review.reviewedItem" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
        </div>
  
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Stjerner:</label>
          <div class="flex items-center">
              <span v-for="star in 5" :key="star" class="cursor-pointer" @click="setRating(star)" @mouseover="hoverRating(star)" @mouseleave="hoverRating(0)">
                <svg v-if="star <= hoverIndex || star <= review.rating" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-mamonblue" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 .587l3.668 7.431 8.332 1.21-6.02 5.864 1.42 8.308-7.4-3.89-7.4 3.89 1.42-8.308-6.02-5.864 8.332-1.21z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300 hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 .587l3.668 7.431 8.332 1.21-6.02 5.864 1.42 8.308-7.4-3.89-7.4 3.89 1.42-8.308-6.02-5.864 8.332-1.21z"/>
                </svg>
              </span>
          </div>

        <div class="mb-4">
          <label for="reviewedItemDescription" class="block text-gray-700 text-sm font-bold mb-2 mt-3">Noe mer på hjertet? 💓</label>
          <textarea id="reviewedItemDescription"  v-model="review.reviewedItemDescription" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div class="metadata-preview">
          <p> {{ review.fetchedTitle }}</p>
            <div v-if="review.fetchedImage">
              <img :src="review.fetchedImage" alt="Fetched Image" />
            </div>
        </div>
      </div>
  
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Send inn anmeldelsen
          </button>
        </div>

        <div v-if="loading" class="flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>

        <div v-else-if="submissionStatus === 'success'" class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <span class="font-medium">Anmeldelse registrert!</span> Har du lyst til å legge til en til? 😊
        </div>
        <div v-else-if="submissionStatus === 'error'" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span class="font-medium">Ops!</span> Noe gikk galt, Martin har kanskje svaret.
        </div>
  
      </form>
    </div>

  </template>
  
  <script>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import axios from 'axios';

  import sanity from "../client";
  
  export default {
    data() {
      return {
        review: {
          reviewedItem: '',
          rating: null,
          userId: '',
          fetchedTitle: '',
          fetchedImage: '',
          reviewedItemDescription: '',
          submissionStatus: null,
        },
        hoverIndex: 0,
        user: null ,
        loading: null
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

      async fetchMetadata() {
      if (!this.review.reviewedItem) {
        alert('Please enter a URL');
        return;
      }

      try {
        console.log('Fetching metadata for', this.review.reviewedItem);
        const response = await axios.post(`/.netlify/functions/fetchMetadata`, {
          url: this.review.reviewedItem
        });


        const metadata = response.data;
        this.review.fetchedTitle = metadata.title;
        this.review.fetchedImage = metadata.image;



        console.log(metadata); 
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    },
    // We cannot directly upload an image to the schema so we need to upload it to Sanity first and then get the reference to the image asset
    async uploadImageToSanity(blob, filename) {
      try {
        // Create a new file from the blob
        const file = new File([blob], filename, { type: blob.type });

        // Upload the file to Sanity
        const imageAsset = await sanity.assets.upload('image', file);

        // Return the image asset reference
        return {
          _type: 'reference',
          _ref: imageAsset._id
        };
      } catch (error) {
        console.error('Error uploading image to Sanity:', error);
        throw error; 
      }
    },
  async submitReview() {
    this.loading = true;
    try {
      const imageBlob = await this.fetchImageAsBlob(this.review.fetchedImage);
      if (!imageBlob) {
        throw new Error('Failed to fetch image');
      }

      const uploadedImageRef = await this.uploadImageToSanity(imageBlob, 'reviewImage.jpg');

      if (!uploadedImageRef) {
        throw new Error('Failed to upload image to Sanity');
      }

      console.log('Uploaded image to Sanity:', uploadedImageRef);
      console.log(this.review.reviewedItemDescription)



      await sanity.create({
        _type: 'review',
        reviewedItem: this.review.fetchedTitle,
        rating: this.review.rating,
        userId: this.review.userId,
        description: this.review.reviewedItemDescription,
        reviewedImage: {
          _type: 'image',
          asset: uploadedImageRef
        }
      });

      // Reset the form and success status
      this.review = { reviewedItem: '', rating: null, userId: this.review.userId, reviewedItemDescription: '', hoverRating: 0 };
      this.submissionStatus = 'success';
      this.loading = false;
    } catch (err) {
      console.error('Submission error:', err);
      this.submissionStatus = 'error';
      this.loading = false;
      }finally {
      this.loading = false; 
    }
  },

async fetchImageAsBlob(imageUrl) {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.blob();
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    },

      
    }, // Methods end

    watch: {
      'review.reviewedItem': function(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.fetchMetadata();
          }
        }
      },


    }
  </script>
  <style scoped>

  </style>
  

  