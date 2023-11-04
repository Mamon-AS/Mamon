<template>
  <AppHeader :is-logged-in=isLoggedIn :site-settings=settings />
  <SidebarNav :is-logged-in=isLoggedIn />
  <router-view/>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AppHeader from './components/AppHeader.vue'
import SidebarNav from './components/SidebarNav.vue';
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
        console.log("data: " + data);
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
    SidebarNav
  }
}

</script>
<style>

.btn {
	@apply bg-green-600 duration-300 font-bold py-2 px-4 rounded-lg inline-block;
}
.btn:hover {
	@apply bg-green-700;
}

main {
  @apply mx-auto max-w-4xl my-8 px-4;
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

