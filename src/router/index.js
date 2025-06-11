import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/MainPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/RegisterPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/recipe/:id',
    name: 'recipe',
    component: () => import('../pages/RecipeViewPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  try {
    // Only try to fetch user if we have a token
    const token = localStorage.getItem('token');
    if (token) {
      await store.dispatch('auth/fetchUser');
    }

    const isLoggedIn = store.getters['auth/isLoggedIn'];

    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isLoggedIn) {
        return next({ path: '/login', query: { redirect: to.fullPath } });
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      if (isLoggedIn) {
        return next({ path: '/' });
      }
    }

    next();
  } catch (error) {
    console.error('Navigation error:', error);
    next('/');
  }
});

export default router;
