<template>
 <header 
    :class="[
      'flex items-center justify-between p-1 z-50 fixed top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 rounded-lg mt-3', 
      'w-full md:w-6/12',
      { 'bg-[rgba(9,97,145,0.9)]': !searchResults.length > 0 },
      { 'bg-blue-500 h-10 md:h-16': searchResults.length > 0 },
    ]"
    :style="showSearchField ? { position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 } : {}"
  >
    <!-- ICONS BEGIN -->
    <div class="flex items-center">
      <a href="/" class="ml-2 lg:ml-5 mr-2">
        <img 
          src="/images/Transparent_Image_11_cropped.png" 
          alt="Logo" 
          class="h-auto max-h-5 w-auto logo"
          v-show="windowWidth > 768 || !inputFocused"
        />
      </a>

      <input
        v-show="isLoggedIn"
        v-model="searchQuery"
        ref="searchField"
        type="search"
        placeholder="Søk..."
        @focus="inputFocused = true"
        @blur="inputFocused = false"
        class="px-2 py-1 lg:ml-8 mr-2 text-xs border border-gray-300 rounded-md shadow-sm opacity-50 w-20 focus:w-auto focus:opacity-100 hover:opacity-100 focus:outline-none focus:ring-2 
        focus:border-lightblue bg-white transition-all duration-300"
      />
      
      <HeaderItem to="/review" v-show="isLoggedIn">
        <div class="flex flex-col md:flex-row items-center px-2 py-1 md:py-0">
          <i class="fa-solid fa-feather lg:fa-xl" style="color: #ffffff;"></i>
          <p class="hidden md:block md:ml-2">Tips</p>
        </div>
      </HeaderItem>
    </div>
    <!-- ICONS END -->
    <div v-show="searchResults.length > 0" class="absolute top-[calc(50%+theme(spacing.6))] left-0 w-full bg-white shadow-lg z-50">
      <ul>
        <li v-for="user in searchResults" :key="user.userId" class="p-2 hover:bg-gray-100">
          <span style="text-decoration:underline; cursor:pointer;" @click="navigate(user.userId)">
            {{ user.displayName }}
            👉 
            {{ user.bio ? user.bio : "Ingen bio 😿"}}
          </span>
        </li>
      </ul>
    </div>
    <div v-if="isLoggedIn" class="flex items-center">
      <!-- People You May Know -->
      <HeaderItem to="/suggestions">
        <div class="px-2">
          <i class="fa-solid fa-user-group" style="color: #ffffff;"></i>
        </div>
      </HeaderItem>
      <!-- Notification Bell -->
      <UserNotifications 
        :userId="userID"
      />
      <!-- Profile Photo and Dropdown -->
      <div @click="toggleModal" class="cursor-pointer">
      <img :src="photoUrl" alt="Profile photo" class="object-cover rounded-full w-6 h-6 border-2 mr-2 cursor-pointer border-white">
    </div>
    
    <!-- WHEN YOU CLICK USER PROFILE BEGIN -->
    <Modal v-model="modalIsActive">
      <div class="flex flex-col dropdown animate-fade-in">
        <button @click="navigate(userID)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-2 hover:scale-105 transition duration-300 ease-in-out">
          <i class="fa-solid fa-user mr-2"></i> Min Profil
        </button>
        <button @click="openSettings" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mb-2 hover:scale-105 transition duration-300 ease-in-out">
          <router-link to="/settings">
            <i class="fa-solid fa-gear mr-2"></i> Innstillinger
          </router-link>
        </button>
        <button @click="handleSignOut" class="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 hover:scale-105 transition duration-300 ease-in-out">
          <i class="fa-solid fa-right-from-bracket mr-2"></i> Logg ut
        </button>
      </div>
    </Modal>

    </div>
    <div class="flex items-center">
      <router-link v-if="!isLoggedIn"
              :to="`/how-it-works`" 
              class="text-white hover:bg-lightblue focus:bg-lightblue py-1 px-4 ml-4 rounded transition" 
              >
        Hvordan fungerer det?
      </router-link>
      <router-link v-if="!isLoggedIn"
              :to="`/sign-in`" 
              class="text-white hover:bg-lightblue focus:bg-lightblue py-1 px-4 ml-4 rounded transition" 
              >
        Logg inn
      </router-link>
    </div>
  </header>
