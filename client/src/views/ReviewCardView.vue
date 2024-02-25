<template>
  <div class="container mx-auto p-4">
    <MasonryWall :items="posts" :cols="{ default: 3, 1100: 3, 700: 2, 500: 1 }" :gutter="24">
      <template v-slot:default="{ item }">
        <ReviewCard :reviewItems="item" />
      </template>
    </MasonryWall>
    <button v-if="$store.state.reviews.total_reviews > posts.length"
            @click="$store.dispatch('reviews/LoadReviews', 3)"
            class="btn mt-8">
      Les Mer ({{ $store.state.reviews.total_reviews - posts.length }})
    </button>
  </div>
</template>

  
  <script>
  import {  onMounted, onUnmounted, ref, computed  } from 'vue'
  import { useStore } from 'vuex'
  import  MasonryWall  from '@yeger/vue-masonry-wall';

  import sanity from "../client";
  import ReviewCard from '../components/ReviewCard.vue'

  
  export default {
    components: {
      MasonryWall,
      ReviewCard
    },
    
      setup() {
        const subscription = ref(null);
        const store = useStore();

        const posts = computed(() => store.getters['reviews/reviewItems']);

        onMounted(() => {
           // coloumn is 3 for now
            store.dispatch("reviews/FetchReviews", 3);

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
            subscription.value.unsubscribe()
    })
    return {
      posts
      }
    }
  }
  
  </script>
