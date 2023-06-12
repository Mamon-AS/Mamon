<template>
    <div class="div darkblue rounded-lg p4 text-center">
        <div v-if="author">
        
        <img 
        :src="CreateURL(author.avatar, 300, 300)" 
        class="inline-block rounded-full w-32 h-32 mx-auto mb-4" />

        <h3 class="text-3xl font-bold mb-4">
            {{ author.full_name  }}
        </h3>
        <p class="text-white mb-4">{{ author.short_bio }}</p>

        <router-link :to="`/author/${ author._id }`" class="btn mb-4">Profil</router-link>
        </div>
    </div>
</template>
<script>
import { CreateURL } from '../utils'
export default {
    props: {
        author: {
            type: Object,
            required: true
        }
    },
    setup () {
        return {
            CreateURL
        }
    }
}
</script>
<style>
.darkblue {
    background-color: #096191
}
</style>