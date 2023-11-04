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

.waves {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
}

.waves svg {
    position: relative;
    display: block;
    width: calc(106% + 1.3px);
    height: 148px;
}

.waves .shape-fill {
    fill: #fde68a;
}

.spacer {
    aspect-ratio: 960/300;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}
</style>