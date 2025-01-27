<template>
  <main class="home-page flex flex-col justify-between min-h-screen mt-7">
  <div class="container mx-auto p-4">
    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    <div v-else>
      <template v-if="reviews.length > 0">
        <div class="w-auto m-auto" style="max-width: calc(100vw/2);">
          <ReviewCard v-for="review in reviews" :reviewItems="review" :key="review.sanityReviewId" />
        </div>

        <button v-if="$store.state.reviews.total_reviews > reviews.length"
                @click="$store.dispatch('reviews/LoadReviews', 8)"
                class="btn mt-8">
          Les mer ({{ $store.state.reviews.total_reviews - reviews.length }})
        </button>
      </template>
      <template v-else>
        <p class="text-center text-gray-500">Woah, such empty?</p>
      </template>
    </div>
  </div>
</main>
</template>

<script>
import { onMounted, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ReviewCard from '../components/Reviews/ReviewCard.vue'

export default {
  components: {
    ReviewCard
  },
  
  setup() {
    const store = useStore();
    const reviews = computed(() => store.getters['reviews/reviewItems']);
    const auth = getAuth();
    const userId = ref(null);
    const loading = ref(false);
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.value = user.uid;
      }
    });
    
    const fetchReviews = async () => {
      loading.value = true
      try {
        let payload = { limit: 4 };
        payload.userId = auth.currentUser.uid;
        await store.dispatch('reviews/FetchAllFollowingReviews', payload);
        
      } catch (error) {
        console.error(error);
      }finally {
        loading.value = false;
      }
    };
        
    watch(userId, (newUserId) => {
      if (newUserId) {
        fetchReviews();
      }
    }, { immediate: true });
    
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchReviews();
        } else {
          console.error("User not authenticated.");
        }
      });
    });

    return {
      reviews,
      loading
    };
  }
}
</script>
