<template>
  <!-- Comment Form -->
  <div class="flex relative m-1 pt-1">
    <textarea v-model="commentText" :placeholder="formPlaceholder" maxlength="280"
      class="textarea w-full p-2 border rounded-l-md border-gray-300" rows="3"
      style="border-top-left-radius: 0.375rem; border-bottom-left-radius: 0.375rem;">
		</textarea>
    <button @click="postComment(commentText, 'add', null, parentCommentId)"
            class="submit-btn bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-700">
      Send
		</button>
    <div v-if="commentText.length > 0"
		        	:class="['absolute', 'bottom-0', 'left-2', 'text-right', 'text-sm', 'bg-white-100',
              {'text-gray-300': commentText.length <= 250},
              { 'text-red-300': commentText.length > 250 && commentText.length <= 270},
              { 'text-red-600': commentText.length > 270 }]">
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
  reviewerUserId: String,
  reviewedImage: String,
  reviewerName: String,
  reviewerPhotoUrl: String,
  parentCommentId: String,
  formPlaceholder: {type: String, default: 'Kommentér'},
});

const store = useStore();
const currentUser = ref(null);
const commentText = ref('');
const showCommentForm = ref(false);

getAuth().onAuthStateChanged(user => {
      currentUser.value = user;
    });

const postComment = async (text, action = "add", commentId = null, parentCommentId = null)  => {
  const commentData = { 
    text, 
    reviewId: props.reviewId, 
    userId: currentUser.value.uid, 
    displayName: currentUser.value.displayName,
    action, 
    commentId, 
    parentCommentId,
    notificationUserId: props.reviewerUserId
  };
  showCommentForm.value = false;
  
  await store.dispatch('reviews/postComment', commentData);
  commentText.value = '';
}

</script>
