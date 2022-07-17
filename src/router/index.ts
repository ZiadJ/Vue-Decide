import { createRouter, createWebHistory } from 'vue-router'
import GoalsView from '../views/GoalsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GoalsView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/proposals',
      name: 'proposals',
      component: () => import('../views/ProposalsView.vue')
    },
    {
      path: '/resources',
      name: 'resources',
      component: () => import('../views/ReosourcesView.vue')
    },
    {
      path: '/console',
      name: 'console',
      component: () => import('../views/ConsoleView.vue')
    }
  ]
})

export default router
