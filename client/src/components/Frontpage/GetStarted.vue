<template>
  <div class="flex flex-col rounded-md p-12 items-center justify-center">
    <!-- Text Content Section -->
    <div class="flex-grow mb-4 lg:mb-0 lg:flex-grow-0 py-12 border-y [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]">
      <h1 class="mb-6 text-3xl font-bold p-6 md:text-6xl text-center">
        Del dine favorittopplevelser og kjøp
      </h1>
      <div class="mx-auto max-w-3xl">
        <p class="mb-8 text-lg text-gray-700 flex justify-center">Få tips fra venner og familie som kjenner deg best</p>
        <div class="mx-auto flex justify-center ">
          <router-link to="/register" class="btn mb-4 px-10 w-auto bg-gradient-to-t from-mamonblue to-blue-400 bg-[length:100%_100%] bg-[bottom]
              text-white shadow hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto">
            Logg inn
          </router-link>
        </div>
      </div>
    </div>

    <!-- Carousel Section -->
    <div class="relative w-full max-w-4xl mx-auto mt-6 lg:mt-6">
      <div class="overflow-hidden rounded-lg h-64">
        <div
          class="flex transition-transform duration-1000 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100 / slides.length}%)`, width: `${slides.length * 100}%` }"
        >
          <div v-for="(slide, index) in slides" :key="index" class="w-full h-64 flex flex-col items-center justify-center text-gray-700 text-2xl font-bold p-4">
            <div class="text-center mb-4">
              {{ slide.text }}
            </div>
            <i :class="slide.icon" class="text-4xl"></i>
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
  { text: 'Klikk på linken og del innlegget med venner og familie på Mamon, som kan gjøre samme gode kjøp som deg', icon: 'fas fa-link'},
  { text: '(eller unngå et dårlig kjøp)', icon: 'fas fa-thumbs-down' }
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
