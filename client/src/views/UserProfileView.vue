<template>
  <div>
    <UserProfile
      :userId="userId"
      :photoUrl="userProfile.photoUrl"
      :name="userProfile.name"
      :email="userProfile.email"
      :isCurrentUser="userProfile.isCurrentUser"
      :reviews="userProfile.reviews"
      />
  </div>
  <div class="container mx-auto p-4">
      <div class="md:grid md:grid-cols-3 md:gap-4">
          <ReviewCard v-for="review in userProfile.reviews" :key="review._id" :reviewItems="review" /> 
      </div>
  </div>
</template>
  <script>
  import { ref, onMounted, nextTick } from 'vue';
  import axios from 'axios';
  import { getAuth } from 'firebase/auth'

  import UserProfile from '../components/UserProfile.vue';
  import ReviewCard from '../components/ReviewCard.vue';
  import sanity from '../client';

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
      const userProfile = ref({ reviews: [] }); 

        onMounted(() => {
             fetchUserData();

        });
        const userID = props.userId;
        // Methods
        async function fetchUserData() {
              try {          
                const response = await axios.post(`/.netlify/functions/getUserData`, {
                   userId: userID 
                  });

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }

                const data = response.data;

                const auth = getAuth();
                const currentUser = auth.currentUser;
                const isCurrentUser = currentUser && currentUser.uid === userID;
                
                userProfile.value = {
                  ...data, 
                  isCurrentUser, 
                };
                
              const reviews = await sanity.fetch(`*[_type == "review" && userId == $userID]`, { userID })
              userProfile.value = {
                ...userProfile.value,
                reviews 
              };

              await nextTick();

            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          }
      return {
          userProfile
        };
      }
}
</script>