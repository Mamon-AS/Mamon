<template>
    <div class="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row">
        <div class="flex-1 flex flex-col">
            <h3 class="text-lg md:text-2xl font-bold mb-4"> {{ company.title }}</h3>
            <p class="text-gray-500 md:text-lg mb-4 flex-1"></p>
        

        </div>
        <!-- <img src="" alt=""> </img>      -->
    </div>
</template>
<script>
export default {
    props: {
        company: {
            type:Object,
            required: true
        }
    }
}
</script>