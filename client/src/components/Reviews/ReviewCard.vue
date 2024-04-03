<template>
  <div class="relative rounded-lg p-4 pt-6 m-2 mt-4 justify-between border-solid border-4 border-mamonblue text-left">
    <div class="flex absolute -top-4 -left-2 pr-1 pb-1 mb-1 bg-white" @click="navigate(reviewItems.userId)">
      <img c v-if="photoUrl" :src="photoUrl" alt="Profile picture" class="object-cover rounded-full w-10 h-10 border-4 border-mamonblue mr-2 cursor-pointer"/>
      <span class="cursor-pointer hover:underline">{{ reviewItems.userName ? reviewItems.userName : "Anonym"}}</span>
    </div>
    <div class="flex justify-between items-end my-2">
      <div class="flex items-center">
        <div class="stars-outer">
          <div class="stars-inner" :style="{ width: stars }"></div>
          <div class="stars-background"></div>
        </div>
      </div>
      <p class="text-sm">
        {{ FormatDate(reviewItems._createdAt) }}
      </p> 
    </div>

    <div class="content-wrapper">
      <img v-if="reviewItems.reviewedImage" :src="CreateURL(reviewItems.reviewedImage, 480, 320)" class="block w-full object-cover mb-4 rounded-lg" />
      <h3 class="text-lg md:text-2xl font-bold"> {{ (reviewItems.reviewedItem.length > 30 ? reviewItems.reviewedItem.slice(0,30) + '...' : reviewItems.reviewedItem) }}</h3>
      
      <p class="md:text-lg mb-4">
        {{ reviewItems.description }}
      </p>
    </div> 

    <div class="border-t border-gray-800"></div>

    <!-- Emoji section -->
    <div class="flex items-end relative ml-2">
      <template v-if="uniqueEmojis.length > 0">
        <span v-for="emoji in uniqueEmojis"
                    :key="emoji.value" 
                    :class="['emoji', 'cursor-pointer', { 'userReactedEmoji ': isUserReactedEmoji(emoji.value) }]" 
                    @click="toggleModal('listOfReactions')">
          {{ emoji.value }} 
        </span>
      </template>
      <template v-else>
        <span class="emoji cursor-pointer" @click="toggleModal('listOfReactions')">👍</span>
      </template>
      
      <!-- Reaction Modal, shown conditionally -->
      <div v-if="showReactionModal" class="reaction-modal absolute bottom-full mb-2 bg-white rounded-lg p-2 shadow-lg transform -translate-x-1/2 left-1/2">
        <span class="absolute bottom-6 closeRightCross p-4 cursor-pointer shadow-xs" @click="showReactionModal = false"><i class="fa-regular fa-x"></i></span>
        <div class="flex justify-around">
          <span v-for="emoji in emojis" class="emoji text-2xl cursor-pointer mx-1"
                      :key="emoji.value"
                      @click="sendReaction(emoji, reviewItems._id, reviewItems.userId); showReactionModal = false;">
            {{ emoji.value }}
          </span>
        </div>
      </div>
      <!-- Reaction Modal END -->

      <p class="text-xs cursor-pointer hover:underline "  @click="toggleModal('listOfUsers')">
        <template v-if="reactionsCount > 0">
          {{ reactionsCount }} 
        </template>
      </p>
    
    </div>
    <!-- Emoji section END -->

    <!-- Comment Section -->
    <div v-if="reviewItems.comments && reviewItems.comments.length > 0" class="comments-container">
      <template v-if="!showAllComments">
        <div class="bottom-full bg-white rounded-lg mt-4" v-for="(comment, index) in reviewItems.comments.slice(0, 2)" :key="index">
          <Comment
            :reviewId="reviewItems._id"
            :userId="comment.userId"
            :photoUrl="comment.photoUrl"
            :displayName="comment.displayName"
            :text="comment.text"
            :createdAt="comment.createdAt"
            :replies="comment.replies"
            :commentId="comment.commentId"
            :highlightCommentId="highlightCommentId"
          />
        </div>
        <button v-if="reviewItems.comments.length > 2" @click="showAllComments = true" class="text-gray-500 mx-auto block mt-4 px-4 py-2 rounded hover:bg-gray-100 focus:outline-none">
        Les alle kommentarene ({{ reviewItems.comments.length - 2 }} flere)
      </button>
      </template>
      <template v-else>
        <div class="bottom-full bg-white rounded-lg mt-4" v-for="(comment, index) in reviewItems.comments" :key="comment.commentId">
          <Comment
            :reviewId="reviewItems._id"
            :userId="comment.userId"
            :photoUrl="comment.photoUrl"
            :displayName="comment.displayName"
            :text="comment.text"
            :createdAt="comment.createdAt"
            :replies="comment.replies"
            :commentId="comment.commentId"
            :highlightCommentId="highlightCommentId"
          />
        </div>
      </template>

      <CommentForm 
        :reviewId="reviewItems._id"
        :reviewerUserId="reviewItems.userId"
        :reviewerPhotoUrl="photoUrl"
        :formPlaceholder="!(reviewItems.comments?.length) ? 'Bli den første til å kommentere' : undefined"
      />
    </div>
    <!-- Comment Section END--> 
  

    <div v-if="showListOfUsersModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click="showListOfUsersModal = false">
      <div class="modal-content bg-white rounded-lg p-4 max-w-md mx-auto" @click.stop="true"> 
        <ListOfUsers :users="usersData"/>
        <button class="mt-4 py-2 px-4 bg-mamonblue text-white rounded hover:bg-red-500" @click="showListOfUsersModal = false">Lukk</button>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStorage, ref as firebaseRef, getDownloadURL } from 'firebase/storage'
