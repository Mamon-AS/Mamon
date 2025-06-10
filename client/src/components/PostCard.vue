<template>
    <div class="bg-gradient-to-br from-primary-700 to-primary-800 rounded-xl p-6 flex flex-col sm:flex-row mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <img v-if="marketing.image" :src="CreateURL(marketing.image, 480, 320)" class="block w-full sm:max-w-xs mr-6 
        object-cover rounded-lg shadow-md mb-4 sm:mb-0" /> 
        <div class="flex-1 flex flex-col">
            <h3 class="text-xl md:text-2xl font-bold mb-4 text-white">{{ marketing.title }}</h3>
            <p class="text-white/90 md:text-lg mb-6 flex-1">
                {{ marketing.excerpt }}
            </p>
            <div class="flex sm:flex-col md:flex-row justify-between items-start md:items-end">
                <div class="flex items-center sm:mb-4 md:mb-0">
                    <img v-if="marketing.author.avatar" :src="CreateURL(marketing.author.avatar)" class="rounded-full mr-4 w-12 h-12 border-2 border-white/20" />
                    <div>
                        <p class="text-white font-medium mr-4">{{ marketing.author.full_name }}</p>
                        <p class="text-white/70 text-sm">
                            {{ FormatDate(marketing._createdAt) }}
                        </p>
                    </div>
                </div>
                <router-link :to="`/post/${ marketing._id }`" class="btn bg-white text-primary-700 hover:bg-white/90">Les mer</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import {FormatDate, CreateURL} from '../utils'

export default {
    props: {
        marketing: {
            type:Object,
            required: true
        }

    },
    setup () {
        return {
            FormatDate,
            CreateURL
        }
    }
}
</script>
<style>
.darkblue {
    background-color: #096191
}
.white {
    background-color: #f8f8f8
}
</style>