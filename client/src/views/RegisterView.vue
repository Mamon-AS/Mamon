<template>
    <div class="register-form max-w-md mx-auto">
      <h1 class="text-3xl font-bold mb-6">Lag en bruker</h1>
      <form>
        <div class="mb-4">
          <label for="email" class="block font-medium mb-2">E-post</label>
          <input type="text" id="email" placeholder="Skriv inn din e-postadresse" v-model="email"
                 class="w-full px-4 py-2 rounded text-black border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
  
        <div class="mb-6">
          <label for="password" class="block font-medium mb-2">Passord</label>
          <input type="password" id="password" placeholder="Skriv inn ditt passord" v-model="password"
                 class="w-full px-4 py-2 rounded text-black border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
  
        <button class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" @click.prevent="register">Registrer</button>
        <button class="w-full mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600" @click.prevent="signInWithGoogle">Logg inn med Google</button>
        <button class="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" @click.prevent="signInWithFacebook">Logg inn med Facebook</button>

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
  console.log("hei");
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