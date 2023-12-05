<template>
    <section v-if="settings && settings.fullHero" class="flex justify-center xl:grid">
        <div v-if="settings.heroTitle" class="flex-col w-full mx-auto">
            
            <div class="mb-4">
                <h1 class="font-extrabold text-2xl lg:text-4xl">
                    {{ settings.heroTitle }}
                </h1>
            </div>

            <div>
                <p class="text-xl md:text-1xl xl:min-w-[500px]">
                    {{ settings.heroText }}
                </p>
            </div>

            <a v-if="settings.heroButtonBool" :href="`${settings.heroButtonLink}`" class="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                {{ settings.heroButtonText }}
            </a>

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