<template>
  <div class="search-page">
    <div class="container">
      <!-- Search Header -->
      <div class="search-header mb-4">
        <h1 class="mb-4">Search Recipes</h1>
        <div class="row g-3">
          <div class="col-md-8">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="searchQuery"
                placeholder="Search for recipes..."
                @keyup.enter="handleSearch"
              />
              <button class="btn btn-primary" @click="handleSearch">
                <i class="bi bi-search"></i> Search
              </button>
            </div>
          </div>
          <div class="col-md-4">
            <button
              class="btn btn-outline-primary w-100"
              @click="showFilters = !showFilters"
            >
              <i class="bi bi-funnel"></i>
              {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div v-if="showFilters" class="filters-section mb-4">
        <div class="card">
          <div class="card-body">
            <div class="row g-3">
              <!-- Cuisine Filter -->
              <div class="col-md-4">
                <label class="form-label">Cuisine</label>
                <select class="form-select" v-model="filters.cuisine">
                  <option value="">All Cuisines</option>
                  <option v-for="cuisine in cuisines" :key="cuisine" :value="cuisine">
                    {{ cuisine }}
                  </option>
                </select>
              </div>

              <!-- Diet Filter -->
              <div class="col-md-4">
                <label class="form-label">Diet</label>
                <select class="form-select" v-model="filters.diet">
                  <option value="">All Diets</option>
                  <option v-for="diet in diets" :key="diet" :value="diet">
                    {{ diet }}
                  </option>
                </select>
              </div>

              <!-- Intolerances Filter -->
              <div class="col-md-4">
                <label class="form-label">Intolerances</label>
                <select class="form-select" v-model="filters.intolerances">
                  <option value="">No Restrictions</option>
                  <option v-for="intolerance in intolerances" :key="intolerance" :value="intolerance">
                    {{ intolerance }}
                  </option>
                </select>
              </div>

              <!-- Max Ready Time Filter -->
              <div class="col-md-4">
                <label class="form-label">Max Ready Time (minutes)</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="filters.maxReadyTime"
                  min="0"
                  step="5"
                />
              </div>

              <!-- Sort By Filter -->
              <div class="col-md-4">
                <label class="form-label">Sort By</label>
                <select class="form-select" v-model="filters.sortBy">
                  <option value="popularity">Popularity</option>
                  <option value="time">Cooking Time</option>
                  <option value="calories">Calories</option>
                </select>
              </div>

              <!-- Apply Filters Button -->
              <div class="col-12 text-end">
                <button class="btn btn-primary" @click="applyFilters">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="results-section">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <div v-else-if="recipes.length === 0" class="text-center py-5">
          <h3>No recipes found</h3>
          <p class="text-muted">Try adjusting your search criteria</p>
        </div>

        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="recipe in recipes" :key="recipe.id" class="col">
            <RecipeCard :recipe="recipe" />
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="recipes.length > 0" class="pagination-section mt-4">
          <nav aria-label="Recipe search results pages">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  Previous
                </a>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <a class="page-link" href="#" @click.prevent="changePage(page)">
                  {{ page }}
                </a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import RecipeCard from '@/components/common/RecipeCard.vue';

export default {
  name: 'SearchPage',
  components: {
    RecipeCard
  },
  setup() {
    const store = useStore();
    const searchQuery = ref('');
    const showFilters = ref(false);
    const loading = ref(false);
    const error = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 9;

    const filters = ref({
      cuisine: '',
      diet: '',
      intolerances: '',
      maxReadyTime: '',
      sortBy: 'popularity'
    });

    const recipes = computed(() => store.getters['recipes/allRecipes']);
    const totalRecipes = computed(() => store.getters['recipes/totalRecipes']);
    const totalPages = computed(() => Math.ceil(totalRecipes.value / itemsPerPage));

    // Filter options
    const cuisines = [
      'African', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese',
      'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian',
      'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American',
      'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern',
      'Spanish', 'Thai', 'Vietnamese'
    ];

    const diets = [
      'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
      'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30'
    ];

    const intolerances = [
      'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame',
      'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
    ];

    const handleSearch = async () => {
      if (!searchQuery.value.trim()) return;
      
      loading.value = true;
      error.value = null;
      currentPage.value = 1;

      try {
        await store.dispatch('recipes/searchRecipes', {
          query: searchQuery.value,
          ...filters.value,
          offset: 0,
          number: itemsPerPage
        });
      } catch (err) {
        error.value = 'Failed to search recipes. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const applyFilters = () => {
      handleSearch();
    };

    const changePage = async (page) => {
      if (page < 1 || page > totalPages.value) return;
      
      currentPage.value = page;
      loading.value = true;
      error.value = null;

      try {
        await store.dispatch('recipes/searchRecipes', {
          query: searchQuery.value,
          ...filters.value,
          offset: (page - 1) * itemsPerPage,
          number: itemsPerPage
        });
      } catch (err) {
        error.value = 'Failed to load recipes. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    // Watch for route query changes
    watch(
      () => store.getters['recipes/filters'],
      (newFilters) => {
        if (newFilters) {
          filters.value = { ...newFilters };
          if (newFilters.query) {
            searchQuery.value = newFilters.query;
            handleSearch();
          }
        }
      },
      { immediate: true }
    );

    return {
      searchQuery,
      showFilters,
      filters,
      loading,
      error,
      recipes,
      currentPage,
      totalPages,
      cuisines,
      diets,
      intolerances,
      handleSearch,
      applyFilters,
      changePage
    };
  }
};
</script>

<style scoped>
.search-header {
  padding: 2rem 0;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.filters-section {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-section {
  margin-bottom: 2rem;
}

.page-link {
  color: #0d6efd;
  cursor: pointer;
}

.page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
  