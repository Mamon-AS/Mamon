import { createRouter, createWebHistory } from 'vue-router'
// import CardView from '../views/CardView.vue'
import HomeView from '../views/HomeView.vue'
import store from '../store'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/how-it-works', name: 'how-it-works',component: () => import('../views/HowItWorksView.vue') },
    { path: '/register', name: 'register',component: () => import('../views/RegisterView.vue') },
    { path: '/user', name: 'user',component: () => import('../views/MyUserProfileView.vue'), meta: { requiresAuth: true }, props: true},
    { path: '/users/:userId', name: 'UserProfile',component: () => import('../views/UserProfileView.vue'), meta: { requiresAuth: true }, props: true},
    { path: '/sign-in', name: 'sign-in',component: () => import('../views/SignInView.vue') },
    { path: '/privacy', name: 'privacy',component: () => import('../views/PrivacyPolicyView.vue') },
    { path: '/review', name: 'review',component: () => import('../views/PostReviewView.vue'), meta: { requiresAuth: true } },   
    { path: '/followers/:userId/:action', name: 'followers', component: () => import('../views/FollowersView.vue'), meta: { requiresAuth: true }, props: true },
    { path: '/settings', name: 'settings',component: () => import('../views/SettingsView.vue'), meta: { requiresAuth: true }, props: true},
    { path: '/review/:reviewId', name: 'singleReview',component: () => import('../views/SingleReviewView.vue'), meta: { requiresAuth: true }, props: true},
    { path: '/suggestions', name: 'suggestions',component: () => import('../views/PeopleYouMayKnow.vue'), meta: { requiresAuth: true }, props: true},
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
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
  if (to.name === 'user' || to.name === 'review' || to.name === 'UserProfile' || to.name === 'followers' || to.name === 'settings'
  || to.name === 'singleReview' || to.name === 'suggestions') { 
    if (await getCurrentUser()) {
      next();
    } else {
      next('/sign-in');
    }
  } else {
    next(); //Denne trengs for å tillate navigering til andre sider
  }
});

router.afterEach((to, from) => {
  if (from.name) {
    document.documentElement.scrollTop = 0
    store.dispatch('utils/closeModal')
  }
});


export default router
