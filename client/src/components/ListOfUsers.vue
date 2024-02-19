<template>
    <div>
      <div v-if="users && users.length">
      <p class="text-center text-gray-600 mt-4">{{ users.length }} brukere <i class="fa-solid fa-heart fa-beat" style="color: #ff0000;"></i></p>
        <div v-for="user in users" :key="user.userId" class='w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl flex flex-col py-4 mb-4'>
          <div @click="navigateToProfile(user.userId)" class="flex flex-col items-center justify-between cursor-pointer  p-4 duration-300 sm:flex-row sm:py-4 sm:px-8 hover:bg-[#f6f8f9]">
            <div class="flex items-center text-center flex-col sm:flex-row sm:text-left">
              <div class="avatar-content mb-2.5 sm:mb-0 sm:mr-2.5 relative"> 
                <img :src="user.photoUrl" alt="Profile picture" class="w-12 h-12 rounded-full"> 
                <span class="emoji absolute bottom-0 right-0 text-lg" style="transform: translate(25%, 25%);">{{ user.emoji }}</span>
              </div>
              <div class="flex flex-col mb-4 sm:mb-0 sm:mr-4">
                <a class="title font-medium no-underline">{{ user.name }}</a > 
              <div class="flex flex-col">
                  <span class="subtitle text-slate-500">{{ user.bio }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-center">Ingen brukere</p>
      </div>
    </div>
  </template>
  
  
  <script>
  import { useRouter } from 'vue-router'
  import { getAuth } from 'firebase/auth';
  
  export default {
  props: {
    users: Array,
  },
  setup() {
      const router = useRouter();
      const navigateToProfile = async (userId) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const currentUserId = currentUser ? currentUser.uid : null;
  
        if (userId === currentUserId) {
          router.push({ name: 'user' });
        } else {
          router.push({ name: 'UserProfile', params: { userId } });
        }
      };
  

  
      return {
        navigateToProfile,
        
      };
    },
  };
  </script>
  