<template>
  <div class="register-form max-w-md mx-auto">
    <h1 class="text-3xl font-bold mb-6">Logg inn</h1>
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
      <p v-if="errorMessage" class="bg-red-500 text-white p-2">{{ errorMessage }}</p>
      <button class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" @click.prevent="register">Logg inn</button>
      <button class="w-full mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600" @click.prevent="signInWithGoogle">Logg inn med Google</button>
      <button class="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" @click.prevent="signInWithFacebook">Logg inn med Facebook</button>
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