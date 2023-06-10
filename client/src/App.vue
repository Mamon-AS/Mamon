<template>
  <div class="lightblue min-h-screen text-white">
    <AppHeader />
    <SidebarNav />
    <router-view/>
  </div>



</template>

<script>
import AppHeader from './components/AppHeader.vue'
import SidebarNav from './components/SidebarNav.vue';
export default {
  components: {
    AppHeader,
    SidebarNav
  }
}

</script>
<style>
.lightblue {
    background-color: #289DD2
}
.btn {
	@apply bg-green-600 duration-300 font-bold py-2 px-4 rounded-lg inline-block;
}
.btn:hover {
	@apply bg-green-700;
}
</style>

