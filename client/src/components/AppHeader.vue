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
     
      <div class="flex items-center">
        <!-- <img src="../images/Mamon-logos_white.png" alt="Logo" class="h-8 w-auto"> -->
        <h1 class="text-white text-xl font-semibold ml-10">Mamon</h1>
      </div>

  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
      const store = useStore()

      const ToggleMenu = () => store.dispatch('ToggleMenu')
      
      
      return {
        menu_is_active: computed(() => store.state.menu_is_active),
        ToggleMenu
      }
  }
}
</script>

<style scoped>
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