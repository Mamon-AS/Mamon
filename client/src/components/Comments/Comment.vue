<template>
  <!-- Main comment -->
  <div class="comment-item p-4 border-b border-gray-200" :class="{'highlight-background': props.commentId === props.highlightCommentId}" >
    <div class="author flex items-end mb-2" @click="navigate(props.userId)" >
      <img :src="props.photoUrl" alt="Profile picture" class="object-cover rounded-full w-10 h-10 border-4 border-gray-800 mr-2 cursor-pointer"/>
      <span class="hover:underline cursor-pointer">{{ props.displayName }}</span>
    </div>
    <div class="text-s mt-1">{{ props.text }}</div>
    <div class="details mt-2 text-sm text-gray-500">
      <span class="date">{{ date }}</span>
      <!-- Add a reply button or link -->
      <span class="reply-link text-blue-500 cursor-pointer ml-4" @click="showReplyInput = !showReplyInput">Svar</span>
      <span v-if="props.userId === currentUserId" class="delete-link text-red-500 cursor-pointer ml-4" @click="deleteComment(props.commentId)">Slett</span>
    </div>
    <!-- Reply input field -->
    <div v-if="showReplyInput" class="mt-2">
      <CommentForm
        :reviewId="props.reviewId"
        :parentCommentId="props.commentId"
        :formPlaceholder="'Svar til ' + props.displayName + '..'"
        :reply="true"
        :notificationUserId="props.userId"
      />
    </div>
  </div>

  <!-- Replies to the comment -->
  <div class="replies pl-8 mt-2 mb-2" v-if="props.replies && props.replies.length">
    <div v-for="reply in props.replies" :key="reply.commentId" class="reply-item p-2 border-b border-gray-100">
      <div class="author flex items-end mb-2" @click="navigate(reply.userId)">
        <img :src="reply.photoUrl" alt="Profile picture" class="object-cover rounded-full w-8 h-8 border-2 border-gray-700 mr-2 cursor-pointer"/>
        <span class="hover:underline cursor-pointer">{{ reply.displayName }}</span>
      </div>
      <div class="text-s mt-1">{{ reply.text }}</div>
      <div class="details mt-2 text-xs text-gray-500">
        <span class="date">{{ timeStampToDate(reply.createdAt) }}</span>
        <span class="reply-link text-blue-500 cursor-pointer ml-4" @click="showReplyToReplyInput = reply.commentId">Svar</span>
        <span v-if="reply.userId === currentUserId" class="delete-link text-red-500 cursor-pointer ml-4" @click="deleteComment(reply.commentId)">Slett</span>
        <div v-if="showReplyToReplyInput === reply.commentId" class="mt-2">
          <CommentForm
            :reviewId="props.reviewId"
            :parentCommentId="props.commentId"
            :formPlaceholder="'Svar til ' + props.displayName + '..'"
            :reply="true"
            :notificationUserId="props.userId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth } from 'firebase/auth';
import { useStore } from 'vuex';

import { navigateToProfile, timeStampToDate  } from '../../utils/';

import CommentForm from './CommentForm.vue';

const props = defineProps({
  reviewId: String,
  userId: String,
  photoUrl: String,
  displayName: String,
  text: String,
  createdAt: Object,
  replies: Array,
  commentId: String,
  highlightCommentId: String,
});

const router = useRouter();
const showReplyInput = ref(false);
const showReplyToReplyInput = ref(null);
const replyText = ref('');
const currentUser = ref(null);
const currentUserId = ref(null);
const store = useStore();
getAuth().onAuthStateChanged(user => {
      currentUser.value = user;
    });

const date = timeStampToDate(props.createdAt);
const navigate = (userId) => navigateToProfile(router, userId);
watch(currentUser, (newValue) => {
  if (newValue) {
    currentUserId.value = newValue.uid;
  }
});


const postReply = async (notificationUserId) => {
  const text = replyText.value.trim();
  if (!text) return;
  const action = 'reply';
  const reviewId = props.reviewId;
  const commentId = props.commentId;
   try {
      await store.dispatch('reviews/postComment', {
        action,
        commentId,
        text,
        reviewId,
        parentCommentId: commentId,
        userId: currentUser.value.uid,
        displayName: currentUser.value.displayName,
        notificationUserId: notificationUserId
     });
       replyText.value = '';
      showReplyInput.value = false;
      showReplyToReplyInput.value = null;
    } catch (error) {
      console.error("Error posting reply:", error);
     }
};
const deleteComment = async (commentId) => {
  const action = 'delete';
  const reviewId = props.reviewId;
  try {
    const response = await store.dispatch('reviews/deleteComment', {
      action,
      commentId,
      reviewId,
      userId: currentUser.value.uid
    });
    if (response.status >= 200 && response.status < 300) {
      console.log('Comment deleted successfully');
    } else {
      throw new Error('Deletion failed on the server.');
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};


onMounted(async () => {
    await nextTick();
    if (props.commentId === props.highlightCommentId) {
      console.log("WE HAVE A MATCH");
      const element = document.querySelector(`.highlight-background`);
      if (element) {
        console.log("I am finna scroll");
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });


</script>
<style>
.highlight-background {
  background-color: #f0f9ff; 
  border-color: #bfdbfe; 
}
</style>
