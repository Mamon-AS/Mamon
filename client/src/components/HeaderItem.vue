<template>
    <router-link :to="to" class="flex items-center border-transparent text-white hover:bg-lightblue focus:bg-lightblue rounded">
        <slot />


    </router-link>
</template>

<script>
export default {
    props: ["to"]
}
</script>