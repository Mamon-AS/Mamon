<template>
 <main class="home-page flex flex-col justify-between min-h-screen">
      <div class="flex-grow">
        <div v-show="isLoggedIn">
            <ReviewCardView />
        </div>
        <div v-show="!isLoggedIn">
            <GetStarted />
        </div>
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
import GetStarted from '../components/GetStarted.vue';

export default {
  components: {
    ReviewCardView,
    GetStarted

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