<template>
  <header class="flex w-full items-center justify-between p-4">
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

     
      <div class="flex items-center ml-auto">
        <h1 class="text-white text-xl font-semibold ml-10">Mamon</h1>
        <a href="/"> 
          <img src="../images/High_Resolution_Image_11.jpg" alt="Logo" class="h-8 w-auto logo">
        </a>
      </div>
      <button @click="handleSignOut" v-if="isLoggedIn"> Logg av</button>
      <!-- v-if="loggedIn" -->
      <!-- <div class="flex items-center ml-auto">
      <div class="flex items-center ml-4">
        <h2 class="text-white text-xl font-semibold">{{ user.name }}</h2>
        <img :src="user.picture" :alt="user.name" class="h-10 w-10 rounded-full ml-2" />
      </div>
      <button @click="logout" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded">
        Logout
      </button>
    </div> -->
      <!-- v-else -->
      <div v-if="!isLoggedIn">
          <router-link 
            :to="`/register`" 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded" 
            >Ny her?
          </router-link>
          <span class="material-icons mr-2">account_circle</span>
          <router-link 
            :to="`/sign-in`" 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded" 
            >Logg inn?
          </router-link>
          <span class="material-icons mr-2">account_circle</span>
      </div>
      
  </header>
  
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from '../router';

const isLoggedIn = ref(false);
let auth;

export default {
  
  setup() {
    const store = useStore();

    const ToggleMenu = () => store.dispatch('ToggleMenu');

    const handleSignOut = () => {

      signOut(auth).then(() => {
        router.push('/');
      });
    };

    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        isLoggedIn.value = !!user;
      });
    });

    return {
      menu_is_active: computed(() => store.state.menu_is_active),
      ToggleMenu,
      isLoggedIn,
      handleSignOut
    };
  },
};



</script>
<style scoped>
 
.logo {
  margin-left: auto;
}
.menu-toggle {
	position: absolute;
	top: 1rem;
	left: 1rem;
	width: 32px;
	height: 32px;
	cursor: pointer;
}

.menu-toggle .hamburger {
	position: absolute;
	top: 50%;
	left: 50%;
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