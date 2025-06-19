<template>
  <div class="user-recipe-card card h-100 d-flex flex-column justify-content-between">
    <img v-if="mainPhoto" :src="mainPhoto" class="card-img-top recipe-image" alt="Recipe Image" />
    <div class="card-body flex-grow-1">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p v-if="recipe.description" class="card-text">{{ recipe.description }}</p>
      <div v-if="recipe.ingredients && recipe.ingredients.length">
        <h6>Ingredients:</h6>
        <ul>
          <li v-for="(ingredient, idx) in recipe.ingredients" :key="idx">{{ ingredient }}</li>
        </ul>
      </div>
      <div v-if="recipe.instructions && recipe.instructions.length">
        <h6>Instructions:</h6>
        <ol>
          <li v-for="(step, idx) in recipe.instructions" :key="idx">{{ step }}</li>
        </ol>
      </div>
    </div>
    <div class="card-footer bg-transparent border-0 text-center pb-3">
      <button class="btn btn-primary" @click.stop="$emit('view', recipe)">
        View Recipe
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  computed: {
    mainPhoto() {
      if (this.recipe.photos && this.recipe.photos.length > 0) {
        return this.recipe.photos[0];
      }
      return null;
    }
  }
};
</script>

<style scoped>
.user-recipe-card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
}
.user-recipe-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.16);
}
.recipe-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  background-color: #f0f0f0;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
}
.card-text {
  margin-bottom: 1rem;
}
ul, ol {
  margin-bottom: 0.5rem;
}
.card-footer {
  background: none;
}
</style> 