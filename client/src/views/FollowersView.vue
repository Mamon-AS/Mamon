<template>
  <ListOfUsers :users="following" />
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

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
    const following = ref([]);
    const route = useRoute();

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

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    onMounted(() => {
      fetchUserData(props.userId, route.params.action);
    });

    return {
      following
    };
  },
};
</script>