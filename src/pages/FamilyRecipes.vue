<template>
  <div class="family-recipes container py-4">
    <h1 class="mb-4">Family Recipes</h1>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else>
      <div v-if="recipes.length === 0" class="text-center py-5">
        <h3>No family recipes found.</h3>
        <p class="text-muted">Please ask your instructor to pre-insert at least 3 family recipes.</p>
      </div>
      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="recipe in recipes" :key="recipe.recipe_id" class="col">
          <FamilyRecipePreview :recipe="recipe" @view="goToRecipe" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FamilyRecipePreview from '@/components/common/FamilyRecipePreview.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'FamilyRecipes',
  components: { FamilyRecipePreview },
  setup() {
    const recipes = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const router = useRouter();

    onMounted(async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await axios.get(`/recipes/family_recipes`, { withCredentials: true });
        recipes.value = response.data || [];
      } catch (err) {
        error.value = 'Failed to load family recipes.';
      } finally {
        loading.value = false;
      }
    });

    const goToRecipe = (recipe) => {
      router.push(`/family-recipes/${recipe.recipe_id}`);
    };

    return {
      recipes,
      loading,
      error,
      goToRecipe
    };
  }
};
</script>

<style scoped>
.family-recipes {
  max-width: 1100px;
  margin: 0 auto;
}
</style> 