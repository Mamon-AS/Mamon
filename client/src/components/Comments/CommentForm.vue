<template>
  <!-- Comment Form -->
  <div class="flex relative m-1 pt-1">
    <textarea v-model="commentText" :placeholder="formPlaceholder" maxlength="280"
      class="textarea w-full p-2 border rounded-l-md border-gray-300" rows="3"
      style="border-top-left-radius: 0.375rem; border-bottom-left-radius: 0.375rem;">
		</textarea>
    <button @click="postComment(commentText, (reply ? 'reply' : 'add'), parentCommentId)"
            class="submit-btn bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-700">
      <span v-if="!isSending">Send</span>
      <span v-else>Sender...</span>
		</button>
    <div v-if="commentText.length > 0"
		        	:class="['absolute', 'bottom-0', 'left-2', 'text-right', 'text-sm', 'bg-white', 'bg-opacity-50',
              {'text-gray-300': commentText.length <= 250},
              {'text-red-300': commentText.length > 250 && commentText.length < 270},
              {'text-red-600': commentText.length >= 270 }]">
      {{ 280 - commentText.length }} / 280
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { useStore } from 'vuex';

const props = defineProps({
  reviewId: String,
  notificationUserId: String,
  reviewedImage: String,
  reviewerName: String,
  reviewerPhotoUrl: String,
  parentCommentId: String,
  formPlaceholder: {type: String, default: 'Kommentér'},
  reply: {type: Boolean, default: false},
});

const store = useStore();
const currentUser = ref(null);
const commentText = ref('');
const isSending = ref(false); // Track if a comment is being sent

getAuth().onAuthStateChanged(user => {
      currentUser.value = user;
    });

const postComment = async (text, action, notificationUserId, parentCommentId = null, commentId = null)  => {
  if (isSending.value) return;
  
  isSending.value = true;
  
  const commentData = { 
    text, 
    reviewId: props.reviewId, 
    userId: currentUser.value.uid, 
    displayName: currentUser.value.displayName,
    action, 
    commentId, 
    parentCommentId,
    notificationUserId: props.notificationUserId
  };
  
  try {
    await store.dispatch('reviews/postComment', commentData);
    commentText.value = '';
  } catch (error) {
    console.error('Error posting comment:', error);
  } finally {
    isSending.value = false; 
  }
}

</script>
