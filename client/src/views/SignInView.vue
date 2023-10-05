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
        <button class="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" @click.prevent="signInWithFacebookSDK">Logg inn med Facebook</button>
      </form>
    </div>
  </template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { useStore } from 'vuex'


const email = ref('');
const password = ref('');
const router = useRouter();
const errorMessage = ref() 
const store = useStore()

const register = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
        console.log("signed in");
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
    console.log(result.user.accessToken);
    const accessToken = result.user.accessToken;
    store.dispatch("setAccessToken", accessToken)
    router.push('/');
  })
  .catch((error) => {
    alert(error.message);
    console.log(error.message);
  });

}
const signInWithFacebookSDK = async () => {
  try {
    const response = await new Promise((resolve, reject) => {
      FB.login(function (response) {
        if (response.authResponse) {
          resolve(response);
        } else {
          reject({ message: 'Facebook login failed' });
        }
      });
    });

    console.log(response);
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log(response.authResponse.accessToken);
      } 
    } );
    // Assuming FB.login was successful, you can proceed here
    console.log('Facebook login successful');
    router.push('/');
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
</script>