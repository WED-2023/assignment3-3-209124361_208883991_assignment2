<template>
  <div class="user-recipe-view container py-4">
    <div class="row mb-4 align-items-center">
      <div class="col-md-8">
        <h1 class="mb-3">{{ recipe.title }}</h1>
        <p v-if="recipe.description" class="lead">{{ recipe.description }}</p>
      </div>
      <div class="col-md-4 text-end" v-if="mainPhoto">
        <img :src="mainPhoto" class="img-fluid rounded recipe-image" alt="Recipe Image" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header bg-white">
            <h4 class="mb-0">Ingredients</h4>
          </div>
          <ul class="list-group list-group-flush">
            <li v-for="(ingredient, idx) in recipe.ingredients" :key="idx" class="list-group-item">
              {{ ingredient }}
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header bg-white">
            <h4 class="mb-0">Instructions</h4>
          </div>
          <ol class="list-group list-group-numbered list-group-flush">
            <li v-for="(step, idx) in recipe.instructions" :key="idx" class="list-group-item">
              {{ step }}
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <button class="btn btn-secondary" @click="$router.back()">Back</button>
    </div>
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

    onMounted(async () => {
      const response = await getUserRecipes();
      const recipes = response.data || [];
      const found = recipes.find(r => String(r.recipe_id) === String(route.params.id));
      if (found) {
        recipe.value = found;
        if (found.photos && found.photos.length > 0) {
          mainPhoto.value = found.photos[0];
        }
      }
    });

    return {
      recipe,
      mainPhoto
    };
  }
};
</script>

<style scoped>
.user-recipe-view {
  max-width: 1000px;
  margin: 0 auto;
}
.recipe-image {
  max-height: 260px;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
h1 {
  font-size: 2.2rem;
  font-weight: 700;
}
.lead {
  font-size: 1.15rem;
  color: #555;
}
.card-header {
  background: #fff;
  border-bottom: 1px solid #eee;
}
.list-group-item {
  font-size: 1.05rem;
}
.list-group-numbered > .list-group-item::before {
  background: #0d6efd;
  color: #fff;
  border-radius: 50%;
  margin-right: 0.75rem;
}
</style> 