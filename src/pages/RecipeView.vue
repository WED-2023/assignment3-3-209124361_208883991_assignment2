<template>
  <div class="recipe-view">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else-if="recipe" class="container">
      <!-- Recipe Header -->
      <div class="recipe-header mb-4">
        <div class="row">
          <div class="col-md-8">
            <h1 class="mb-3">{{ recipe.title }}</h1>
            <div class="recipe-meta mb-3">
              <span class="me-3">
                <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} minutes
              </span>
              <span class="me-3">
                <i class="bi bi-people"></i> {{ recipe.servings }} servings
              </span>
              <span v-if="recipe.vegetarian" class="badge bg-success me-2">Vegetarian</span>
              <span v-if="recipe.vegan" class="badge bg-success me-2">Vegan</span>
              <span v-if="recipe.glutenFree" class="badge bg-info me-2">Gluten Free</span>
            </div>
            <div class="recipe-tags mb-3">
              <span v-for="tag in recipe.dishTypes" :key="tag" class="badge bg-secondary me-2">
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="col-md-4 text-end">
            <button
              class="btn btn-outline-primary me-2"
              @click="toggleFavorite"
              :class="{ 'active': isFavorite }"
            >
              <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
              {{ isFavorite ? 'Saved' : 'Save' }}
            </button>
            <button class="btn btn-primary" @click="printRecipe">
              <i class="bi bi-printer"></i> Print
            </button>
          </div>
        </div>
      </div>

      <!-- Recipe Content -->
      <div class="row">
        <!-- Recipe Image -->
        <div class="col-md-4 mb-4">
          <img
            :src="imageUrl"
            :alt="recipe.title"
            class="img-fluid rounded recipe-image"
            @error="handleImageError"
          />
        </div>

        <!-- Recipe Details -->
        <div class="col-md-8">
          <!-- Summary -->
          <div class="recipe-summary mb-4" v-html="recipe.summary"></div>

          <!-- Ingredients -->
          <div class="recipe-ingredients mb-4">
            <h3>Ingredients</h3>
            <ul class="list-group">
              <li
                v-for="ingredient in recipe.extendedIngredients"
                :key="ingredient.id"
                class="list-group-item"
              >
                {{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.originalName }}
              </li>
            </ul>
          </div>

          <!-- Instructions -->
          <div class="recipe-instructions mb-4">
            <h3>Instructions</h3>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="progress-info">
                <span class="badge bg-primary">{{ completedStepsCount }} of {{ totalSteps }} steps completed</span>
              </div>
              <button 
                class="btn btn-outline-secondary btn-sm"
                @click="resetProgress"
                :disabled="!hasProgress"
              >
                Reset Progress
              </button>
            </div>
            <div v-if="recipe.analyzedInstructions && recipe.analyzedInstructions[0]">
              <div
                v-for="step in recipe.analyzedInstructions[0].steps"
                :key="step.number"
                class="instruction-step mb-3"
                :class="{ 'completed': isStepCompleted(step.number) }"
              >
                <div class="d-flex align-items-start">
                  <div class="step-checkbox me-3">
                    <input
                      type="checkbox"
                      :id="'step-' + step.number"
                      :checked="isStepCompleted(step.number)"
                      @change="toggleStep(step.number)"
                      class="form-check-input"
                    />
                  </div>
                  <div class="step-content flex-grow-1">
                    <div class="d-flex align-items-center mb-2">
                      <span class="step-number me-3">{{ step.number }}</span>
                      <label :for="'step-' + step.number" class="mb-0 flex-grow-1">{{ step.step }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-info">
              No detailed instructions available for this recipe.
            </div>
          </div>

          <!-- Additional Information -->
          <div class="recipe-additional-info">
            <h3>Additional Information</h3>
            <div class="row">
              <div class="col-md-6">
                <div class="card mb-3">
                  <div class="card-body">
                    <h5 class="card-title">Nutrition Facts</h5>
                    <ul class="list-unstyled">
                      <li v-if="recipe.nutrition">
                        <strong>Calories:</strong> {{ recipe.nutrition.nutrients[0].amount }} kcal
                      </li>
                      <li v-if="recipe.nutrition">
                        <strong>Protein:</strong> {{ recipe.nutrition.nutrients[1].amount }}g
                      </li>
                      <li v-if="recipe.nutrition">
                        <strong>Fat:</strong> {{ recipe.nutrition.nutrients[2].amount }}g
                      </li>
                      <li v-if="recipe.nutrition">
                        <strong>Carbohydrates:</strong> {{ recipe.nutrition.nutrients[3].amount }}g
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card mb-3">
                  <div class="card-body">
                    <h5 class="card-title">Wine Pairing</h5>
                    <p v-if="recipe.winePairing" class="card-text">
                      {{ recipe.winePairing.pairingText }}
                    </p>
                    <p v-else class="card-text text-muted">
                      No wine pairing suggestions available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'RecipeView',
  setup() {
    const store = useStore();
    const route = useRoute();
    const loading = ref(true);
    const error = ref(null);

    const recipe = computed(() => store.getters['recipes/currentRecipe']);
    const isFavorite = computed(() => store.getters['recipes/isFavorite'](recipe.value?.id));
    const recipeProgress = computed(() => store.getters['recipes/getRecipeProgress'](route.params.id));
    
    const totalSteps = computed(() => {
      if (!recipe.value?.analyzedInstructions?.[0]?.steps) return 0;
      return recipe.value.analyzedInstructions[0].steps.length;
    });

    const completedStepsCount = computed(() => {
      return recipeProgress.value.completedSteps.length;
    });

    const hasProgress = computed(() => {
      return recipeProgress.value.completedSteps.length > 0;
    });

    const isStepCompleted = (stepNumber) => {
      return recipeProgress.value.completedSteps.includes(stepNumber);
    };

    const toggleStep = (stepNumber) => {
      store.dispatch('recipes/toggleRecipeStep', {
        recipeId: route.params.id,
        stepNumber
      });
    };

    const resetProgress = () => {
      store.dispatch('recipes/resetRecipeProgress', route.params.id);
    };

    // Use a data URL for the default image to avoid 404 errors
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    const imageUrl = ref(recipe.value?.image || defaultImage);

    const handleImageError = (e) => {
      e.target.src = defaultImage;
    };

    const loadRecipe = async () => {
      loading.value = true;
      error.value = null;

      try {
        await store.dispatch('recipes/getRecipeDetails', route.params.id);
        imageUrl.value = recipe.value?.image || defaultImage;
        
        // Record recipe view if user is logged in
        if (store.getters['auth/isLoggedIn']) {
          await store.dispatch('recipes/recordRecipeView', route.params.id);
        }
      } catch (err) {
        error.value = 'Failed to load recipe details. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const toggleFavorite = async () => {
      if (!store.getters['auth/isLoggedIn']) {
        store.dispatch('setError', 'Please log in to save recipes');
        return;
      }

      try {
        if (isFavorite.value) {
          await store.dispatch('recipes/removeFromFavorites', recipe.value.id);
        } else {
          await store.dispatch('recipes/addToFavorites', recipe.value);
        }
      } catch (err) {
        store.dispatch('setError', 'Failed to update favorite status');
      }
    };

    const printRecipe = () => {
      window.print();
    };

    onMounted(loadRecipe);

    return {
      loading,
      error,
      recipe,
      isFavorite,
      imageUrl,
      handleImageError,
      toggleFavorite,
      printRecipe,
      isStepCompleted,
      toggleStep,
      resetProgress,
      totalSteps,
      completedStepsCount,
      hasProgress
    };
  }
};
</script>

<style scoped>
.recipe-header {
  padding: 2rem 0;
  border-bottom: 1px solid #dee2e6;
}

.recipe-meta {
  color: #6c757d;
}

.recipe-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recipe-summary {
  line-height: 1.6;
}

.instruction-step {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.instruction-step.completed {
  background-color: #e8f5e9;
}

.step-checkbox {
  margin-top: 0.25rem;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: #0d6efd;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.instruction-step.completed .step-number {
  background-color: #28a745;
}

.progress-info {
  font-size: 1.1rem;
}

@media print {
  .btn,
  .form-check-input {
    display: none;
  }

  .instruction-step {
    background-color: transparent !important;
  }
}
</style> 