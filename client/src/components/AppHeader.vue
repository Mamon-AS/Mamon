<template>
  <header :class="`flex w-full items-center justify-between p-4 z-5 ${
    full_hero_is_active
    ? ''
    : 'bg-mamonblue'}`">
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

     
      <div class="flex items-center ml-[3rem]">
        <a href="/"> 
          <img :src="`${
            full_hero_is_active
            ? '../src/images/High_Resolution_Image_4_cropped.png'
            : '../src/images/Transparent_Image_11_cropped.png'
            }`"
            alt="Logo" class="h-8 w-auto logo">
        </a>
      </div>
      <a @click="handleSignOut" v-if="isLoggedIn" class="bg-lightblue text-white hover:bg-red-500 py-1 px-4 ml-4 rounded transition"
        >Logg ut
      </a>
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
            class="bg-lightblue text-white border border-lightblue hover:bg-white hover:border-mamonblue hover:text-mamonblue py-1 px-4 ml-4 rounded transition"
            >Ny her?
          </router-link>
          <router-link 
            :to="`/sign-in`" 
            class="bg-lightblue text-white border border-lightblue hover:bg-white hover:border-mamonblue hover:text-mamonblue py-1 px-4 ml-4 rounded transition" 
            >Logg inn
          </router-link>
      </div>
      
  </header>
  
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from '../router';
import sanity from '../client';

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

    const settings = ref(null);

    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        isLoggedIn.value = !!user;
      });

      const query = `*[_type == 'siteSettings']`
			sanity.fetch(query).then(data => {
                console.log(data);
                settings.value = data;
			})
    });

    return {
      menu_is_active: computed(() => store.state.menu_is_active),
      full_hero_is_active: computed(() => settings.fullHero),
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
	top: 60%;
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