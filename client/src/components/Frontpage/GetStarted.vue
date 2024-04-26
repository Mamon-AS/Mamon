<template>
  <div class="flex flex-col lg:flex-row bg-lightblue rounded-md p-10 items-center justify-center">
    <!-- Text Content Section -->
    <div class="flex-grow space-y-5 mb-4 lg:mb-0 lg:flex-grow-0 lg:flex-[2] p-12 rounded-lg shadow-lg bg-white">
      <h1 class="text-5xl font-bold text-purple-900 text-center lg:text-left">
        lorem ipsum<br>
      </h1>
      <p class="text-lg text-purple-700 text-center lg:text-left">
        eiusmod tempor incididunt ut labore <br> exercitation ullamco laboris nisi
      </p>
      <div class="text-center lg:text-left">
        <router-link to="/register" class="bg-mamonblue text-white py-3 px-6 rounded-full text-lg">
          Logg inn
        </router-link>
      </div>
    </div>
    <!-- Image Section -->
    <div class="lg:w-1/2 lg:max-w-lg lg:order-2 p-6 lg:rounded-lg lg:shadow-lg md:bg-white ml-4">
      <img src="/images/people.svg" alt="Illustration of people reviewing" class="w-full h-auto">
    </div>
  </div>
</template>

<script setup>
</script>
