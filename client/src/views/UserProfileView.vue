<template>
  <div class="container mx-auto p-4">
      <UserProfile
        :userId="userId"
        :photoUrl="userProfile.photoUrl"
        :name="userProfile.name"
        :isCurrentUser="userProfile.isCurrentUser"
        :reviews="userReviews"
      />
  </div>
  <div class="container mx-auto p-4">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <ReviewCard v-for="review in userReviews" :key="review._id" :reviewItems="review" />
      </div>
  </div>
</template>
<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import UserProfile from '../components/UserProfile.vue';
import ReviewCard from '../components/Reviews/ReviewCard.vue';

export default {
    components: {
      UserProfile,
      ReviewCard
    },
  props: {
    userId: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const store = useStore();
    const isLoading = computed(() => store.state.users.isLoading);
    const error = computed(() => store.state.users.error);
    const userProfile = computed(() => store.state.users.userItems)
    const userReviews = computed(() => store.getters['reviews/reviewItems']);

    onMounted(() => {
      fetchUserData();
      fetchUserReviews();
      });

    const fetchUserReviews = async () => {
        try {          
          let payload = {  };
          payload.userId = props.userId;
          payload.action = 'personal';
          await store.dispatch('reviews/FetchReviews', payload);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
     
    const fetchUserData = async () => {
      try {
        const response = await store.dispatch(`users/fetchUsers`, props.userId);
        if (response) {
          console.log('User data:', response);
        } 
      } catch (error) {
        console.error("Error fetching user data:", error);
        }
      }
  return {
    userProfile,
    userReviews,
    isLoading,
    error
    };
  }
}
</script>