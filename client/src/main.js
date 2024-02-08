import './firebaseInit';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/main.css'

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