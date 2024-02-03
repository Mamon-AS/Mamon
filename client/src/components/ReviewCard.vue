<template>
  <div class="darkblue rounded-lg p-4 mb-4 flex flex-col justify-between"> 
      <div class="content-wrapper">
          <img v-if="reviewItems.reviewedImage" :src="CreateURL(reviewItems.reviewedImage, 480, 320)" class="block w-full object-cover mb-4 rounded-lg" />
          <h3 class="text-lg md:text-2xl font-bold mb-4"> {{ reviewItems.reviewedItem }}</h3>
          <p class="text-white md:text-lg mb-4 flex-1">
              {{ reviewItems.description }}
          </p>
          <p class="text-white md:text-lg mb-4 flex-1">
             Skrevet av {{ reviewItems.userName ? reviewItems.userName : "Anonym"}}
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
      <img v-if="photoUrl" :src="photoUrl" alt="profilbilde" class="object-cover rounded-full w-10 h-10 border-4 border-gray-800 mt-4 self-end" />  
      <img v-else :src="defaultPhotoUrl" alt="profilbilde" class="object-cover rounded-full w-10 h-10 border-4 border-gray-800 mt-4 self-end" />    
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getStorage, ref as firebaseRef, getDownloadURL } from 'firebase/storage'

import {FormatDate, CreateURL} from '../utils'

export default {
  props: {
    reviewItems: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const photoUrl = ref("");
    const storage = getStorage();
    const defaultPhotoUrl = '/images/frosk.png';
    const stars = computed(() => {
        const starTotal = 5;
        const starPercentage = (props.reviewItems.rating / starTotal) * 100;
        const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
        return starPercentageRounded
    })
    onMounted(() => {
      const storageRef = firebaseRef(storage, 'users/' + props.reviewItems.userId + '/profilePicture.png');
      getDownloadURL(storageRef).then((url) => {
        photoUrl.value = url;
      }).catch((error) => {
        console.log(error);
      });
    })
    return {
      stars,
      FormatDate,
      CreateURL,
      photoUrl,
      defaultPhotoUrl
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