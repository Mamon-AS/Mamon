<template>
  <AppHeader :is-logged-in=isLoggedIn :site-settings=settings />
  <div class="pt-20"> 
      <slot></slot> 
    </div>
  <router-view/>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AppHeader from './components/AppHeader.vue'

import sanity from './client';

const isLoggedIn = ref(false);
const settings = ref(null);

export default {
  setup() {
    onMounted(() => {
      onAuthStateChanged(getAuth(), (user) => {
        isLoggedIn.value = !!user;
      });

      const query = `*[_type == 'siteSettings']`
			sanity.fetch(query).then(data => {
        settings.value = data;
			})
    });
    return {
      isLoggedIn,
      settings
    }
  },
  components: {
    AppHeader,
  }
}

</script>
<style>

.btn {
	@apply  bg-blue-500 text-white font-bold py-2 px-4 rounded  transition duration-300
}
.btn:hover {
	@apply hover:bg-blue-700;
}

main {
  @apply mx-auto max-w-6xl px-4;
  .user {
    @apply bg-white shadow-md rounded-lg p-8;
    h1 {
      @apply text-2xl font-bold;
    }
    p {
      @apply text-gray-700;
    }
  }
}

</style>

