<template>
  <div class="card h-100">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />
    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <div class="recipe-meta">
        <p class="card-text">
          <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} minutes
        </p>
        <p class="card-text likes">
          <i class="bi bi-heart-fill text-danger"></i> {{ recipe.aggregateLikes || 0 }} likes
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recipe-meta {
  color: #6c757d;
}

.likes {
  margin-top: 0.5rem;
}

.bi-heart-fill {
  margin-right: 0.25rem;
}
</style>
