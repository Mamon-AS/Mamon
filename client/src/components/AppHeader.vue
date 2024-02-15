<template>
  <header 
    :class="[
      'flex w-full items-center justify-between p-4 z-50 relative transition-all duration-300', 
      { 'bg-mamonblue': !full_hero_is_active && !showSearchField },
      { 'bg-blue-500': showSearchField, 'h-20 md:h-32': showSearchField },
      { 'bg-transparent': menu_is_active && !showSearchField}
    ]"
    :style="showSearchField ? { position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 } : {}"
  >
    <div class="flex items-center">
      <div
        :class="`menu-toggle relative z-50 ${
          menu_is_active 
          ? 'is-active' 
          : ''
        }`"
        @click="ToggleMenu">

        <div class="hamburger">
          <span></span>
        </div>
      </div>
      
      <a href="/" class="ml-5">
        <img
          :src="full_hero_is_active
            ? '/images/High_Resolution_Image_4_cropped.png'
            : '/images/Transparent_Image_11_cropped.png'"
          alt="Logo"
          class="h-8 w-auto logo"
        />
      </a>

      <button ref="toggleButton" @click="toggleSearchField" class="ml-5 p-2 rounded-full text-white" :class="{'bg-blue-500': !showSearchField, 'bg-transparent': showSearchField}">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>

    
      <input
        v-model="searchQuery"
        v-show="showSearchField"
        ref="searchField"
        type="search"
        placeholder="Søk..."
        class="absolute top-full left-0 mt-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 
        focus:border-lightblue bg-white transition-all duration-300"
        style="z-index: 101;"
      />
    </div>
    <div v-show="searchResults.length > 0" class="absolute top-full left-0 mt-12 w-full bg-white shadow-lg z-50">
      <ul>
        <li v-for="user in searchResults" :key="user.userId" class="p-2 hover:bg-gray-100">
          <span style="text-decoration:underline; cursor:pointer;" @click="navigateToProfile(user.userId)">
            {{ user.displayName }}
            👉 
          {{ user.bio }}
        </span>
        </li>
      </ul>
    </div>
      <div>
        <!-- <router-link v-if="!isLoggedIn"
          :to="`/register`" 
          class="bg-lightblue text-white border border-lightblue hover:bg-white hover:border-mamonblue hover:text-mamonblue py-1 px-4 ml-4 rounded transition"
          >Ny her?
        </router-link> -->
        <router-link v-if="!isLoggedIn"
          :to="`/sign-in`" 
          class="bg-lightblue text-white border border-lightblue hover:bg-white hover:border-mamonblue hover:text-mamonblue py-1 px-4 ml-4 rounded transition" 
          >Logg inn
        </router-link>
        <a @click="handleSignOut" v-if="isLoggedIn" class="bg-lightblue text-white hover:bg-red-500 py-1 px-4 ml-4 rounded transition"
          >Logg ut
        </a>
      </div>
      
  </header>
  
</template>

<script>
import { computed, nextTick, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { getAuth, signOut } from "firebase/auth";
import router from '../router';
import axios from 'axios';


export default {
  props: ['isLoggedIn', 'auth', 'siteSettings'],
  setup(props) {
    let ignoreNextOutsideClick = false;
    const searchQuery = ref('');
    const searchResults = ref([]);
    const searchField = ref(null);
    const showSearchField = ref(false);
    const store = useStore();

    const ToggleMenu = () => store.dispatch('ToggleMenu');

    const handleSignOut = () => {
      signOut(getAuth()).then(() => {
        router.push('/');
      });
    };
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

    const navigateToProfile = async (userId) => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const currentUserId = currentUser ? currentUser.uid : null;

      if (userId === currentUserId) {
        router.push({ name: 'user' });
      } else {
        router.push({ name: 'UserProfile', params: { userId } });
      }
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
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onEscapePress);
      document.removeEventListener('click', onClickOutside);
    });
    
    return {
      menu_is_active: computed(() => store.state.menu_is_active),
      ToggleMenu,
      handleSignOut,
      toggleSearchField,
      showSearchField,
      searchField, 
      searchQuery,
      searchResults,
      navigateToProfile
    };
  },
};

</script>
<style scoped>
 
.logo {
  margin-left: auto;
}
.menu-toggle {
	position: relative;
	top: 1rem;
	left: 1rem;
	width: 32px;
	height: 32px;
	cursor: pointer;
}

.menu-toggle .hamburger {
	position: relative;
	top: 15%;
	left: 20%;
	transform: translate(-50%, -50%);
	width: 32px;
	height: 32px;
}

.menu-toggle .hamburger span {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 100%;
	height: 4px;
	border-radius: 99px;
	background-color: white;
	transition: all 0.3s ease-in-out;
}

.menu-toggle .hamburger span::before,
.menu-toggle .hamburger span::after {
	content: '';
	position: absolute;
	width: 100%;
	height: 4px;
	border-radius: 99px;
	background-color: white;
	transition: all 0.3s ease-in-out;
}

.menu-toggle .hamburger span::after {
	top: -8px;
}

.menu-toggle .hamburger span::before {
	top: 8px;
}


.menu-toggle.is-active .hamburger > span {
  transform: rotate(45deg);
}
.menu-toggle.is-active .hamburger > span::before {
  top: 0;
  transform: rotate(0deg);
}
.menu-toggle.is-active .hamburger > span::after {
  top: 0;
  transform: rotate(90deg);
}
</style>