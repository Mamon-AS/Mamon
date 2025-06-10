<template>
  <AppHeader :is-logged-in=isLoggedIn :site-settings=settings />
  <slot></slot> 
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
  @apply bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5;
}

.btn:hover {
  @apply from-primary-700 to-primary-600;
}

main {
  @apply mx-auto max-w-6xl px-4;
  .user {
    @apply bg-white shadow-lg rounded-xl p-8 backdrop-blur-sm bg-opacity-90;
    h1 {
      @apply text-2xl font-bold text-secondary-800;
    }
    p {
      @apply text-secondary-600;
    }
  }
}

/* Add smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modern scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-secondary-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-primary-500 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-primary-600;
}
</style>

