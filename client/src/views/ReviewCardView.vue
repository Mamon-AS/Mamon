<template>
  <main class="home-page flex flex-col justify-between min-h-screen mt-7">
  <div class="container mx-auto p-4">
    <div v-if="loading" class="flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    <div v-else>
      <template v-if="reviews.length > 0">
        <MasonryWall :items="reviews"  :ssr-columns="2" :column-width="400"  :gutter="24">
          <template v-slot:default="{ item }">
            <ReviewCard :reviewItems="item" :key="item.sanityReviewId" />
          </template>
        </MasonryWall>


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
import MasonryWall from '@yeger/vue-masonry-wall';
import ReviewCard from '../components/Reviews/ReviewCard.vue'

export default {
  components: {
    MasonryWall,
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
