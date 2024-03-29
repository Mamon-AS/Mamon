<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold text-center">Folk du kanskje kjenner</h1>
    <div v-if="peopleYouMayKnow.length === 0">
      <p class="text-center mt-4">Ingen foreslåtte kontakter for øyeblikket.</p>
    </div>
    <div class="flex flex-wrap justify-center mt-4">
      <div v-for="user in peopleYouMayKnow" :key="user.userId" class="m-2">
        <div @click="navigate(user.userId)" class="max-w-md rounded overflow-hidden shadow-lg flex flex-col h-full hover:bg-[#f6f8f9] cursor-pointer">
          <img :src="user.photoUrl" alt="Profile" class="w-full object-cover flex-none">
          <div class="px-6 py-4 flex-grow">
            <div class="font-bold text-xl mb-2 text-center">{{ user.profileData.displayName }}</div>
            <p class="text-gray-700 text-base">{{ user.profileData.bio ? user.profileData.bio : ' Har ingen bio 🤫 '}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div v-if="following.length === 0">
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-3xl font-bold text-center"></h1>
        <p class="text-center">Du følger ingen brukere enda</p>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-3xl font-bold text-center">Folk du følger</h1>
        <ListOfUsers :users="following" />
      </div>
    </div>

  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getAuth } from 'firebase/auth';
  import axios from 'axios';
  import { useRouter } from 'vue-router';

  import ListOfUsers from '../components/ListOfUsers.vue';
  import { navigateToProfile } from '../utils/';

  const userId = ref(null);
  const auth = getAuth();
  const following = ref([]);
  const peopleYouMayKnow = ref([]);
  
  const router = useRouter();
  const navigate = (userId) => navigateToProfile(router, userId);


  async function fetchUserData(userID, action) {
      try {
        const response = await axios.post(`/.netlify/functions/getFollowing`, {
          userId: userID,
          action
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        following.value = response.data.following;
        console.log(following.value);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  async function fetchPeopleYouMayKnow(userID, followingUserIds) {
    try {
      const response = await axios.post(`/.netlify/functions/postPeopleYouMayKnow`, {
        userId: userID,
        followingUserIds: followingUserIds
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      peopleYouMayKnow.value = response.data.usersYouMayKnow;
      console.log(peopleYouMayKnow.value);

    } catch (error) {
      console.error('Error fetching people you may know:', error);
    }
  }

  onMounted(async () => {
     await auth.onAuthStateChanged((user) => {
      if (user) {
        userId.value = user.uid;
      } else {
     
        userId.value = null;
      }
    });
    await fetchUserData(userId.value, "following");
    const followingUserIds = following.value.map(user => user.userId);
    await fetchPeopleYouMayKnow(userId.value, followingUserIds);
  });
  </script>
  <style scoped>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>