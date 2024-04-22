<template>
  <main class="flex flex-col md:flex-row bg-lightblue rounded-md p-10 items-center">
    <!-- Text Content Section -->
    <div class="md:flex-[2] md:order-1 space-y-5 mb-4 md:mb-0 md:bg-white md:p-12 md:rounded-lg md:shadow-lg">
      <h1 class="text-5xl font-bold text-purple-900 text-center md:text-left">
        lorem ipsum<br>
      </h1>
      <p class="text-lg text-purple-700 text-center md:text-left">
        eiusmod tempor incididunt ut labore <br> exercitation ullamco laboris nisi
      </p>
      <div class="text-center md:text-left">
        <router-link to="/register" class="bg-mamonblue text-white py-3 px-6 rounded-full text-lg">
          Logg inn
        </router-link>
      </div>
    </div>
    <!-- Image Section -->
    <img src="/images/people.svg" alt="Illustration of people reviewing" class="md:flex-1 md:order-2">
  </main>
</template>

<script setup>
</script>
