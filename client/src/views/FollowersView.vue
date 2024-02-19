<template>
  <ListOfUsers :users="followers" />
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';

import ListOfUsers from '../components/ListOfUsers.vue';

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  components: {
    ListOfUsers,
  },
  setup(props) {
    const followers = ref([]);

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
      followers
    };
  },
};
</script>