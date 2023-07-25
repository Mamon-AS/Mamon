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

     
      <div v-if="!loggedIn" class="flex items-center ml-auto">
        <h1 class="text-white text-xl font-semibold ml-10">Mamon</h1>
        <a href="/"> 
          <img src="../images/High_Resolution_Image_11.jpg" alt="Logo" class="h-8 w-auto logo">
        </a>
      </div>
      
      <div v-if="loggedIn" class="flex items-center ml-auto">
      <div class="flex items-center ml-4">
        <h2 class="text-white text-xl font-semibold">{{ user.name }}</h2>
        <img :src="user.picture" :alt="user.name" class="h-10 w-10 rounded-full ml-2" />
      </div>
      <button @click="logout" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded">
        Logout
      </button>
    </div>

      <div v-else>
        <button id="loginButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded">
          Ny her?
          <span class="material-icons mr-2">account_circle</span>
        </button>
      </div>
  </header>
  
<div class="modal" id="loginModal">
  <div class="modal-content">
    <!--  prompt auto-login -->
    <GoogleLogin :callback="callback" prompt auto-login/>
  </div>
</div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { decodeCredential, googleLogout } from 'vue3-google-login'

export default {
  data() {
    return {
      loggedIn: false,
      user:null,

      callback:(response) => {
          console.log("logged in");
          this.loggedIn = true;
          this.user = decodeCredential(response.credential);

          const loginModal = document.getElementById('loginModal');
          loginModal.style.display = 'none';
      }
    }
  },
  methods: {
    logout() {
      googleLogout();
      this.loggedIn = false;
    }
  },
  setup() {
      const store = useStore()

      const ToggleMenu = () => store.dispatch('ToggleMenu')
      
      return {
        menu_is_active: computed(() => store.state.menu_is_active),
        ToggleMenu
      }
  },
  mounted() {
    // JavaScript to show/hide the modal
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');

    loginButton.addEventListener('click', () => {
      loginModal.style.display = 'block';
    });

    // Close the modal when the user clicks anywhere outside of it
    window.addEventListener('click', (event) => {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    });
  },
};
</script>
<style scoped>
 
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

 
  .modal-content {
    background-color: #f4f4f4;
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 300px;
    border-radius: 5px;
  }

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