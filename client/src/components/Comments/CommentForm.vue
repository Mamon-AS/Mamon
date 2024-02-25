<template>
  <div class="icon-container text-center">
    <button @click="toggleCommentForm" class="flex items-center justify-center text-white p-4 transition-transform duration-200 ease-in-out transform hover:scale-110">
      <i class="fa-regular fa-comment-dots text-2xl"></i>
      <span class="ml-2 font-semibold">Kommentér</span>
    </button>
  </div>


  <div class="p-3 m-1">
    <!-- Comment Form, conditionally rendered -->
    <div v-if="showCommentForm" class="p-3 m-1">
      <textarea v-model="commentText" placeholder="Kommentér?" maxlength="280" class="textarea w-full p-2 border rounded-md border-gray-300" rows="3"></textarea>
      <div class="text-right text-sm text-gray-600">
        {{ 280 - commentText.length }} karakterer igjen
      </div>
      <button @click="postComment(commentText)" class="submit-btn mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
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
    parentCommentId 
  };
  showCommentForm.value = false;
  await store.dispatch('reviews/postComment', commentData);
}

const toggleCommentForm = () => {
  showCommentForm.value = !showCommentForm.value;
};

</script>
