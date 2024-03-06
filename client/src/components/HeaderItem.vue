<template>
    <router-link :to="to" class="flex items-center p-4 border-transparent text-white hover:bg-lightblue hover:rounded-xl">
        <slot />


    </router-link>
</template>

<script>
export default {
    props: ["to"]
}
</script>