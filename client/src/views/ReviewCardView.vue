<template>
<div class="container mx-auto p-4">
  <div class="md:grid md:grid-cols-3 md:gap-4">
    <ReviewCard v-for="(reviewItems, i) in posts" :key="i" :reviewItems="reviewItems" /> 
  </div>
      <!-- colomns are 3 row so load 3 more -->
      <button 
          v-if="$store.state.total_reviews > posts.length"
          @click="$store.dispatch('LoadReviews', 3)"
          class="btn mt-8">
          Last mer ({{ $store.state.total_reviews - posts.length }})
      </button>
</div>


</template>
  
  <script>
  import {  onMounted, onUnmounted, ref, computed  } from 'vue'
  import { useStore } from 'vuex'

  import sanity from "../client";
  import ReviewCard from '../components/ReviewCard.vue'

  
  export default {
    components: {
        ReviewCard
    },
    
      setup() {
        const subscription = ref(null);
        const store = useStore();

        const posts = computed(() => store.getters.reviewItems);


        onMounted(() => {
           // coloumn is 3 for now
            store.dispatch("FetchReviews", 3);
            console.log("Reviews mounted");
            const query = '*[_type == "reviews"]';
            subscription.value = sanity
            .listen(query)
            .subscribe(update => {
                switch (update.transition) {
                    case "appear":
                        console.log("Reviews appeared", update);
                        store.dispatch("AddNewReviews", ...update.result)
                        break;
                    case "disappear":
                        console.log("Reviews disappeared", update);
                        store.dispatch("RemoveReviews", update.documentId)
                        break;
                }
            })

        });
        console.log(posts)
        
        onUnmounted(() => {
            subscription.value.unsubscribe()
    })
    return {
      posts
    }
    }
  }
  
  </script>
