<template>
  <div class="lg:w-1/2 p-8 mx-4 lg:mx-auto border rounded-lg shadow-lg space-y-4">
    <h1 class="text-center text-2xl font-bold">Kontakt oss</h1>
    <p class="text-center text-gray-500">Har du spørsmål eller tilbakemeldinger? Send oss en melding eller mail på <a href="mailto:hei@mamon.no" class="hover:underline">hei@mamon.no</a></p>
    <form @submit.prevent="submitForm" class="space-y-4 text-left">
      <div>
        <label for="name" class="text-sm font-medium text-gray-700">Navn</label>
        <input type="name" id="name" v-model="name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">E-post</label>
        <input type="email" id="email" v-model="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
      </div>
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700">Telefon (valgfritt)</label>
        <input type="phone" id="phone" v-model="phone" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
      </div>
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700">Melding</label>
        <textarea id="message" v-model="message" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
      </div>
      <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Send</button>
      <!-- Notification Area -->
      <div v-if="showSuccessMessage" class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
        <span class="font-medium">Takk!</span> Din melding ble sendt.
      </div>
      <div v-if="showErrorMessage" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
        <span class="font-medium">Error!</span> Klarte ikke å sende din melding, prøv igjen senere.
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const name = ref('');
const email = ref('');
const message = ref('');
const phone = ref('');

const showSuccessMessage = ref(false);
const showErrorMessage = ref(false);

async function submitForm() {
  const contactDetails = {
    name: name.value,
    email: email.value,
    message: message.value,
    phone: phone.value,
  };
  axios.post('/.netlify/functions/sendEmail', contactDetails)
    .then(() => {
      showSuccessMessage.value = true;
      name.value = '';
      email.value = '';
      message.value = '';
      phone.value = '';
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 3000);
    })
    .catch(error => {
      console.error('Error:', error);
      showErrorMessage.value = true;
    });
}
</script>
