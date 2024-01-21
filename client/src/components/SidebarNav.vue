<template>
    <aside
        :class="`fixed top-0 left-0 min-h-screen pt-16 z-40 w-full max-w-xs transform duration-300 bg-lightblue ${
            menu_is_active
            ? 'translate-x-0'
            : '-translate-x-full'
        }`">
        <div class="p-4">
            <!-- Ikoner og div fra https://fonts.google.com/icons eller https://materializecss.com/icons.html -->
            <div class="mx-4">
                <MenuItem to="/">
                <span class="material-icons mr-2">home</span>
                    Hjem
                </MenuItem>
                <!-- <MenuItem to="/card">
                    <span class="material-icons mr-2 ">domain</span>
                    Tilbud
                </MenuItem>
                <MenuItem to="/authors">
                    <span class="material-icons mr-2 ">people</span>
                    Bedrifter
                </MenuItem> -->
                <MenuItem v-if="isLoggedIn" to="/review">
                    <span class="material-icons mr-2 ">child_care</span>
                    Anmeldelser
                </MenuItem> 
                <MenuItem to="/privacy">
                    <span class="material-icons mr-2 ">lock</span>
                    Personvern
                </MenuItem>
                <MenuItem v-if="isLoggedIn" to="/user">
                    <span class="material-icons mr-2">face</span>
                    Min bruker
                </MenuItem>
            </div>
            
        </div>

    </aside>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import MenuItem from './MenuItem.vue'

export default {
    props: ['isLoggedIn', 'auth'],
    components: {
        MenuItem
    },
  setup() {
      const store = useStore()
    
      return {
        menu_is_active: computed(() => store.state.menu_is_active),
        
      }
  }
}
</script>