<template>
  <div class="bg-mamonblue rounded-lg p-4 mb-4 flex flex-col justify-between"> 
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
        <div class="flex justify-center mt-4">
          <span v-for="emoji in emojis" :key="emoji.value"
            class="emoji text-2xl cursor-pointer mx-1"
            :class="{ 'reacted': isReacted(emoji) }"
            :style="{ opacity: emojiOpacity(emoji) }"
            @click="sendReaction(emoji, reviewItems._id)">
          {{ emoji.value }}
        </span>

      </div>
      <p class="flex justify-center text-white text-sm cursor-pointer text-decoration-line: underline" @click="openListOfUsersModal(reviewItems._id)">
        <template v-if="reactionsCount === 1">
          {{ reactionsCount }} reaksjon
        </template>
        <template v-else-if="reactionsCount > 1">
          {{ reactionsCount }} reaksjoner
        </template>
      </p>

      <div v-if="showListOfUsersModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="showListOfUsersModal = false">
        <div class="modal-content bg-white rounded-lg p-4 max-w-md mx-auto" @click.stop="true"> 
          <ListOfUsers :users="usersData"/>
          <button class="mt-4 py-2 px-4 bg-mamonblue text-white rounded hover:bg-red-500" @click="showListOfUsersModal = false">Lukk</button>
        </div>
      </div>
    </div>
</template>

<script>
import { watch, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStorage, ref as firebaseRef, getDownloadURL } from 'firebase/storage'
import { getAuth } from "firebase/auth";
import axios from 'axios';

import {FormatDate, CreateURL} from '../utils'
import ListOfUsers from './ListOfUsers.vue';

export default {
  props: {
    reviewItems: {
      type: Object,
      required: true
    }
  },
  components: {
    ListOfUsers
  },

  setup(props) {
    const showListOfUsersModal = ref(false);
    const reactedUsers = ref([]);
    const currentUser = ref(null);
    const userReaction = ref({});
    const reactionsCount = ref({}); 
    const reactions = ref({})
    const photoUrl = ref("");
    const storage = getStorage();
    const router = useRouter();
    const emojis = ref([
      { value: '😀', clicked: false },
      { value: '😍', clicked: false },
      { value: '😢', clicked: false },
      { value: '👍', clicked: false },
      { value: '😎', clicked: false }
    ]);


    watch(currentUser, (newUser) => {
      if (newUser) {
        getReactions(props.reviewItems._id);
      } else {
        console.log("Waiting for user login...");
      }
    }, { immediate: true });

  
    getAuth().onAuthStateChanged(user => {
      currentUser.value = user;

    });


    const isReacted = computed(() => {
      return (emoji) => emoji.value === userReaction.value?.emoji;
    });

    const emojiOpacity = computed(() => {
      return (emoji) => {
      // Check if this emoji has been reacted to by any user
        const hasReaction = Object.values(reactions.value).some(reaction => reaction.emoji === emoji.value);
        return hasReaction ? 1 : 0.5; // Full opacity if reacted to, otherwise reduced
      };
    });


    const navigateToProfile = async (userId) => {
      const currentUserId = currentUser.value ? currentUser.value.uid : null;
      if (userId === currentUserId) {
        router.push({ name: 'user' });
      } else {
        router.push({ name: 'UserProfile', params: { userId } });
      }
    };

    const stars = computed(() => {
        const starTotal = 5;
        const starPercentage = (props.reviewItems.rating / starTotal) * 100;
        const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
        return starPercentageRounded
    })

    const sendReaction = async (selectedEmoji, reviewId) => {
      // Immediately check if the user is logged in
      if (!currentUser.value) {
        console.log("User not logged in to post reactions.");
        return;
      }

      try {
        // Post the new reaction
        const response = await axios.post(`/.netlify/functions/postUserReactions`, {
          emoji: selectedEmoji.value,
          reviewId: reviewId,
          userId: currentUser.value.uid,
          displayName: currentUser.value.displayName
        });

        if (response.status >= 200 && response.status < 300) {
          // Successfully posted the reaction, update the local state
          userReaction.value = { emoji: selectedEmoji.value, displayName: currentUser.value.displayName };
          console.log("Reaction updated successfully.");
          await getReactions(reviewId);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
         } 
      } catch (error) {
        console.error("Error posting user reactions:", error);
      }
  
    };


  const getReactions = async (reviewId) => {
    if (!currentUser.value) {
      console.log("User not logged in getReactions.");
      return;
      }

    try {
      const response = await axios.post(`/.netlify/functions/getUserReactions`, {
        reviewId: reviewId,
        userId: currentUser.value.uid
      });


      if (response.status === 200 && response.data.reactions) {
        reactions.value = response.data.reactions;
        userReaction.value = response.data.userReaction;   
        reactionsCount.value = response.data.totalReactions;
        reactedUsers.value = response.data

      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching user reactions:", error);
    }
  }

  const openListOfUsersModal = async () => {
        showListOfUsersModal.value = true;
      };

  const usersData = computed(() => {
    return Object.values(reactedUsers.value.reactions).map(reaction => ({
      userId: reaction.userId,
      name: reaction.displayName,
      photoUrl: reaction.photoUrl,
      emoji: reaction.emoji
    }));
  });

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
    navigateToProfile,
    emojis,
    sendReaction,
    reactionsCount,
    userReaction,
    isReacted,
    emojiOpacity,
    showListOfUsersModal,
    openListOfUsersModal,
    reactedUsers,
    usersData
  };
    
  },
}
</script>
<style>
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

.emoji {
  transition: transform 0.2s ease-in-out, opacity 0.2s;
}

.emoji:hover {
  opacity: 1;
  transform: translateY(-0.5rem) scale(1.5);
}

.reacted {
  transform: translateY(-0.5rem) scale(1.5); /* Highlight the user's reaction */
}



/* Optional: Adjust the keyframes for a more pronounced effect when clicked */
@keyframes click-animation {
  0%, 100% {
    transform: translateY(0) scale(1); 
  }
  25% {
    transform: translateY(-0.5rem) scale(1.75); 
  }
  50% {
    transform: translateY(-0.25rem) scale(1.5); 
  }
}


</style>