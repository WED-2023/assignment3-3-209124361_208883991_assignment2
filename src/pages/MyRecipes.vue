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
      <div v-else-if="userRecipes.length === 0" class="text-center py-5">
        <h3>No personal recipes yet</h3>
        <p class="text-muted mb-4">
          Create your own recipes to see them here.
        </p>
        <router-link to="/create-recipe" class="btn btn-primary">
          Create Recipe
        </router-link>
      </div>

      <!-- Recipes Grid -->
      <div v-else class="recipes-grid">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="recipe in userRecipes" :key="recipe.recipe_id" class="col">
            <UserRecipePreview :recipe="recipe" @view="goToRecipe" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import UserRecipePreview from '@/components/common/UserRecipePreview.vue';
import { getUserRecipes } from '../services/userRecipes';
import { useRouter } from 'vue-router';

export default {
  name: 'MyRecipes',
  components: {
    UserRecipePreview
  },
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const userRecipes = ref([]);
    const router = useRouter();

    const loadUserRecipes = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await getUserRecipes();
        userRecipes.value = response.data || [];
      } catch (err) {
        error.value = 'Failed to load your recipes. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const goToRecipe = (recipe) => {
      router.push(`/my-recipes/${recipe.recipe_id}`);
    };

    onMounted(loadUserRecipes);

    return {
      loading,
      error,
      userRecipes,
      goToRecipe
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