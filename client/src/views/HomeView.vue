<template>
  <div class="flex-grow">
    <!-- Only show content if not loading -->
    <template v-if="!loading">
      <div v-if="isLoggedIn">
        <ReviewCardView />
      </div>
      <div v-else>
        <GetStarted />
        
        <!-- Sections Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto mt-12">
            <div v-for="(section, index) in howItWorksData?.sections" :key="index" 
                 class="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-secondary-100 flex flex-col">
                <div class="flex-grow">
                    <h1 class="text-2xl font-bold mb-6 text-primary-700">{{ section.title }}</h1>
                    
                    <p v-if="section.description" class="mb-6 text-secondary-600 leading-relaxed">
                        {{ section.description }}
                    </p>

                    <ol v-if="section.steps" class="space-y-4 w-full">
                        <li v-for="step in section.steps" :key="step.number" 
                            class="flex items-center space-x-4 p-4 rounded-lg">
                            <span class="flex items-center justify-center min-w-8 w-8 h-8 bg-primary-500 text-white rounded-full font-bold">
                                {{ step.number }}
                            </span>
                            <span class="text-secondary-700">{{ step.text }}</span>
                        </li>
                    </ol>
                </div>

                <img v-if="section.image" 
                     :src="CreateURL(section.image)" 
                     :alt="section.title"
                     class="w-full h-auto mt-6 rounded-lg">
            </div>
        </div>
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
import sanity from '../client';
import { CreateURL } from '../utils';

export default {
  components: {
    ReviewCardView,
    GetStarted,
    ContactUs,
    Team
  },

  setup() {
    const isLoggedIn = ref(false);
    const loading = ref(true);
    const howItWorksData = ref(null);

    onMounted(async () => {
      onAuthStateChanged(getAuth(), (user) => {
        isLoggedIn.value = !!user;
        loading.value = false; 
      });

      try {
        const query = `*[_type == "howItWorks"][0] {
          sections[] {
            title,
            description,
            image,
            steps[] {
              number,
              text
            }
          }
        }`;
        
        const data = await sanity.fetch(query);
        howItWorksData.value = data;
      } catch (err) {
        console.error('Error fetching how it works data:', err);
      }
    });

    return {
      isLoggedIn,
      loading,
      howItWorksData,
      CreateURL
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
 