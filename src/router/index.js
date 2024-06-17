import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView
    },
    {
      path: '/cart/:movieId',
      name: 'CartView',
      // Lazy-loaded component when the route is visisted.
      component: () => import('../views/Cart.vue')
    }
  ]
})

export default router
