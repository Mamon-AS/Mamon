<template>
    <aside
        :class="`fixed top-0 left-0 min-h-screen pt-16 z-40 w-full max-w-xs transform duration-300 bg-orange-200 ${
            menu_is_active
            ? 'translate-x-0'
            : '-translate-x-full'
        }`">
        <div class="p-4">
            <h2 class="text-gray-100 text-lg font-bold uppercase mb-2">
                Meny
            </h2>
            <!-- Ikoner og div fra https://fonts.google.com/icons -->
            <div class="mx-4">
                <MenuItem to="/">
                <span class="material-icons mr-2">home</span>
                    Hjem
                </MenuItem>
                <MenuItem to="/card">
                    <span class="material-icons mr-2 ">domain</span>
                    Annonser
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