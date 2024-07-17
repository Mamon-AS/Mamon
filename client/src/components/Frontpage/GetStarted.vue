<template>
  <div class="flex flex-col rounded-md p-12 items-center justify-center">
    <!-- Text Content Section -->
    <div class="flex-grow mb-4 lg:mb-0 lg:flex-grow-0 pt-12">
      <h1 class="mb-6 border-y text-3xl font-bold p-6 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl text-center">
        Anmeldelser
        <br class="max-lg:hidden">
        du kan stole på
      </h1>
      <div class="mx-auto max-w-3xl">
        <p class="mb-8 text-lg text-gray-700">Tips venner om gode kjøp du har gjort og la deg inspirere av dine venners kjøp.</p>
        <div class="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center ">
          <router-link to="/register" class="btn group mb-4 w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom]
              text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto">
            Logg inn
          </router-link>
          <a class="btn w-full bg-white text-gray-800 shadow hover:bg-gray-50 hover:text-white ml-4 sm:w-auto" href="#0">
            Lær Mer
          </a>
        </div>
      </div>
    </div>

    <!-- Carousel Section -->
    <div class="relative w-full max-w-4xl mx-auto mt-6 lg:mt-6">
      <div class="overflow-hidden rounded-lg shadow-lg h-64">
        <div
          class="flex transition-transform duration-1000 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100 / slides.length}%)`, width: `${slides.length * 100}%` }"
        >
          <div v-for="(slide, index) in slides" :key="index" class="w-full h-64 flex flex-col items-center justify-center text-white text-2xl font-bold p-4" :class="slide.bgColor">
            <div class="text-center mb-4">
              {{ slide.text }}
            </div>
            <i :class="slide.icon" class="text-4xl"></i>
          </div>
        </div>
      </div>
      <div class="absolute inset-0 flex items-center justify-between p-4">
        <button @click="prevSlide" class="bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 w-[40px]">
          &#10094;
        </button>
        <button @click="nextSlide" class="bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 w-[40px]">
          &#10095;
        </button>
      </div>
      <div class="flex justify-center mt-4">
        <span v-for="(slide, index) in slides" :key="index" class="h-2 w-2 rounded-full mx-1" :class="{ 'bg-blue-500': currentSlide === index, 'bg-gray-400': currentSlide !== index }"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const slides = ref([
  { text: 'Kjøp eller bestill noe på nett', icon: 'fas fa-shopping-cart', bgColor: 'bg-red-500' },
  { text: 'Motta kvitteringen på mail med link til Mamon', icon: 'fas fa-envelope', bgColor: 'bg-blue-500' },
  { text: 'Klikk på linken og gi en vurdering av kjøpet', icon: 'fas fa-link', bgColor: 'bg-green-500' },
  { text: 'Del innlegget med venner og familie på Mamon, som kan gjøre samme gode kjøp som deg', icon: 'fas fa-share-alt', bgColor: 'bg-amber-300' },
  { text: '(eller unngå et dårlig kjøp)', icon: 'fas fa-thumbs-down', bgColor: 'bg-purple-500' }
]);

const currentSlide = ref(0);
let slideInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
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
