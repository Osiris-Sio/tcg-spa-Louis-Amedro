import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './store/auth'

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/sign-in',
  SIGNUP: '/sign-up',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.SIGNIN, component: SignInPage, meta: { requiresAuth: false } },
  { path: ROUTES.SIGNUP, component: SignUpPage, meta: { requiresAuth: false } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return ROUTES.SIGNIN
  }

  if (!to.meta.requiresAuth && auth.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
