<template>
    <main class="home-page">
        <div v-show="isLoggedIn">
            <ReviewCardView />
        </div>
        <footer class="text-center">
            <p>© {{ new Date().getFullYear() }} Mamon. All rights reserved.</p>
        </footer>
    </main>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onMounted } from 'vue';
import ReviewCardView from '../views/ReviewCardView.vue';

export default {
  components: {
    ReviewCardView
  },

  setup() {
    const isLoggedIn = ref(false);

    onMounted(() => {
      onAuthStateChanged(getAuth(), (user) => {
        isLoggedIn.value = !!user;
      });
    });

    return {
      isLoggedIn
    }
  }
}

</script>
<style>

body {
    margin: 0;
}
section {
    align-items: center;
    min-height: 200px;
    padding: 50px 20vw;
}

</style>