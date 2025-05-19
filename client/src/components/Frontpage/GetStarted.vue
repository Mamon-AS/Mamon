<template>
  <div class="flex flex-col rounded-2xl p-12 items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
    <!-- Text Content Section -->
    <div class="flex-grow mb-8 lg:mb-0 lg:flex-grow-0 py-12 border-y border-secondary-200">
      <h1 class="mb-8 text-4xl font-bold p-6 md:text-6xl text-center bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
        Del dine favorittopplevelser og kjøp
      </h1>
      <div class="mx-auto max-w-3xl">
        <p class="mb-8 text-xl text-secondary-600 flex justify-center text-center leading-relaxed">Få tips fra venner og familie som kjenner deg best</p>
        <div class="mx-auto flex justify-center">
          <router-link to="/register" class="btn bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg hover:shadow-xl px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1">
            Logg inn
          </router-link>
        </div>
      </div>
    </div>

    <!-- Carousel Section -->
    <div class="relative w-full max-w-4xl mx-auto mt-12 lg:mt-16">
      <div class="overflow-hidden rounded-2xl h-72 bg-white shadow-xl">
        <div
          class="flex transition-transform duration-1000 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100 / slides.length}%)`, width: `${slides.length * 100}%` }"
        >
          <div v-for="(slide, index) in slides" :key="index" class="w-full h-72 flex flex-col items-center justify-center p-8">
            <div class="text-center mb-6">
              <p class="text-2xl font-semibold text-secondary-800">{{ slide.text }}</p>
            </div>
            <i :class="slide.icon" class="text-5xl text-primary-500"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const slides = ref([
  { text: 'Kjøp eller bestill noe på nett', icon: 'fas fa-shopping-cart' },
  { text: 'Motta kvitteringen på mail med link til Mamon', icon: 'fas fa-envelope' },
  { text: 'Klikk på linken og del innlegget med venner og familie på Mamon, som kan gjøre samme gode kjøp som deg', icon: 'fas fa-link'}
]);

const currentSlide = ref(0);
let slideInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 10000);
});

onBeforeUnmount(() => {
  clearInterval(slideInterval);
});
</script>

<style scoped>
/* Add any additional styling here */
</style>
