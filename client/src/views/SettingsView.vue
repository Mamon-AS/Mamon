<template>
    <div class="max-w-4xl mx-auto p-6 mt-7">
      <h1 class="text-2xl font-semibold mb-6 text-center">Innstillinger</h1>
  
      <div class="space-y-4">

        <div class="bg-white shadow-md rounded-lg p-4">
          <h2 class="text-xl font-medium mb-4">Kontoinnstillinger</h2>
          <div class="space-y-2">
            <div>
              <label class="text-gray-700">E-post</label>
              <p class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">{{ userEmail }}</p>
            </div>
          </div>
        </div>
  
        <div class="bg-white shadow-md rounded-lg p-4">
            <h2 class="text-xl font-medium mb-4">Personvern</h2>
            <div class="flex items-center justify-between">
            <span>Privat bruker</span>
            <input type="checkbox" class="toggle toggle-accent" v-model="isPrivateUser" @change="togglePrivacy">
            </div>
        </div>

        <div class="mt-4 p-4 bg-white shadow-md rounded-lg">
        <h2 class="text-xl font-medium mb-4">Danger Zone</h2>
        <button @click="confirmAndDeleteAccount" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Slett konto
        </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { getAuth, deleteUser } from "firebase/auth";
  import { useRouter } from 'vue-router';
  
  const store = useStore();
  const router = useRouter();
  const auth = getAuth();
  const userEmail = ref('');
  
  // Computed property for isPrivateUser, directly tied to Vuex state
  const isPrivateUser = computed({
    // Getter returns the Vuex state
    get: () => store.state.users.isPrivate,
    // Setter updates the Vuex state
    set: (newValue) => {
      const user = auth.currentUser;
      if (user) {
        store.dispatch('users/togglePrivacy', { userId: user.uid, isPrivate: newValue });
      }
    }
  });
  
  // Function to handle account deletion
  const confirmAndDeleteAccount = async () => {
    if (window.confirm("Er du helt sikker på at du vil slette kontoen din? Dette kan ikke angres!")) {
      const user = auth.currentUser;
      try {
        await deleteUser(user);
        alert("Din konto har blitt slettet.");
        router.push('/');
      } catch (error) {
        console.error("Error deleting user account:", error);
        alert("Noe gikk galt under sletting av kontoen din. Prøv igjen senere");
      }
    }
  };
  
  onMounted(async () => {
    if (auth.currentUser) {
      userEmail.value = auth.currentUser.email;

      await store.dispatch('users/fetchPrivacySetting', auth.currentUser.uid);
    }
  });
  </script>
  
  