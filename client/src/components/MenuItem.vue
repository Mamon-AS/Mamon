<template>
    <router-link :to="to" class="flex items-center p-4 border-r-4 border-transparent text-white
    hover:text-mamonblue transition">
        <slot />

    </router-link>
</template>

<script>
export default {
    props: ["to"]
}
</script>