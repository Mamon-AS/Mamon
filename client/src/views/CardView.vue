<template>
  <main class="home-page">
    <section class="container mx-auto p-4">
      <h1 class="text-2xl mb-8">Annonser</h1>

      <div class="grad gap-4">
        <PostCard v-for="(marketing, i) in posts" :key="i" :marketing="marketing" />
      </div>

        <button 
          v-if="$store.state.reviews.total_marketing > posts.length"
          @click="$store.dispatch('reviews/LoadMoreMarketing', 2)"
          class="btn mt-8">
          Last mer ({{ $store.state.reviews.total_marketing - posts.length }})
        </button>
    </section>
  </main>
</template>

<script>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useStore } from 'vuex'
import sanity  from '../client'

import PostCard from '../components/PostCard.vue'

export default {
  components: {
    PostCard
  },
  setup () {
    const subscription = ref (null)
    const store = useStore()

    const posts = computed(() =>  store.getters.marketing)
    
    onMounted(() => {
      // Hvor mange marketing posts skal vi hente?  

      store.dispatch("reviews/FetchMarketing", 2)
      
   
      // Listen for changes in the Sanity studio and subscribe to it
      const query = '*[_type == "marketing"]'
      subscription.value = sanity
      .listen(query)
      .subscribe(update => {

        switch ( update.transition) {
          case 'update':
            console.log("Marketing posts updated", update);
            sanity.getDocument(update.result.author._ref).then(author => {
              store.dispatch('reviews/UpdateMarketing', {
                ...update.result, author
              })
            })
            break;
          case 'appear':
            console.log("Marketing posts appeared", update);
            sanity.getDocument(update.result.author._ref).then(author => {
              store.dispatch('reviews/AddNewMarketing', {
                ...update.result, author
              })
            })

            break;
          case 'disappear':
            console.log("Marketing posts disappeared", update);
            store.dispatch("reviews/RemoveMarketing", update.documentId)
            break;
        }
      })
    })
    onUnmounted(() => {
      subscription.value.unsubscribe()
    })

    return {
      posts
    }
  }
}

</script>

