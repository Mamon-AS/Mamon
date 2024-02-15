<template>
  <div class="darkblue rounded-lg p-4 mb-4 flex flex-col justify-between"> 
      <div class="content-wrapper">
          <img v-if="reviewItems.reviewedImage" :src="CreateURL(reviewItems.reviewedImage, 480, 320)" class="block w-full object-cover mb-4 rounded-lg" />
          <h3 class="text-lg md:text-2xl font-bold mb-4"> {{ (reviewItems.reviewedItem.length > 25 ? reviewItems.reviewedItem.slice(0,25) + '...' : reviewItems.reviewedItem) }}</h3>
          <p class="text-white md:text-lg mb-4 flex-1">
              {{ reviewItems.description }}
          </p>
          <div class="flex justify-between items-end">
              <div class="flex items-center">
                  <div class="stars-outer">
                      <div class="stars-inner" :style="{ width: stars }"></div>
                      <div class="stars-background"></div>
                  </div>
              </div>
              <p class="text-white text-sm">
                  {{ FormatDate(reviewItems._createdAt) }}
              </p> 
          </div>
      </div> 
      <div class="flex items-center mt-4">
          <img c v-if="photoUrl" :src="photoUrl" alt="Profile picture" class="object-cover rounded-full w-10 h-10 border-4 border-gray-800 mr-2 cursor-pointer"
            @click="navigateToProfile(reviewItems.userId)"
             />
          <p class="text-white md:text-lg">
              <span style="text-decoration:underline; cursor:pointer;" @click="navigateToProfile(reviewItems.userId)">
                  {{ reviewItems.userName ? reviewItems.userName : "Anonymous"}}
              </span>
          </p>
      </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStorage, ref as firebaseRef, getDownloadURL } from 'firebase/storage'
import { getAuth } from "firebase/auth";

import {FormatDate, CreateURL} from '../utils'

export default {
  props: {
    reviewItems: {
      type: Object,
      required: true
    }
  },

  setup(props) {
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
    const photoUrl = ref("");
    const storage = getStorage();
    const stars = computed(() => {
        const starTotal = 5;
        const starPercentage = (props.reviewItems.rating / starTotal) * 100;
        const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
        return starPercentageRounded
    })
    onMounted(() => {
      const storageRef = firebaseRef(storage, 'users/' + props.reviewItems.userId + '/profilePicture.png');
      getDownloadURL(storageRef)
        .then((url) => {
          photoUrl.value = url;
        })
        .catch((error) => {
          console.log("File does not exist or could not fetch the download URL:", error);
          photoUrl.value = '/images/frosk.png'; 
        });
    })
    return {
      stars,
      FormatDate,
      CreateURL,
      photoUrl,
      navigateToProfile
    
    };
    
  },

}
</script>
<style>
.darkblue {
    background-color: #096191
}
.white {
    background-color: #f8f8f8
}
.stars-outer {
    position: relative;
    display: inline-block;
    font-size: 24px; 
    line-height: 1; 
    width: 135px; 
    height: 24px; 
    font-family: 'Font Awesome 5 Free'; 
 
  }

.stars-inner, .stars-background {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
  height: 100%;
  font-size: 24px;
  line-height: 1;
}

.stars-background {
width: 100%; 
}
.stars-inner::before {
  content: "\f005 \f005 \f005 \f005 \f005"; 
  color: #f8ce0b; 
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}
.stars-background::before, .stars-inner::before {
  content: "\f006 \f006 \f006 \f006 \f006"; 
  color: #f8ce0b; 
}

</style>