import { getAuth } from "firebase/auth";
import axios from 'axios';

import {FormatDate, CreateURL, navigateToProfile} from '../../utils'
import ListOfUsers from '../ListOfUsers.vue';
import CommentForm from '../Comments/CommentForm.vue';
import CommentItem from '../Comments/CommentItem.vue';

export default {
  props: {
    reviewItems: {
      type: Object,
      required: true
    },
    highlightCommentId: String,
  },
  components: {
    ListOfUsers,
    CommentForm,
    CommentItem,
  },

  setup(props) {
    const showListOfUsersModal = ref(false);
    const reactedUsers = ref([]);
    const currentUser = ref(null);
    const userReaction = ref({});
    const reactionsCount = ref(0); 
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
    const showReactionModal = ref(false); 
    const showAllComments = ref(false);
    let ignoreFirstClick = false;
    
    // Computed property to get unique emojis
    const uniqueEmojis = computed(() => {
      const allReactions = [...Object.values(reactions.value), userReaction.value].filter(Boolean);
      const allEmojiValues = allReactions.map(reaction => reaction.emoji);
      const uniqueEmojiValues = Array.from(new Set(allEmojiValues));

      return emojis.value.filter(emoji => uniqueEmojiValues.includes(emoji.value));
    });
  
    // Method to check if emoji is the one user reacted with
    const isUserReactedEmoji = (emojiValue) => {
      return userReaction.value?.emoji === emojiValue;
    };


    watch(currentUser, (newUser) => {
      if (newUser) {
        getReactions(props.reviewItems._id);
      }
    }, { immediate: true });

  
    getAuth().onAuthStateChanged(user => {
      currentUser.value = user;

    });

    const navigate = (userId) => navigateToProfile(router, userId);

    const stars = computed(() => {
        const starTotal = 5;
        const starPercentage = (props.reviewItems.rating / starTotal) * 100;
        const starPercentageRounded = `${(Math.round(starPercentage / 10) * 10)}%`;
        return starPercentageRounded
    })

    const sendReaction = async (selectedEmoji, reviewId, notificationUserId) => {
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
          displayName: currentUser.value.displayName,
          notificationUserId: notificationUserId
        });

        if (response.status >= 200 && response.status < 300) {
          // Successfully posted the reaction, update the local state
          userReaction.value = { emoji: selectedEmoji.value, displayName: currentUser.value.displayName };

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
  };

  const usersData = computed(() => {
    return Object.values(reactedUsers.value.reactions).map(reaction => ({
      userId: reaction.userId,
      name: reaction.displayName,
      photoUrl: reaction.photoUrl,
      emoji: reaction.emoji
    }));
  });

  const toggleModal = (modalName) => {
    ignoreFirstClick = true;
    if (modalName === 'listOfReactions') {
      showReactionModal.value == false ? showReactionModal.value = true : showReactionModal.value = false;
    }
    else if (modalName === 'listOfUsers') {
      showListOfUsersModal.value == false ? showListOfUsersModal.value = true : showListOfUsersModal.value = false;
    }

  };


  const handleClickOutside = (event) => {
    if (ignoreFirstClick) {
      ignoreFirstClick = false;
      return;
    }


    const reactionModal = document.querySelector('.reaction-modal');
    if (showReactionModal.value && reactionModal && !reactionModal.contains(event.target)) {
      toggleModal('listOfReactions');
    }

    const usersModal = document.querySelector('.modal-content'); 
    if (showListOfUsersModal.value && usersModal && !usersModal.contains(event.target)) {
      toggleModal('listOfUsers');
    }
  };
  

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
      window.addEventListener('click', handleClickOutside);
  })

  onUnmounted(() => {
      window.removeEventListener('click', handleClickOutside);
    });

  return {
    stars,
    FormatDate,
    CreateURL,
    photoUrl,
    navigate,
    emojis,
    sendReaction,
    reactionsCount,
    userReaction,
    showListOfUsersModal,
    usersData,
    showReactionModal,
    toggleModal,
    uniqueEmojis,
    isUserReactedEmoji,
    showAllComments
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
  transition: transform 0.1s ease-in-out;
}

.emoji:hover {
  transform: scale(1.1);
}


.userReactedEmoji {
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  transform: translateY(-0.5rem) scale(1.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, color 0.3s ease-in-out;
  color: #4ade80; 
  box-shadow: 0 0 5px #4ade80 inset, 0 0 5px #4ade80; 
  border-radius: 50%; 
}

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

.closeRightCross {
  right: 12.5rem;
}

</style>