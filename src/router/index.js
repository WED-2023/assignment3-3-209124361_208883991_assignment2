import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/MainPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/pages/SearchPage.vue')
  },
  {
    path: '/recipe/:id',
    name: 'recipe',
    component: () => import('@/pages/RecipeViewPage.vue'),
    props: true
  },
  {
    path: '/my-recipes',
    name: 'my-recipes',
    component: () => import('@/pages/MyRecipes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/family-recipes',
    name: 'family-recipes',
    component: () => import('@/pages/FamilyRecipes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/UserProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn'];

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  }
  // Check if route requires guest (not logged in)
  else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isLoggedIn) {
      next({ path: '/' });
    } else {
      next();
    }
  }
  else {
    next();
  }
});

export default router;
