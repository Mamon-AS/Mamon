<template>
  <main class="flex flex-col md:flex-row justify-center items-center min-h-screen bg-lightblue rounded-md p-4">
    <!-- Content Section -->
    <div class="flex-1 space-y-5 mb-4 md:mb-0">
      <h1 class="text-5xl font-bold text-purple-900 text-center">
        mamon<br>.
      </h1>
      <p class="text-lg text-purple-700 text-center">
        Anmeld dine kjøp <br> og sammenlign med dine venner
      </p>
      <div class="text-center">
        <router-link to="/register" class="bg-mamonblue text-white py-3 px-6 rounded-full text-lg">
          
         Meld deg på
        </router-link>
      </div>
    </div>

    <!-- Feature Card -->
    <div class="flex-1 feature-card bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-3">
      <!-- Profile Section -->
      <div class="flex items-center space-x-3">
        <img class="w-12 h-12 rounded-full" src="/images/sondre.jpg" alt="Profile" />
        <div>
          <p class="font-semibold text-gray-800">Sondre</p>
          <p class="text-sm text-gray-600">Skulle egentlig ha en grill, men ordna seg!</p>
        </div>
      </div>
      
      <!-- Image -->
      <div class="bg-gray-200 p-4 rounded-lg w-full">
        <div class="h-32 bg-gray-300 rounded-lg shadow-inner">
          <img class="w-full h-full object-cover" src="/images/image.png" alt="Post Image" />
        </div>
      </div>
      
      <!-- Interaction Icons -->
      <div class="flex space-x-2 text-gray-500">
        <span>👍</span>
        <span>😍</span>
        <span>😎</span>
      </div>
    </div>
  </main>
</template>

<style>
.topp {
  top: 4.5rem;
}
.bunn {
  bottom: -4.5rem;
}
</style>


<!-- <template>
  <div class="h-1/5 bg-[#34a853] absolute left-0 right-0 topp">
    <h1> hei</h1>
  </div>
</template> -->

<script setup>
// Your script here
</script>
<style>
.topp {
  top: 4.5rem
}
.bunn {
  bottom: -4.5rem
}
</style>

