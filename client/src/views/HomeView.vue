<template>
    <main class="home-page">
        <FullHero />
        <ReviewCardView />
        <footer class="text-center">
            <p>© {{ new Date().getFullYear() }} Mamon. All rights reserved.</p>
        </footer>
    </main>
</template>

<script>
import FullHero from '../components/FullHero.vue';
import ReviewCardView from '../views/ReviewCardView.vue';
export default {
  components: {
    FullHero,
    ReviewCardView
  }
}

</script>
<style>

body {
    margin: 0;
}
section {
    align-items: center;
    min-height: 200px;
    padding: 50px 20vw;
}

</style>