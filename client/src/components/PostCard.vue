<template>
    <div class="darkblue rounded-lg p-4 flex flex-col sm:flex-row mb-4">
        <img v-if="marketing.image" :src="CreateURL(marketing.image, 480, 320)" class="block w-full sm:max-w-xs mr-4 
        object-cover mb-4 sm:mb-0" /> 
        <div class="flex-1 flex flex-col">
            <h3 class="text-lg md:text-2xl font-bold mb-4"> {{ marketing.title }}</h3>
            <p class="text-white md:text-lg mb-4 flex-1">
                {{ marketing.excerpt }}
            </p>
            <div class="flex sm:flex-col md:flex-row justify-between items-start md:items-end">
                <div class="flex items-center sm:mb-4 md:mb-0">
                    <img v-if="marketing.author.avatar" :src="CreateURL(marketing.author.avatar)" class="rounded-full mr-4 w-12 h-12" />
                    <div>
                        <p class="text-white mr-4">{{ marketing.author.full_name }}</p>
                        <p class="text-white text-sm">
                        {{ FormatDate(marketing._createdAt) }}
                    </p>
                    </div>
                </div>
            <router-link :to="`/post/${ marketing._id }`" class="btn">Les mer</router-link>
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