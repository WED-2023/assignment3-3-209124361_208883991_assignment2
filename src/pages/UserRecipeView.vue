<template>
  <div class="user-recipe-view container py-4">
    <div class="row">
      <div class="col-md-6 mb-3">
        <div v-if="mainPhoto" class="mb-3">
          <img :src="mainPhoto" class="img-fluid rounded" alt="Recipe Image" />
        </div>
        <div v-if="otherPhotos.length">
          <div class="d-flex flex-wrap gap-2">
            <img v-for="(photo, idx) in otherPhotos" :key="idx" :src="photo" class="img-thumbnail" style="max-width: 100px; max-height: 100px;" alt="Recipe Photo" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <h2>{{ recipe.title }}</h2>
        <p v-if="recipe.description">{{ recipe.description }}</p>
        <div v-if="recipe.ingredients && recipe.ingredients.length">
          <h5>Ingredients</h5>
          <ul>
            <li v-for="(ingredient, idx) in recipe.ingredients" :key="idx">{{ ingredient }}</li>
          </ul>
        </div>
        <div v-if="recipe.instructions && recipe.instructions.length">
          <h5>Instructions</h5>
          <ol>
            <li v-for="(step, idx) in recipe.instructions" :key="idx">{{ step }}</li>
          </ol>
        </div>
      </div>
    </div>
    <button class="btn btn-secondary mt-4" @click="$router.back()">Back</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getUserRecipes } from '../services/userRecipes';
import { useRoute } from 'vue-router';

export default {
  name: 'UserRecipeView',
  setup() {
    const route = useRoute();
    const recipe = ref({});
    const mainPhoto = ref(null);
    const otherPhotos = ref([]);

    onMounted(async () => {
      const response = await getUserRecipes();
      const recipes = response.data || [];
      const found = recipes.find(r => String(r.recipe_id) === String(route.params.id));
      if (found) {
        recipe.value = found;
        if (found.photos && found.photos.length > 0) {
          mainPhoto.value = found.photos[0];
          otherPhotos.value = found.photos.slice(1);
        }
      }
    });

    return {
      recipe,
      mainPhoto,
      otherPhotos
    };
  }
};
</script>

<style scoped>
.user-recipe-view img.img-fluid {
  max-height: 350px;
  object-fit: cover;
}
</style> 