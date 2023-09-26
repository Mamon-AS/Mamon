<template>
    <main class="home-page">
        <FullHero />
        
        <!-- <section class="bg-lightblue">
            <h1 class="text-lg md:text-2xl font-bold mb-4">Om Mamon</h1>
            <p>Vi prøvde å fortelle om andres opplevelse, og fortelle om det gjennom annonser og innlegg i sosiale medier uten å få resultatet vi ønsket oss. Annonsene viste mange som så innleggene våre, og klikket inn på nettsiden vår uten å bestille noe. De fleste av oss prøver ikke noe nytt med mindre noen av de rundt oss gjør det, eller anbefaler oss å gjøre det.</p>
            <div class="waves">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" class="shape-fill"></path>
                </svg>
            </div>
        </section>
        <section class="bg-yellow">
            <h1>nice curves</h1>
            <p>Labore, et. Esse cupiditate dolore dicta quod quo! Tenetur hic voluptatem beatae itaque repellat, omnis minima nulla unde officia eaque ad quod illo distinctio explicabo numquam assumenda incidunt totam sit!</p>
        </section>

        <section class="bg-lime">
            <h1>nice curves</h1>
            <p>Voluptates, provident. Quasi nam minus doloremque! Minus tenetur ipsa ex quas deleniti necessitatibus, minima facilis vero corporis! Doloribus, doloremque nesciunt cupiditate, corporis ut quae eligendi aperiam quis veniam rem explicabo.</p>
            
        </section> -->
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