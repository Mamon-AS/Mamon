<template>
  <div>
    <div v-if="followers.length > 0">
    <p class="text-center text-gray-600 mt-4">{{ followers.length }} følgere <i class="fa-solid fa-heart fa-beat"></i></p>
      <div v-for="follower in followers" :key="follower.followerId" class='w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl flex flex-col py-4 mb-4'>
        <div @click="navigateToProfile(follower.followerId)" class="flex flex-col items-center justify-between cursor-pointer  p-4 duration-300 sm:flex-row sm:py-4 sm:px-8 hover:bg-[#f6f8f9]">
          <div class="flex items-center text-center flex-col sm:flex-row sm:text-left">
            <div class="avatar-content mb-2.5 sm:mb-0 sm:mr-2.5">
              <img :src="follower.photoUrl" alt="Profile picture" style="width: 50px; height: 50px; border-radius: 50%;">
            </div>
            <div class="flex flex-col mb-4 sm:mb-0 sm:mr-4">
              <a class="title font-medium no-underline">{{ follower.name }}</a > 
            <div class="flex flex-col">
                <span class="subtitle text-slate-500">{{ follower.bio }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">Ingen følgere</p>
    </div>
  </div>


</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth';

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const followers = ref([]);
    const router = useRouter();

    const navigateToProfile = async (userId) => {
      console.log(userId);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const currentUserId = currentUser ? currentUser.uid : null;

      if (userId === currentUserId) {
        router.push({ name: 'user' });
      } else {
        router.push({ name: 'UserProfile', params: { userId } });
      }
    };

    async function fetchUserData(userID) {
      try {
        const response = await axios.post(`/.netlify/functions/getFollowers`, {
          userId: userID,
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        followers.value = response.data.followers;

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    onMounted(() => {
      fetchUserData(props.userId);
    });

    return {
      followers, navigateToProfile
    };
  },
};
</script>
<style>
.fa-heart {
    color: #ff0000;
}

</style>