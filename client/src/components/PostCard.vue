<template>
    <div class="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row">
        <img v-if="marketing.image" :src="CreateURL(marketing.image, 480, 320)" class="block w-full sm:max-w-xs mr-4 
        object-cover mb-4 sm:mb-0" /> 
        <div class="flex-1 flex flex-col">
            <h3 class="text-lg md:text-2xl font-bold mb-4"> {{ marketing.title }}</h3>
            <p class="text-gray-500 md:text-lg mb-4 flex-1">
                {{ marketing.excerpt }}
            </p>
            <div class="flex sm:flex-col md:flex-row justify-between items-start md:items-end">
                <div class="flex items-center sm:mb-4 md:mb-0">
                    <p class="text-gray-500 text-sm">
                        {{ FormatDate(marketing._createdAt) }}
                    </p>
                </div>
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