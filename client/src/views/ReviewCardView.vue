<template>
  <div class="container mx-auto p-4">
    <template v-if="posts.length > 0">
      <MasonryWall :items="posts" :cols="{ default: 3, 1100: 3, 700: 2, 500: 1 }" :gutter="24">
        <template v-slot:default="{ item }">
          <ReviewCard :reviewItems="item" />
        </template>
      </MasonryWall>
      <button v-if="$store.state.reviews.total_reviews > posts.length"
              @click="$store.dispatch('reviews/LoadReviews', 4)"
              class="btn mt-8">
        Les mer ({{ $store.state.reviews.total_reviews - posts.length }})
      </button>
    </template>
    <template v-else>
      <p class="text-center text-gray-500">Woah, such empty?</p>
    </template>
  </div>
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
    const posts = computed(() => store.getters['reviews/reviewItems']);
    const auth = getAuth();
    const userId = ref(null);
    
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.value = user.uid;
      }
    });
    
    const fetchReviews = async () => {
      try {
        let payload = { limit: 4 };
        payload.userId = auth.currentUser.uid;
        await store.dispatch('reviews/FetchAllFollowingReviews', payload);
      } catch (error) {
        console.error(error);
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
      posts
    };
  }
}
</script>
