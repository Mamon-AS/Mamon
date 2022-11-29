<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="nav-wrapper">
      <nav>
        <!-- Routerlinks in nav should get content from Sanity -->
        <RouterLink to="/">Hjem</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <footer>
    <!-- Create footer here -->
  </footer>
</template>

<style scoped>

</style>
