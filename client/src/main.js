import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initializeApp } from "firebase/app";

import './assets/main.css'

const firebaseConfig = {
  apiKey: "AIzaSyCorN5bkMk84KR4kZFMQHlvEZ1DQHfqZjQ",
  authDomain: "mamon-6d168.firebaseapp.com",
  projectId: "mamon-6d168",
  storageBucket: "mamon-6d168.appspot.com",
  messagingSenderId: "3936526995",
  appId: "1:3936526995:web:109dc277260841932c6366",
  measurementId: "G-QX1SWJE10Z"
};

initializeApp(firebaseConfig);
const app = createApp(App)
  .use(router)
  .use(store)
  .mount('#app');


if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.getElementsByTagName("html")[0].classList.add("dark");
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  if (event.matches == "dark") document.getElementsByTagName("html")[0].classList.toggle("dark");
});