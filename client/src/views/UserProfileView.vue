<template>
  <div class="container mx-auto p-4 mt-7">
    <UserProfile
      :userId="userId"
      :photoUrl="userProfile.photoUrl"
      :name="userProfile.name"
      :isCurrentUser="userProfile.isCurrentUser"
      :reviews="userReviews"
    />
  </div>
  <div v-if="showError" class="container mx-auto p-4 text-center bg-gray-200">
    <p>Følg {{ userProfile.name }} for å se tipsene deres</p>
  </div>

  <div class="container mx-auto p-4">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <ReviewCard v-for="review in userReviews" :key="review._id" :reviewItems="review" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { getAuth } from 'firebase/auth';

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
    const auth = getAuth();

    const userProfile = computed(() => store.state.users.userItems);
    const userReviews = computed(() => store.getters['reviews/reviewItems']);

    const showError = computed(() => {
      return store.state.reviews.reviewItems && store.state.reviews.reviewItems.error === "You are not following this user";
    });
    
    const fetchUserData = async () => {
      try {
        await store.dispatch('users/fetchUsers', props.userId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    const fetchUserReviews = async () => {
      try {
        let payload = {  
          limit: 4,
          userId: props.userId,
          currentUserId: auth.currentUser.uid
        };
        await store.dispatch('reviews/FetchFollowingReviews', payload);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    }

    // Use watch to reactively fetch data when userId changes, without it the UI may fail to update
    watch(() => props.userId, () => {
      fetchUserData();
      fetchUserReviews();
    });

    onMounted(() => {
      fetchUserData();
      fetchUserReviews();
    });
    
    return {
      userProfile,
      userReviews,
      showError
    };
  }
}
</script>
