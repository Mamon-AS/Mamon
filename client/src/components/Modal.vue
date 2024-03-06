<template>
  <div v-if="isVisible" ref="dropdownRef" class="absolute bg-white mt-2 p-2 rounded-lg shadow-xl dropdown" @click.self="close">
    <span class=" cursor-pointer shadow-xs" @click="close"><i class="fa-regular fa-x"></i></span>
    <slot></slot>
  </div>
</template>



<script setup>
import { ref, watch, watchEffect, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue']);
const isVisible = ref(props.modelValue);

const dropdownRef = ref(null);
let ignoreFirstClick = isVisible.value

watch(isVisible, (newValue) => {
  if (newValue) {
    ignoreFirstClick = true;
  }
})

watchEffect(() => {
  isVisible.value = props.modelValue;
});

function close() {
  emit('update:modelValue', false);
}


function handleClickOutside(event) {
  if (ignoreFirstClick) {
    ignoreFirstClick = false;
    return;
  }
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    close();
  }
}
onMounted(() => {
  setTimeout(() => { 
    document.addEventListener('click', handleClickOutside);
  }, 0);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
 .dropdown{
  top: 5rem;
  right: 0.5em;
} 
</style>