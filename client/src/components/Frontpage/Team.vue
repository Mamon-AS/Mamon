<template>
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 text-center">
        <div v-for="member in teamMembers" :key="member.id" class="p-4 border rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold">{{ member.name }}</h3>
          <p>{{ member.role }}</p>
          <img :src="member.image" alt="profile picture" class="w-32 h-32 mt-2 rounded-full mx-auto">
          <p class="text-gray-600">{{ member.bio }}</p>
        </div>
      </div>
    </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  
  const teamMembers = ref([
    {
      id: 1,
      name: 'Sondre',
      role: 'CEO',
      image: '/images/sondre.jpg',
      bio: 'Hjernen bak.'
    },
    {
      id: 2,
      name: 'Martin',
      role: 'CTO',
      image: '/images/martin.jpg',
      bio: '"Liker å ha mange baller i luften".'
    },
    {
      id: 3,
      name: 'Erik',
      role: 'Webutvikler',
      image: '/images/erik.jpg',
      bio: 'Produserer og fjerner bugs'
    }
  ]);
  </script>
  
