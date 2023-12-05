<template>
    <main class="home-page">
        <FullHero />
        <footer class="text-center">
            <p>© {{ new Date().getFullYear() }} Mamon. All rights reserved.</p>
        </footer>
    </main>
</template>

<script>
import FullHero from '../components/FullHero.vue';
export default {
  components: {
    FullHero
  }
}

</script>
<style>

body {
    margin: 0;
}
section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 400px;
    padding: 100px 20vw;
}

</style>