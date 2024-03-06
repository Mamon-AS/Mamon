<template>
  <div class="container mx-auto p-4 text-center">
    <div class="flex items-center justify-center gap-4 mb-3">
      <span class="text-xl font-medium">Offentlige brukere</span>
      <label class="switch">
        <input type="checkbox" @click="toggleCheckbox">
        <span class="slider round"></span>
      </label>
      <span class="text-xl font-medium">Folk du følger</span>
    </div>
    
    <!-- Conditionally render based on dataView state -->
    <div v-if="dataView === 'public'">
      <MasonryWall :items="posts" :cols="{ default: 3, 1100: 3, 700: 2, 500: 1 }" :gutter="24">
        <template v-slot:default="{ item }">
          <ReviewCard :reviewItems="item" />
        </template>
      </MasonryWall>
      <button v-if="$store.state.reviews.total_reviews > posts.length"
              @click="$store.dispatch('reviews/LoadReviews', 4)"
              class="btn mt-8">
        Les Mer ({{ $store.state.reviews.total_reviews - posts.length }})
      </button>
    </div>
    <div v-else>
      <MasonryWall :items="posts" :cols="{ default: 3, 1100: 3, 700: 2, 500: 1 }" :gutter="24">
        <template v-slot:default="{ item }">
          <ReviewCard :reviewItems="item" />
        </template>
      </MasonryWall>
      <button v-if="$store.state.reviews.total_reviews > posts.length"
              @click="$store.dispatch('reviews/LoadReviews', 4)"
              class="btn mt-8">
        Les Mer ({{ $store.state.reviews.total_reviews - posts.length }})
      </button>
    </div>
  </div>
</template>

<script>
import {  onMounted, onUnmounted, ref, computed, watch  } from 'vue'
import { useStore } from 'vuex'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import  MasonryWall  from '@yeger/vue-masonry-wall';

import sanity from "../client";
import ReviewCard from '../components/Reviews/ReviewCard.vue'


export default {
  components: {
    MasonryWall,
    ReviewCard
  },
  
    setup() {
      const subscription = ref(null);
      const store = useStore();
      const dataView = ref('public');
      const posts = computed(() => store.getters['reviews/reviewItems']);
   
      const auth = getAuth();
      const userId = ref(null);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userId.value = user.uid;
        }
      });
      
      const toggleCheckbox = () => {
          dataView.value = dataView.value === 'public' ? 'followers' : 'public';
        }

      const fetchReviews = async (actionType = 'public') => {
        try {
          let action;
          let payload = { limit: 4 };

          if (actionType === 'public') {
            action = 'reviews/FetchReviews';
            payload.action = 'public'; 
          } else if (actionType === 'fetch_followers_reviews') {
            action = 'reviews/FetchReviews';
            payload.action = 'fetch_followers_reviews'; 
            payload.userId = userId.value
          }

          await store.dispatch(action, payload);
        } catch (error) {
          console.error(error);
        }
      }


      watch(dataView, (newValue, oldValue) => {
          if (newValue === 'followers') {
            fetchReviews('fetch_followers_reviews');
          } else if (newValue === 'public') {
            fetchReviews('public');
            }
        });
        

      onMounted(() => {
        fetchReviews('public'); 
        const query = '*[_type == "reviews"]';
        subscription.value = sanity
        .listen(query)
        .subscribe(update => {
            switch (update.transition) {
                case "appear":
                    console.log("Reviews appeared", update);
                    store.dispatch("reviews/AddNewReviews", ...update.result)
                    break;
                case "disappear":
                    console.log("Reviews disappeared", update);
                    store.dispatch("reviews/RemoveReviews", update.documentId)
                    break;
                }
            })
        });
    onUnmounted(() => {
        subscription.value.unsubscribe();
    })
  return {
    posts,
    toggleCheckbox,
    dataView 
    }
  }
}

</script>
<style>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #101010;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