</template>

<script>
import { computed, nextTick, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { getAuth, signOut, onAuthStateChanged  } from "firebase/auth";
import router from '../router';
import axios from 'axios';
import { useRouter } from 'vue-router';

import { navigateToProfile } from '../utils/';
import HeaderItem from './HeaderItem.vue';
import Modal from './Modal.vue';
import UserNotifications from './UserNotifications.vue';

export default {
  props: ['isLoggedIn', 'auth', 'siteSettings'],
  components: {
    HeaderItem,
    Modal,
    UserNotifications,
},
  setup(props) {
    let ignoreNextOutsideClick = false;
    const defaultPhotoUrl = '/images/blank_profile.jpg';
    const auth = getAuth();
    const searchQuery = ref('');
    const searchResults = ref([]);
    const searchField = ref(null);
    const showSearchField = ref(false);
    const store = useStore();
    const vueRouter = useRouter();
    const inputFocused = ref(false);
    const windowWidth = ref(window.innerWidth);

    const modalIsActive = computed({
        get: () => store.getters['utils/modalIsActive'],
        set: (value) => {
          if(value) store.dispatch('utils/openModal');
          else store.dispatch('utils/closeModal');
        }
      });

    const toggleModal = () => {
      store.dispatch('utils/toggleModal');
    };

    const openModal = () => {
      store.dispatch('utils/openModal');
    };

    const closeModal = () => {
      store.dispatch('utils/closeModal');
    };

    const handleSignOut = () => {
      signOut(getAuth()).then(() => {
        router.push('/');
      });
    };

    const photoUrl = ref(auth.currentUser?.photoURL || defaultPhotoUrl);
    const userID = ref(auth.currentUser?.uid);
    
    const toggleSearchField = () => {
      showSearchField.value = !showSearchField.value;
      if (showSearchField.value) {
        ignoreNextOutsideClick = true;
        nextTick(() => {
          searchField.value.focus();
        });
      }
    };

    const closeSearch = () => {
      if (showSearchField.value) {
        showSearchField.value = false;
        searchResults.value = [];
        searchQuery.value = '';
      }
    };

    const onEscapePress = (event) => {
      if (event.key === 'Escape') {
        closeSearch();
      }

    };
    const onClickOutside = (event) => {
      if (ignoreNextOutsideClick) {
        ignoreNextOutsideClick = false;
        return;
      }
      
      if (searchField.value && !searchField.value.contains(event.target)) {
        closeSearch();
      }
    };
    async function searchUsers(query) {
      query = query.toLowerCase().replace(/\b\w/g, match => match.toUpperCase());
      try {
        const response = await axios.post(`/.netlify/functions/fetchUsers`, {
          query:query
        });
        searchResults.value = response.data.results;
        } catch (error) {
          console.error("Failed to search users:", error);
          searchResults.value = [];
        }
      }

    
    const navigate = (userId) => {
      closeSearch(); 
      navigateToProfile(vueRouter, userId); 
    };
    

    watch(searchQuery, (newValue, oldValue) => {
      if (newValue.trim() !== '') {
        searchUsers(newValue);
      } else {
        searchResults.value = [];
      }
    });
    onMounted(() => {
      document.addEventListener('keydown', onEscapePress);
      document.addEventListener('click', onClickOutside);
      
      onAuthStateChanged(auth, (user) => {
      if (user) {
        userID.value = user.uid;
        photoUrl.value = user.photoURL || defaultPhotoUrl;

       } else {
        userID.value = user.uid;
        photoUrl.value = defaultPhotoUrl;
          }
        });
      });
      const handleResize = () => {
        windowWidth.value = window.innerWidth;
      };
  
  window.addEventListener('resize', handleResize);

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onEscapePress);
      document.removeEventListener('click', onClickOutside);
      window.removeEventListener('resize', handleResize);
    });
    
    
    return {
      handleSignOut,
      toggleSearchField,
      showSearchField,
      searchField, 
      searchQuery,
      searchResults,
      navigate,
      photoUrl,
      modalIsActive,
      toggleModal,
      openModal,
      closeModal,
      userID,
      inputFocused,
      windowWidth
    };
  },
};

</script>
<style>

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

</style>
