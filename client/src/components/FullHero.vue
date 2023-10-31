<template>
    <p>sjekk</p>
     <section v-if="settings && settings.fullHero" class="full-hero h-screen w-screen relative" style="margin-top: -63px; padding: unset;">
        <img  v-if="settings.heroImage" :src="CreateURL(settings.heroImage, 1024, 1024)" alt="Hero image Mamon" loading="lazy" class="object-cover h-screen w-screen -z-10">
        <div v-if="settings.heroTitle" class="absolute h-screen w-screen justify-center bg-white-100 text-black rounded">
            <h1>{{ settings.heroTitle }}</h1>
            <p>{{ settings.heroText }}</p>
            <a v-if="settings.heroButtonBool" :href="`${settings.heroButtonLink}`">{{ settings.heroButtonText }}</a>
        </div>
    </section>
</template>

<script>
import sanity from "../client";
import { CreateURL } from '../utils';
import { ref, onMounted } from 'vue'

export default {
    setup() {
        const settings = ref(null)

        onMounted(() => {
			const query = `*[_type == 'siteSettings']`
			sanity.fetch(query).then(data => {
                console.log(data[0]);
                settings.value = data[0]
			})
		})

        return {
            settings,
            CreateURL
        }
    }
}

</script>