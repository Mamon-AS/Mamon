<template>
    <main class="author-page">
        <section v-if="author" class="container mx-auto p-4">
            <div class="flex items-center mb-4">
				<img 
					:src="CreateURL(author.avatar)" 
					class="inline-block rounded-full w-16 h-16 mr-4"  />

				<h1 class="text-white text-2xl uppercase font-bold">
					{{ author.full_name }}
				</h1>
			</div>
            <p class="text-white mb-8">{{ author.short_bio }}</p>

            <div class="grid gap-4" v-if="author.marketing">
                <PostCard v-for="(marketing, i) in author.marketing" :key="i" :marketing="marketing" />
			</div>
        </section>
        <section v-else>
            <p class="text-white italic text-2xl">
                Loading...
            </p>
        </section>
    </main>
</template>
<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import sanity from '../../client';
import { CreateURL } from '../../utils';

import  PostCard  from '../../components/PostCard.vue';


export default {
    components: {
        PostCard
  },
    setup() {
        const route = useRoute()
        const id = ref(route.params.id)
        const author = ref(null)

        onMounted(() => {
			const query = '*[_type == "author" && _id == $id][0] { ..., "marketing": *[_type == "marketing" && author->_id == $id] {_id, title, excerpt, image, _createdAt, author->{full_name, avatar}}}'
			const params = { id: id.value }
			sanity.fetch(query, params).then(data => {
                console.log(data)
				author.value = data
			})
		})

        return {
            author,
            CreateURL
     }
    }
}
</script>