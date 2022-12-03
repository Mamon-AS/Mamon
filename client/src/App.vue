<template>
  <AppHeader />
    <div class="nav-wrapper">
      <nav>
        <!-- Routerlinks in nav should get content from Sanity -->
        <RouterLink to="/">Hjem</RouterLink>
      </nav>
    </div>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>
<style src="./assets/main.css"></style>

