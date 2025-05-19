<template>
  <main class="flex flex-col mt-8 mb-12">
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 p-4">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center">
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
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import sanity from '../../client';
import { CreateURL } from '../../utils';

const howItWorksData = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const query = `*[_type == "howItWorks"][0] {
      title,
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
    error.value = 'Kunne ikke laste inn innhold. Vennligst prøv igjen senere.';
    console.error('Error fetching how it works data:', err);
  } finally {
    loading.value = false;
  }
});
</script>
