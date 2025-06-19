<template>
  <div class="family-recipe-card card h-100">
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="mb-1"><strong>By:</strong> {{ recipe.created_by }}</p>
      <p class="mb-2"><strong>Occasion:</strong> {{ recipe.traditional_date }}</p>
      <div v-if="recipe.ingredients && recipe.ingredients.length">
        <h6>Ingredients:</h6>
        <ul>
          <li v-for="(ingredient, idx) in recipe.ingredients" :key="idx">{{ ingredient }}</li>
        </ul>
      </div>
      <div v-if="recipe.instructions && recipe.instructions.length">
        <h6>Preparation Method:</h6>
        <ol>
          <li v-for="(step, idx) in recipe.instructions" :key="idx">{{ step }}</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FamilyRecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.family-recipe-card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
}
ul, ol {
  margin-bottom: 0.5rem;
}
</style> 