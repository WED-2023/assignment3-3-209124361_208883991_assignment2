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
      <div class="recipe-meta">
        <p v-if="recipe.readyInMinutes" class="card-text">
          <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} minutes
        </p>
        <p v-if="recipe.servings" class="card-text">
          <i class="bi bi-people"></i> {{ recipe.servings }} servings
        </p>
        <p class="card-text likes">
          <i class="bi bi-heart-fill text-danger"></i> {{ recipe.aggregateLikes || 0 }} likes
        </p>
        <p v-if="isViewed" class="card-text viewed">
          <i class="bi bi-eye-fill text-primary"></i> Viewed
        </p>
      </div>
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
import { computed, ref, onMounted } from 'vue';
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
    const isViewed = computed(() => store.getters['recipes/isViewed'](props.recipe.id));
    
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

    onMounted(async () => {
      if (isLoggedIn.value) {
        await store.dispatch('recipes/checkRecipeViewed', props.recipe.id);
      }
    });

    return {
      isLoggedIn,
      isFavorite,
      isViewed,
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

.recipe-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.likes {
  color: #6c757d;
}

.bi-heart-fill {
  margin-right: 0.25rem;
}

.viewed {
  color: #0d6efd;
}

.bi-eye-fill {
  margin-right: 0.25rem;
}
</style> 