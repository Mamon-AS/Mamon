<template>
  <main class="home-page">
    <section class="container mx-auto p-4">
      <h1 class="text-2xl mb-8">Companies</h1>

      <div class="grad gap-4">
        <PostCard v-for="(marketing, i) in posts" :key="i" :marketing="marketing" />
      </div>
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
      
      store.dispatch("FetchMarketing")
      
   
      // Listen for changes in the Sanity studio and subscribe to it
      const query = '*[_type == "marketing"]'
      subscription.value = sanity
      .listen(query)
      .subscribe(update => {

        switch ( update.transition) {
          case 'update':
            console.log("Marketing posts updated", update);
            sanity.getDocument(update.result)
              store.dispatch('UpdateMarketing', {
                ...update.result
            })
            
            break;
          case 'appear':
            console.log("Marketing posts appeared", update);
            sanity.getDocument(update.result)
              store.dispatch('AddNewMarketing', {
                ...update.result
            })
            break;
          case 'disappear':
            console.log("Marketing posts disappeared", update);
            store.dispatch("RemoveMarketing", update.documentId)
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

