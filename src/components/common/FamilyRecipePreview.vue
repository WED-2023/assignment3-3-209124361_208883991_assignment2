<template>
  <div class="family-recipe-preview card h-100 d-flex flex-column justify-content-between">
    <img v-if="mainPhoto" :src="mainPhoto" class="card-img-top recipe-image" alt="Recipe Image" />
    <div class="card-body text-center flex-grow-1">
      <h5 class="card-title mb-2">{{ recipe.title }}</h5>
      <p class="mb-1"><strong>By:</strong> {{ recipe.created_by }}</p>
      <p class="mb-2"><strong>Occasion:</strong> {{ recipe.traditional_date }}</p>
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
  name: 'FamilyRecipePreview',
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
.family-recipe-preview {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.family-recipe-preview:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.16);
}
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f0f0f0;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 600;
}
.card-footer {
  background: none;
}
</style> 