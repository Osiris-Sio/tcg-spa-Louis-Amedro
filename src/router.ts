import { createRouter, createWebHistory } from 'vue-router'

import CreateDeck from './pages/CreateDeck.vue'
import GamePage from './pages/GamePage.vue'
import HomePage from './pages/HomePage.vue'
import SignInPage from './pages/SignInPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './store/auth'

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/sign-in',
  SIGNUP: '/sign-up',
  CREATE_DECK: '/decks/create',
  GAME: '/game',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  {
    path: ROUTES.GAME,
    component: GamePage,
    meta: { requiresAuth: true },
  },
  { path: ROUTES.SIGNIN, component: SignInPage, meta: { requiresAuth: false } },
  { path: ROUTES.SIGNUP, component: SignUpPage, meta: { requiresAuth: false } },
  {
    path: ROUTES.CREATE_DECK,
    component: CreateDeck,
    meta: { requiresAuth: true },
  },
  {
    path: '/decks/:id',
    component: () => import('./pages/DeckDetails.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/decks/:id/edit',
    component: () => import('./pages/EditDeck.vue'),
    meta: { requiresAuth: true },
  },
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
