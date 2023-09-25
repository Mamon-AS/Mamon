<template>
    <router-link :to="to" class="flex items-center p-4 border-r-4 border-transparent text-gray-100
    hover:text-white hover:bg-sky-500">
        <slot />

    </router-link>
</template>

<script>
export default {
    props: ["to"]
}
</script>