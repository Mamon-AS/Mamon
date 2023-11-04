import { createRouter, createWebHistory } from 'vue-router'
import CardView from '../views/CardView.vue'
import HomeView from '../views/HomeView.vue'
import store from '../store'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/authors', name: 'author',component: () => import('../views/AuthorView.vue') },
    { path: '/card', name: 'card', component: CardView},
    { path: '/post/:id', name: 'post', component: () => import('../views/marketing/_id.vue') },
    { path: '/author/:id', name: 'Author',component: () => import('../views/author/_id.vue') },
    { path: '/register', name: 'register',component: () => import('../views/RegisterView.vue') },
    { path: '/user', name: 'user',component: () => import('../views/UserView.vue'), meta: { requiresAuth: true } },
    { path: '/sign-in', name: 'sign-in',component: () => import('../views/SignInView.vue') },
    { path: '/privacy', name: 'privacy',component: () => import('../views/PrivacyPolicyView.vue') }
    /* {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    } */
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
     const removeListener = onAuthStateChanged(
      getAuth(), 
      (user) => { 
        removeListener(); 
        resolve(user); 
      },
      reject
      );
    });
  };
// navigation guard for å sjekke innlogga brukere 
router.beforeEach(async(to, from, next) => {
  if (to.name === 'user') { // trengs bare på /user
    if (await getCurrentUser()) {
      next();
    } else {
      alert("Du må være logget inn for å se denne siden");
      next('/sign-in');
    }
  } else {
    next(); //Denne trengs for å tillate navigering til andre sider
  }
});

router.afterEach((to, from) => {
  if (from.name) {
    document.documentElement.scrollTop = 0
    store.dispatch('CloseMenu')
  }
});


export default router
