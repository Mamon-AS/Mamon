<template>
    <main class="home-page">
        <FullHero />
        <ReviewCardView />
      </div>
      <div v-else>
        <GetStarted />
        <div class="flex flex-col lg:flex-row lg:justify-center lg:space-x-4 lg:space-y-0 space-y-4 max-w-screen-lg mx-auto">
          <div class="flex-1 lg:max-w-md">
            <ContactUs />
          </div>
          <div class="flex-1 max-w-md">
            <Team />
          </div>
        </div>
      </div>
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