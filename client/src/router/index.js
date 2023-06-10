import { createRouter, createWebHistory } from 'vue-router'
import CardView from '../views/CardView.vue'
import HomeView from '../views/HomeView.vue'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/authors',
      name: 'author',
      component: () => import('../views/AuthorView.vue')
    },
    {
      path: '/card',
      name: 'card',
      component: CardView
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('../views/marketing/_id.vue')
    },
    {
      path: '/author/:id',
      name: 'Author',
      component: () => import('../views/author/_id.vue'),
    }
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

router.afterEach((to, from) => {
  if (from.name) {
    document.documentElement.scrollTop = 0
    store.dispatch('CloseMenu')
  }

 
  })

export default router
