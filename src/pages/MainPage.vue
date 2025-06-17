<template>
  <div class="main-page container py-4">
    <div class="row">
      <!-- Left Column: Random Recipes -->
      <div class="col-md-6">
        <div class="random-recipes-section">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0">Explore These Recipes</h2>
            <button @click="refreshRandomRecipes" class="btn btn-outline-primary">
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
          <div class="row g-4">
            <div v-for="recipe in randomRecipes" :key="recipe.id" class="col-12">
              <RecipeCard :recipe="recipe" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Last Watched or Login Prompt -->
      <div class="col-md-6">
        <div class="last-watched-section">
          <template v-if="isLoggedIn">
            <h2 class="section-title mb-4">Last Watched Recipes</h2>
            <div class="row g-4">
              <div v-for="recipe in lastViewedRecipes" :key="recipe.id" class="col-12">
                <RecipeCard :recipe="recipe" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="login-prompt text-center p-5">
              <h2 class="mb-4">Want to see your recently viewed recipes?</h2>
              <p class="mb-4">Log in to keep track of your favorite recipes and view your history.</p>
              <div class="d-flex justify-content-center gap-3">
                <router-link to="/login" class="btn btn-primary">Login</router-link>
                <router-link to="/register" class="btn btn-outline-primary">Register</router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import RecipeCard from '@/components/common/RecipeCard.vue';

export default {
  name: 'MainPage',
  components: {
    RecipeCard
  },
  setup() {
    const store = useStore();
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
    const randomRecipes = computed(() => store.getters['recipes/randomRecipes']);
    const lastViewedRecipes = computed(() => store.getters['recipes/lastViewedRecipes']);

    const loadRandomRecipes = async () => {
      try {
        await store.dispatch('recipes/getRandomRecipes', { number: 3 });
      } catch (error) {
        store.dispatch('setError', 'Failed to load random recipes');
      }
    };

    const loadLastViewedRecipes = async () => {
      if (isLoggedIn.value) {
        try {
          const userId = store.getters['auth/currentUser']?.id;
          if (userId) {
            await store.dispatch('recipes/getLastViewed', userId);
          }
        } catch (error) {
          store.dispatch('setError', 'Failed to load last viewed recipes');
        }
      }
    };

    const refreshRandomRecipes = () => {
      loadRandomRecipes();
    };

    onMounted(async () => {
      await loadRandomRecipes();
      await loadLastViewedRecipes();
    });

    return {
      isLoggedIn,
      randomRecipes,
      lastViewedRecipes,
      refreshRandomRecipes
    };
  }
};
</script>

<style scoped>
.section-title {
  position: relative;
  padding-bottom: 0.5rem;
  font-weight: 600;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: #0d6efd;
}

.login-prompt {
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 0.5rem 1.5rem;
  font-weight: 500;
}

.gap-3 {
  gap: 1rem;
}
</style>
