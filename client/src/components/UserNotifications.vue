<template>
  <div class="relative">
    <button @click="toggleNotificationsDropdown" class="flex items-end justify-center relative mr-4 ml-2">
      <i class="fa-solid fa-bell fa-l" style="color: #ffffff;"></i>
      <span v-if="unseenNotificationsCount" class="absolute -top-4 -right-3 flex items-center justify-center p-1 text-xs text-white bg-red-500 rounded-full">
        {{ unseenNotificationsCount.length > 9 ? "9+" : unseenNotificationsCount }}
      </span>
    </button>
    <div v-show="showNotificationsDropdown" class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-auto" style="max-height: 300px;">
      <ul>
        <li v-for="notification in notifications" :key="notification.notificationId"
            @click="markAsRead(notification.id, notification.reviewId, notification.commentId, notification.type, notification.userId);"
            :class="{'unseen-notification': !notification.seen}"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
          <div class="flex justify-between">
            <span>{{ notification.message }}</span>
            <span class="text-sm text-gray-500">{{ (timeStampToTimeAgo(notification.timestamp)) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { db } from "../firebaseInit"; 

export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const showNotificationsDropdown = ref(false);
    const notifications = computed(() => {
    return [...store.state.users.notifications].sort((a, b) => {
      return b.timestamp.toDate() - a.timestamp.toDate();
    });
  });

    const unseenNotificationsCount = computed(() => notifications.value.filter(n => !n.seen).length);

    let unsubscribe = null;
    const router = useRouter();

    const toggleNotificationsDropdown = () => {
      showNotificationsDropdown.value = !showNotificationsDropdown.value;
    };
    const closeDropdownIfClickedOutside = (event) => {
      if (!event.target.closest('.relative')) {
        showNotificationsDropdown.value = false;
      }
    };
    watch(showNotificationsDropdown, (newVal) => {
      if (newVal) {
        document.addEventListener('click', closeDropdownIfClickedOutside);
      } else {
        document.removeEventListener('click', closeDropdownIfClickedOutside);
      }
    });


    const timeStampToTimeAgo = (timestamp) => {
      const now = new Date();
      const seconds = Math.floor((now - timestamp.toDate()) / 1000);
      let interval = seconds / 31536000;
      if (interval > 1) {
        return Math.floor(interval) + " år siden";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " måneder siden";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " dager siden";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " timer siden";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutter siden";
      }
      return Math.floor(seconds) + " sekunder siden";
    };

    const markAsRead = (notificationId, reviewId, commentId, type, userId) => {
      if (type === 'comment' || type === 'reaction') {
        store.dispatch('users/markNotificationAsRead', notificationId);
        showNotificationsDropdown.value = false;
        router.push({
          path: `/review/${reviewId}`,
          query: { 
            ...commentId ? { commentId } : {},
          },
        });
      }
      else if (type === 'followRequest') {
        store.dispatch('users/markNotificationAsRead', notificationId);
        showNotificationsDropdown.value = false;
        router.push({
          path: `/users/${userId}`,
        });
      }
      else if (type === 'followRequestAccepted') {
        store.dispatch('users/markNotificationAsRead', notificationId);
        showNotificationsDropdown.value = false;
        router.push({
          path: `/users/${userId}`,
        });
      }

    };

    onMounted(() => {
      const q = query(collection(db, 'notifications'), where('notificationUserId', '==', props.userId));
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            const notification = { id: change.doc.id, ...change.doc.data() };
            store.commit('users/SET_NOTIFICATION', notification); 
          }
      
        });
      });
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
      document.removeEventListener('click', closeDropdownIfClickedOutside);
    });

    return {
      showNotificationsDropdown,
      notifications,
      unseenNotificationsCount,
      toggleNotificationsDropdown,
      markAsRead,
      timeStampToTimeAgo,
      closeDropdownIfClickedOutside
    };
  },
};
</script>
<style>
.unseen-notification {
  background-color: #ebf4ff; 
}
</style>
