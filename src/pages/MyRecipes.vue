<template>
  <div class="my-recipes">
    <div class="container">
      <h1 class="mb-4">My Recipes</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="favoriteRecipes.length === 0" class="text-center py-5">
        <h3>No saved recipes yet</h3>
        <p class="text-muted mb-4">
          Start exploring recipes and save your favorites to see them here.
        </p>
        <router-link to="/search" class="btn btn-primary">
          Browse Recipes
        </router-link>
      </div>

      <!-- Recipes Grid -->
      <div v-else class="recipes-grid">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="recipe in favoriteRecipes" :key="recipe.id" class="col">
            <RecipeCard :recipe="recipe">
              <template #actions>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="removeFavorite(recipe.id)"
                >
                  <i class="bi bi-trash"></i> Remove
                </button>
              </template>
            </RecipeCard>
          </div>
        </div>
      </div>

      <!-- Last Viewed Recipes -->
      <div v-if="lastViewedRecipes.length > 0" class="mt-5">
        <h2 class="mb-4">Recently Viewed</h2>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="recipe in lastViewedRecipes" :key="recipe.id" class="col">
            <RecipeCard :recipe="recipe" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import RecipeCard from '@/components/common/RecipeCard.vue';

export default {
  name: 'MyRecipes',
  components: {
    RecipeCard
  },
  setup() {
    const store = useStore();
    const loading = ref(true);
    const error = ref(null);

    const favoriteRecipes = computed(() => store.getters['recipes/favoriteRecipes']);
    const lastViewedRecipes = computed(() => store.getters['recipes/lastViewedRecipes']);

    const loadUserRecipes = async () => {
      loading.value = true;
      error.value = null;

      try {
        const userId = store.getters['auth/currentUser'].id;
        await Promise.all([
          store.dispatch('recipes/getFavorites', userId),
          store.dispatch('recipes/getLastViewed', userId)
        ]);
      } catch (err) {
        error.value = 'Failed to load your recipes. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const removeFavorite = async (recipeId) => {
      try {
        await store.dispatch('recipes/removeFavorite', recipeId);
      } catch (err) {
        store.dispatch('setError', 'Failed to remove recipe from favorites');
      }
    };

    onMounted(loadUserRecipes);

    return {
      loading,
      error,
      favoriteRecipes,
      lastViewedRecipes,
      removeFavorite
    };
  }
};
</script>

<style scoped>
.recipes-grid {
  margin-bottom: 2rem;
}

h1, h2 {
  color: #2c3e50;
  font-weight: 600;
}

.btn-outline-danger {
  border-width: 1px;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}
</style> 