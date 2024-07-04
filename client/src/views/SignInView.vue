<template>
  <div class="register-form max-w-md mx-auto mt-10">
    <h1 class="text-3xl font-bold mb-6 text-center">Logg inn</h1>
    <form>
      <div class="mb-4">
        <label for="email" class="block font-medium mb-2 text-center">E-post</label>
        <input type="text" id="email" placeholder="Skriv inn din e-postadresse" v-model="email"
               class="w-full px-4 py-2 rounded text-black text-center border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block font-medium mb-2 text-center">Passord</label>
        <input type="password" id="password" placeholder="Skriv inn ditt passord" v-model="password"
               class="w-full px-4 py-2 rounded text-black text-center border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div class="flex justify-center mb-3">
        <button type="button"  class="w-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click.prevent="register">Logg inn</button>
      </div>
      <p v-if="errorMessage" class="bg-red-500 text-white p-2">{{ errorMessage }}</p>
      <p class="text-center text-gray-400"> Ikke medlem?</p>
      <p class="text-center text-gray-400"> Meld deg på og lag en bruker nedenfor</p>

      <div class="flex flex-col gap-2 mt-3">
          <div class="dark:bg-gray-800">
            <button class="w-full flex flex-col items-center justify-center px-4 py-2 border gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" @click.prevent="signInWithGoogle">
                <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
                <span class="text-center">Logg inn med Google</span>
            </button>
          </div>
          <div class="dark:bg-gray-800">
            <button class="w-full flex flex-col items-center justify-center px-4 py-2 border gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150" @click.prevent="signInWithFacebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
              <span class="text-center">Logg inn med Facebook</span>
            </button>
          </div>
          <div class="dark:bg-gray-800">
            <router-link to="/register" class="w-full flex flex-col items-center justify-center px-4 py-2 border gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
              <img class="w-6 h-6" src="/images/High_Resolution_Image_2.jpg" loading="lazy" alt="signup logo">
              <span class="text-center">Registrer en Mamon-bruker</span>
            </router-link>
          </div>

      </div>


    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const email = ref('');
const password = ref('');
const router = useRouter();
const errorMessage = ref() 
const db = getFirestore();

const updateUserInFirestore = async (user) => {
const userRef = doc(db, "users", user.uid); 
  const userProfile = {
    displayName: user.displayName,
    email: user.email,
    isPrivate: false,
  }; 

await setDoc(userRef, userProfile, { merge: true });
};
const register = () => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
  .then((data) => {
      console.log("signed in");
      updateUserInFirestore(data.user); 
      console.log(auth.currentUser);
      router.push('/');
  })
  .catch((error) => {
      console.log(error);
      switch (error.code) {
          case "auth/invalid-email":
              errorMessage.value = "Ugyldig e-postadresse ";
              break;
          case "auth/user-disabled":
              errorMessage.value = "Brukeren er deaktivert";
              break;
          case "auth/user-not-found":
              errorMessage.value = "Brukeren finnes ikke";
              break;
          case "auth/wrong-password":
              errorMessage.value = "Feil passord";
              break;
          default:
              errorMessage.value = "Ring Martin";
              break;
      }
  });
};

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result);
      updateUserInFirestore(result.user);
      router.push('/');
    })
    .catch((error) => {
      alert(error.message);
    });
  };

const signInWithFacebook = () => {
  const provider = new FacebookAuthProvider();
    signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result);
      updateUserInFirestore(result.user); 
      router.push('/');
    })
    .catch((error) => {
      alert(error.message);
    });
    };

</script>