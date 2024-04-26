<template>
  <div class="flex-grow">
    <!-- Only show content if not loading -->
    <template v-if="!loading">
      <div v-if="isLoggedIn">
          <ReviewCardView />
      </div>
      <div v-else>
        <GetStarted />
        <header class="bg-mamonblue text-white text-center py-4 rounded-t-md mt-2">
          <h2 class="text-xl font-semibold">Slik fungerer det</h2>
        </header>
        <HowItWorks />
        <div class="mt-5 lg:flex lg:justify-center lg:items-center">
          <div class="lg:flex lg:flex-col lg:justify-center lg:items-center lg:space-y-4">
            <ContactUs />
          </div>
          <div class="lg:flex lg:flex-col lg:justify-center lg:items-center lg:space-y-4">
            <Team />
          </div>
        </div>
      </div>
</template>

      <div v-if="loading" class="flex justify-center items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
  </div>
    <footer class="text-center">
        <p>© {{ new Date().getFullYear() }} Mamon. All rights reserved.</p>
    </footer>

 </template>
 
 <script>
 import { getAuth, onAuthStateChanged } from "firebase/auth";
 import { ref, onMounted } from 'vue';
 import ReviewCardView from '../views/ReviewCardView.vue';
 import GetStarted from '../components/Frontpage/GetStarted.vue';
 import ContactUs from "../components/Frontpage/ContactUs.vue";
 import Team from "../components/Frontpage/Team.vue";
 import HowItWorks from "../components/Frontpage/HowItWorks.vue";

 export default {
   components: {
     ReviewCardView,
     GetStarted,
     ContactUs,
     Team,
     HowItWorks,
   },
 
   setup() {
     const isLoggedIn = ref(false);
     const loading = ref(true);
 
     onMounted(() => {
       onAuthStateChanged(getAuth(), (user) => {
         isLoggedIn.value = !!user;
         loading.value = false; 
       });
     });
 
     return {
       isLoggedIn,
       loading 
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
 