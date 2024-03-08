<template>
  <div class="relative">
    <button @click="toggleNotificationsDropdown" class="flex items-center justify-center relative w-10 h-10 mr-2">
      <i class="fa-solid fa-bell fa-2xl" style="color: #ffffff;"></i>
      <span v-if="unseenNotificationsCount" class="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-xs text-white bg-red-500 rounded-full">
        {{ unseenNotificationsCount.length > 9 ? "9+" : unseenNotificationsCount }}
      </span>
    </button>
    <div v-show="showNotificationsDropdown" class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
      <ul>
        <li v-for="notification in notifications" :key="notification.notificationId" @click="markAsRead(notification.id)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          {{ notification.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
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
    const notifications = computed(() => store.state.users.notifications);
    const unseenNotificationsCount = computed(() => notifications.value.filter(n => !n.seen).length);
    let unsubscribe = null;

    const toggleNotificationsDropdown = () => {
      showNotificationsDropdown.value = !showNotificationsDropdown.value;
    };

    const markAsRead = (notificationId) => {
      store.dispatch('users/markNotificationAsRead', notificationId);
    };

    onMounted(() => {
      const q = query(collection(db, 'notifications'), where('userId', '==', props.userId));
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            const notification = { id: change.doc.id, ...change.doc.data() };
            store.commit('users/ADD_NOTIFICATION', notification); 
          }
      
        });
      });
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    return {
      showNotificationsDropdown,
      notifications,
      unseenNotificationsCount,
      toggleNotificationsDropdown,
      markAsRead,
    };
  },
};
</script>
