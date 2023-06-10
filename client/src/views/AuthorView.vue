<template>
    <main class="authors page">
        <section class="container mx-auto p-4">
            <h1 class="text-2xl mb8">Bedrifter</h1>
            <div class="grid md:grid-cols-3 gap-4">
                <AuthorCard v-for="(author, i) in authors" :key="i" :author="author" />

            </div>
        </section>
    </main>
</template>

<script>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex'
import AuthorCard from '../components/AuthorCard.vue'

export default {
    components: {
        AuthorCard
    },
    setup () {
        const store = useStore()

        const authors = computed(() => store.getters.authors)

        onMounted(() => {
            store.dispatch("FetchAuthors")
        })

        return {
            authors
        }
    }
}
</script>