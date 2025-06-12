<template>
  <div class="card recipe-card h-100">
    <img 
      :src="imageUrl" 
      class="card-img-top" 
      :alt="recipe.title"
      @error="handleImageError"
    >
    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p v-if="recipe.readyInMinutes" class="card-text">
        <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} minutes
      </p>
      <p v-if="recipe.servings" class="card-text">
        <i class="bi bi-people"></i> {{ recipe.servings }} servings
      </p>
      <div v-if="recipe.diets && recipe.diets.length" class="mb-2">
        <span 
          v-for="diet in recipe.diets" 
          :key="diet"
          class="badge bg-info me-1"
        >
          {{ diet }}
        </span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <router-link 
          :to="{ name: 'recipe', params: { id: recipe.id }}" 
          class="btn btn-primary"
        >
          View Recipe
        </router-link>
        <button 
          v-if="isLoggedIn"
          class="btn btn-outline-primary"
          @click="toggleFavorite"
          :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
    const isFavorite = computed(() => store.getters['recipes/isFavorite'](props.recipe.id));
    
    // Use a data URL for the default image to avoid 404 errors
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    const imageUrl = ref(props.recipe.image || defaultImage);

    const handleImageError = (e) => {
      e.target.src = defaultImage;
    };

    const toggleFavorite = () => {
      if (isFavorite.value) {
        store.dispatch('recipes/removeFromFavorites', props.recipe.id);
      } else {
        store.dispatch('recipes/addToFavorites', props.recipe);
      }
    };

    return {
      isLoggedIn,
      isFavorite,
      imageUrl,
      handleImageError,
      toggleFavorite
    };
  }
};
</script>

<style scoped>
.recipe-card {
  transition: transform 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  background-color: #f0f0f0;
}

.badge {
  font-size: 0.8rem;
}

.btn-outline-primary {
  padding: 0.375rem 0.75rem;
}

.bi {
  font-size: 1.2rem;
}
</style> 