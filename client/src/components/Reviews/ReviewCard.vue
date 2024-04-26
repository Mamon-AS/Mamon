<template>
  <div class="relative rounded-lg p-4 pt-6 m-2 mt-4 justify-between border-solid border-4 border-mamonblue text-left mt-7">
    <div class="flex absolute -top-4 -left-2 pr-1 pb-1 mb-1 bg-white" @click="navigate(reviewItems.userId)">
      <img c v-if="photoUrl" :src="photoUrl" alt="Profile picture" class="object-cover rounded-full w-10 h-10 border-4 border-mamonblue mr-2 cursor-pointer"/>
      <span class="cursor-pointer hover:underline">{{ reviewItems.userName ? reviewItems.userName : "Anonym"}}</span>
    </div>
    <div class="flex justify-between items-end my-2">
      <div class="flex items-center">
        <div class="stars-outer relative">
          <div class="stars-inner" :style="{ width: stars }"></div>
          <div class="stars-background"></div>
          <i class="fa-solid fa-circle-info absolute top-0 right-0 text-sm" style="color: #096191; margin-top: -1rem; margin-right: -0.75rem;"
            @click="showInfoModal = !showInfoModal"></i>
        </div>
      </div>

      <!-- Information Modal -->
      <div v-if="showInfoModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3 text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <i class="fa-solid fa-circle-info text-blue-600"></i>
            </div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Stjernekartet</h3>
            <ul class="mt-2 px-7 py-3 text-center space-y-4 text-md text-gray-900">
              <li>⭐<br>Anbefales virkelig ikke.</li>
              <li>⭐⭐<br>Litt dårligere enn hva jeg forventet.</li>
              <li>⭐⭐⭐<br>Som forventet - Fornøyd. Dette er normalen, og 3-5 stjerner indikerer et godt kjøp.</li>
              <li>⭐⭐⭐⭐<br>Litt bedre enn hva jeg forventet.</li>
              <li>⭐⭐⭐⭐⭐<br>Anbefales!</li>
            </ul>
            <div class="items-center px-4 py-3">
              <button id="ok-btn" @click="showInfoModal = false" class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Information Modal END -->
      <p class="text-sm">
        {{ FormatDate(reviewItems._createdAt) }}
      </p> 
    </div>

    <div class="content-wrapper">
      <img v-if="reviewItems.reviewedImage" :src="CreateURL(reviewItems.reviewedImage, 480, 320)" class="block w-full object-cover mb-4 rounded-lg" />
      <h3 class="text-lg md:text-2xl font-bold text-center">
        {{ reviewItems.website }}
      </h3>
      <h3 class="text-lg md:text-2xl font-bold text-center"> 
        <a :href="reviewItems.url" class="hover:text-blue-600 underline" target="_blank" rel="noopener noreferrer"> 
          {{ (reviewItems.reviewedItem.length > 30 ? reviewItems.reviewedItem.slice(0,30) + '...' : reviewItems.reviewedItem) }} 
        </a>
      </h3>
      
      <p class="md:text-lg mb-4 text-center">
        {{ reviewItems.description }}
      </p>
    </div> 

    
    <!-- Emoji section -->
    <div class="flex items-center relative ml-2">
      <template v-if="uniqueEmojis.length > 0">
        <span v-for="emoji in uniqueEmojis"
                    :key="emoji.value" 
                    :class="['emoji', 'cursor-pointer', 'topp', { 'userReactedEmoji ': isUserReactedEmoji(emoji.value) }]" 
                    >
          {{ emoji.value }} 
        </span>
        <div class="flex justify-between flex-grow">
        <p v-if="reactionsCount" class="flex cursor-pointer hover:underline mb-2" @click="toggleModal('listOfUsers')">
          {{ reactionsCount }} Liker
        </p>
          <!-- Spacer element to maintain space between when one element is not rendered -->
        <div v-if="!reactionsCount && additionalItemsCount"></div>
        <p v-if="additionalItemsCount" class="mb-2 cursor-pointer hover:underline" @click="toggleModal('commentForm')">
          {{ additionalItemsCount }} Kommentarer
        </p>
        </div>
      </template>

    </div>
    <div class="border-t border-gray-800"></div>
    
      <div class="flex justify-between flex-grow">
        <div class="p-2 hover:bg-blue-200 focus:outline-none rounded ml-2 transition-transform">
          <i @click="toggleModal('listOfReactions')" class="fa-regular fa-thumbs-up mr-2 cursor-pointer reaction-modal"></i>
          <span v-if="showReactionModal" v-for="emoji in emojis" class="emoji text-l cursor-pointer mx-1"
                      :key="emoji.value"
                      @click="sendReaction(emoji, reviewItems._id, reviewItems.userId);">
            {{ emoji.value }}
          </span>
          <span v-else @click="toggleModal('listOfReactions')" class="cursor-pointer">Lik</span>
        </div>
        <button @click="toggleModal('commentForm')" class="p-2 rounded hover:bg-blue-200 focus:outline-none ml-2">
          <i class="fas fa-comment-dots ml-2"></i> 
          Kommenter
        </button>
      </div>
    <!-- Emoji section END -->

    <!-- Comment Section -->
    <div v-show="showCommentForm" class="transition-opacity duration-500 ease-in-out" :class="{'opacity-0': !showCommentForm, 'opacity-100': showCommentForm}">
    <div v-if="reviewItems.comments && reviewItems.comments.length > 0" class="comments-container">
        <div class="bottom-full bg-white rounded-lg mt-4" v-for="(comment, index) in reviewItems.comments" :key="index">
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
    </div> 

      <CommentForm 
        :reviewId="reviewItems._id"
        :notificationUserId="reviewItems.userId"
        :reviewerPhotoUrl="photoUrl"
        :formPlaceholder="!reviewItems.comments?.length ? 'Bli den første til å kommentere' : 'Legg til en kommentar'"
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
import Comment from '../Comments/Comment.vue';

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
    Comment,
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
    const showInfoModal = ref(false);
    const showCommentForm = ref(false);
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

    // Total comments
    const additionalItemsCount = computed(() => {
      if (!props.reviewItems.comments || !Array.isArray(props.reviewItems.comments)) {
        return 0; 
      }
      const totalComments = props.reviewItems.comments.length;

      const totalReplies = props.reviewItems.comments.reduce((sum, comment) => {
        return sum + (comment.replies ? comment.replies.length : 0);
      }, 0);

      const totalItems = totalComments + totalReplies;

      return totalItems > 0 ? totalItems : 0;
    });


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
          showReactionModal.value = false;
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
    else if (modalName === 'commentForm') {
      showCommentForm.value == false ? showCommentForm.value = true : showCommentForm.value = false;
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
        photoUrl.value = '/images/blank_profile.jpg'; 
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
    showInfoModal,
    additionalItemsCount,
    showCommentForm,
  };
    
  },
}
</script>
<style>
.topp {
  transform: translateY(-4px); 
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

.emoji {
  transition: transform 0.2s ease-in-out;
}

.emoji:hover {
  transform: scale(1.05);
}

.userReactedEmoji {
  display: inline-flex; 
  margin-right: 0.8rem;
  align-items: center; 
  justify-content: center; 
  transform: translateY(-1rem) scale(1.7);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, color 0.3s ease-in-out;
  color: #f1ee09; 
  box-shadow: 0 0 5px #cdda22 inset, 0 0 5px #cddf2b; 
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

</style>