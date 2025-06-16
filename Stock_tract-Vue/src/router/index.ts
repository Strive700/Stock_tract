import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import IndexChart from '../components/IndexChart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login-initial',
      component: LoginView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/market',
      name: 'market',
      component: () => import('@/views/MarketView.vue'),
    },
    {
      path: '/position',
      name: 'position',
      component: () => import('@/views/PositionView.vue'),
    },
    {
      path: '/securities',
      name: 'securities',
      component: () => import('@/views/SecuritiesView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrdersView.vue'),
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/UserView.vue'),
    },
    {
      path: '/index-chart',
      name: 'index-chart',
      component: IndexChart,
      meta: {
        requiresAuth: true
      }
    },
  ],
})

export default router
