<template>
    <div class="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row">
        <div class="flex-1 flex flex-col">
            <h3 class="text-lg md:text-2xl font-bold mb-4"> {{ marketing.title }}</h3>
            <p class="text-gray-500 md:text-lg mb-4 flex-1">
                {{ marketing.excerpt }}
            </p>
            <div class="flex sm:flex-col md:flex-row justify-between items-start md:items-end">
                <div class="flex items-center sm:mb-4 md:mb-0">
                    <img v-if="marketing.image" src="" alt="avatar" class="rounded-full mr-4 w-12 h-12" /> 
                </div>

            </div>

        </div>
        <!--       -->
    </div>
</template>
<script>
export default {
    props: {
        marketing: {
            type:Object,
            required: true
        }
    }
}
</script>