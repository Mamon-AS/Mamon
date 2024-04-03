<template>
    <div class="register-form max-w-md mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-center">Lag en bruker</h1>
      <form>
        <div class="mb-4">
          <label for="email" class="block font-medium mb-2 text-center">E-post</label>
          <input type="text" id="email" placeholder="Skriv inn din e-postadresse" v-model="email"
                 class="w-full px-4 py-2 rounded text-black border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
  
        <div class="mb-6">
          <label for="password" class="block font-medium mb-2 text-center">Passord</label>
          <input type="password" id="password" placeholder="Skriv inn ditt passord" v-model="password"
                 class="w-full px-4 py-2 rounded text-black border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
  
        <button class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" @click.prevent="register">Registrer</button>
        <p class="text-center mt-4 text-sm text-gray-500">Eventuelt logg inn med Google eller Facebook brukeren din nedenfor 👇</p>
        <div class="flex mt-3">
          <div class=" dark:bg-gray-800">
            <button class="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400
            dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" @click.prevent="signInWithGoogle">
                <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
                <span>Logg inn med Google</span>
            </button>
          </div>
          <div class=" dark:bg-gray-800">
            <button class="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400
            dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" @click.prevent="signInWithFacebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
            </svg>
              <span>Logg inn med Facebook</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </template>
<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

const email = ref('');
const password = ref('');
const router = useRouter();

const register = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
        console.log("User created!!!");
        console.log(auth.currentUser);
        router.push('/');
    })
    .catch((error) => {
        console.log(error);
        alert(error.message);
    });
};

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
  .then((result) => {
    console.log(result);
    router.push('/');
  })
  .catch((error) => {
    alert(error.message);
  });
};

const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  signInWithPopup(getAuth(), provider)
  .then((result) => {
    console.log(result);
    router.push('/');
  })
  .catch((error) => {
    alert(error.message);
    console.log(error.message);
  });

}

</script>