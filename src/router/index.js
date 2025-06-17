import { createRouter, createWebHistory } from 'vue-router';
import store from '../store/index.js';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/MainPage.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/AboutPage.vue')
  },
  {
    path: '/create-recipe',
    name: 'CreateRecipe',
    component: () => import('../pages/CreateRecipe.vue'),
    meta: { requiresAuth: true }
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
    component: () => import('../pages/RecipeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../pages/SearchPage.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../pages/Favorites.vue'),
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
    // Only try to fetch user if we haven't initialized yet
    if (!store.getters['auth/isInitialized']) {
      await store.dispatch('auth/fetchUser');
    }

    const isLoggedIn = store.getters['auth/isLoggedIn'];

    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isLoggedIn) {
        // Store the attempted path for redirect after login
        return next({ 
          path: '/login', 
          query: { redirect: to.fullPath },
          replace: true 
        });
      }
    } else if (to.matched.some(record => record.meta.requiresGuest)) {
      if (isLoggedIn) {
        // If user is already logged in, redirect to home or their intended destination
        const redirectPath = to.query.redirect || '/';
        return next({ 
          path: redirectPath,
          replace: true 
        });
      }
    }

    next();
  } catch (error) {
    console.error('Navigation error:', error);
    next('/');
  }
});

export default router;
