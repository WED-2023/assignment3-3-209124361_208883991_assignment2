<template>
  <div class="card recipe-card h-100">
    <img 
      :src="recipe.image || '/default-recipe.jpg'" 
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
import { computed } from 'vue';
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
    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const isFavorite = computed(() => store.getters.isFavorite(props.recipe.id));

    const handleImageError = (e) => {
      e.target.src = '/default-recipe.jpg';
    };

    const toggleFavorite = () => {
      if (isFavorite.value) {
        store.dispatch('removeFavorite', props.recipe.id);
      } else {
        store.dispatch('addFavorite', props.recipe);
      }
    };

    return {
      isLoggedIn,
      isFavorite,
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