<template>
  <div class="flex-grow">
    <!-- Only show content if not loading -->
    <template v-if="!loading">
      <div v-if="isLoggedIn">
        <ReviewCardView />
      </div>
      <div v-else>
        <GetStarted />
        <HowItWorks />
      </div>
    </template>

      <div v-if="loading" class="flex justify-center items-center">
        <img 
          src="/images/High_Resolution_Image_4_cropped.png" 
          alt="Logo" 
          class="h-auto max-h-5 w-auto logo"
        />
      </div>
  </div>
    <footer class="text-center mt-8">
      <div class="flex flex-col items-stretch lg:flex-row lg:justify-center lg:space-x-4 lg:space-y-0 space-y-4 max-w-screen-lg mx-auto mb-8">
        <ContactUs />
        <Team />
      </div>
      <p>© {{ new Date().getFullYear() }} Mamon. All rights reserved.</p>
    </footer>

 </template>
 
 <script>
 import { getAuth, onAuthStateChanged } from "firebase/auth";
 import { ref, onMounted } from 'vue';
 import ReviewCardView from '../views/ReviewCardView.vue';
 import GetStarted from '../components/Frontpage/GetStarted.vue';
 import ContactUs from "../components/Frontpage/ContactUs.vue";
 import Team from "../components/Frontpage/TeamSection.vue";
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
 