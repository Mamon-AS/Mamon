<template>
     <div class="p-4 max-w-md mx-auto mt-7" v-if="!reviewExists">
      <form @submit.prevent="submitReview"> 
        <div class="mb-4">
        <label for="reviewedItem" class="block text-gray-700 text-sm font-bold mb-2">Produkt:</label>
        <input type="text" id="reviewedItem" v-model="review.reviewedItem" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" readonly>
      </div> 
      <div class="mb-4" v-if="review.reviewedItem">
        <img :src="review.itemImage" alt="Item Image" class="w-full h-auto rounded">
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
              <i class="fa-solid fa-circle-info text-lg ml-2" style="color: #096191; margin-top: -1.3rem; margin-left: -0.1rem;" @click="showInfoModal = !showInfoModal"></i>
          </div>
        <!-- Information Modal -->
        <div v-if="showInfoModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3 text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <i class="fa-solid fa-circle-info text-blue-600"></i>
              </div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Stjernekartet</h3>
              <ul class="mt-2 px-7 py-3 text-center space-y-4 text-md text-gray-900">
                <li>⭐<br>Anbefales virkelig ikke.</li>
                <li>⭐⭐<br>Litt dårligere enn hva jeg forventet.</li>
                <li>⭐⭐⭐<br>Som forventet - Fornøyd. Dette er normalen, og 3-5 stjerner indikerer et godt kjøp.</li>
                <li>⭐⭐⭐⭐<br>Litt bedre enn hva jeg forventet.</li>
                <li>⭐⭐⭐⭐⭐<br>Anbefales!</li>
              </ul>
              <div class="items-center px-4 py-3">
                <button id="ok-btn" @click="showInfoModal = false" class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Information Modal END -->

        <div class="mb-4">
          <label for="reviewedItemDescription" class="block text-gray-700 text-sm font-bold mb-2 mt-3">Noe mer på hjertet? 💓</label>
          <textarea id="reviewedItemDescription"  v-model="review.reviewedItemDescription" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
      </div>
  
        <div class="flex items-center justify-center">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Publiser
          </button>
        </div>

        <div v-if="loading" class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      <div v-else-if="review.submissionStatus === 'exists'" class="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400" role="alert">
        <span class="font-medium">Du har allerede vurdert dette produktet!</span>
      </div>
      <div v-else-if="review.submissionStatus === 'success'" class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
        <span class="font-medium">Tips registrert!</span> Har du lyst til å legge til en til? 😊
      </div>
      <div v-else-if="review.submissionStatus === 'error'" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        <span class="font-medium">Ops!</span> Noe gikk galt, Martin har kanskje svaret.
      </div>
    </form>
  </div>
  <div v-else class="p-4 max-w-md mx-auto mt-7 text-center text-red-600">
    <p>Du har allerede vurdert dette produktet!</p>
  </div>
   <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold text-center mb-4">Se hva andre har skrevet:</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ReviewCard v-for="item in posts" :key="item.reviewId" :reviewItems="item" />
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from 'vuex';
import axios from 'axios';

import ReviewCard from '../components/Reviews/ReviewCard.vue';

export default {
  components: {
    ReviewCard,
  },
  setup() {
    const review = reactive({
      reviewedItem: '',
      itemImage: '',
      rating: null,
      userId: '',
      userName: '',
      reviewedItemDescription: '',
      submissionStatus: null,
    });

    const reviewItems = ref([]);
    const posts = computed(() => store.getters['reviews/reviewItems']);

    const store = useStore();
    const hoverIndex = ref(0);
    const user = ref(null);
    const loading = ref(false);
    const showInfoModal = ref(false);
    const reviewExists = ref(false);

    const fetchReviewDetails = async (token) => {
      try {
        const response = await axios.post(`/.netlify/functions/getReviewDetails`, { token });

        if (response.data.success) {
          review.reviewedItem = response.data.reviewedItem;
          review.itemImage = response.data.itemImage;
          review.website = response.data.website;
          review.url = response.data.url;

          const reviewCheckResponse = await axios.post(`/.netlify/functions/checkReviewExists`, { userId: review.userId, reviewedItem: review.reviewedItem });

          if (reviewCheckResponse.data.exists) {
            reviewExists.value = true;
          } else {
            reviewExists.value = false;
          }
        } else {
          console.error('Invalid token');
        }
      } catch (error) {
        console.error('Error fetching review details:', error);
      }
    };

    const fetchReviews = async (userId) => {
      loading.value = true;
      try {
        let payload = { limit: 4, userId };
        const response = await store.dispatch('reviews/FetchAllFollowingReviews', payload);
        reviewItems.value = response.data.reviews;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          user.value = currentUser;
          review.userId = currentUser.uid;
          review.userName = currentUser.displayName;
          fetchReviews(review.userId);
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
          if (token) {
            fetchReviewDetails(token);
          }
        } else {
          alert('Du må være innlogga!');
        }
      });
    });

    const setRating = (rating) => {
      review.rating = rating;
    };

    const hoverRating = (star) => {
      hoverIndex.value = star;
    };

    const resetReviewForm = () => {
      review.reviewedItem = '';
      review.rating = null;
      review.reviewedItemDescription = '';
    };

    const submitReview = async () => {
      loading.value = true;
      const result = await store.dispatch('reviews/SubmitReview', review);
      loading.value = false;
      if (result.success) {
        review.submissionStatus = 'success';
        resetReviewForm();
      } else {
        review.submissionStatus = 'error';
      }
    };

    return {
      review,
      reviewItems,
      posts,
      hoverIndex,
      user,
      loading,
      setRating,
      hoverRating,
      submitReview,
      showInfoModal,
      reviewExists,
    };
  },
};
</script>