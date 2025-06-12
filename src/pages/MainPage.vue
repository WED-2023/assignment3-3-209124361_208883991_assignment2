<template>
  <div class="main-page">
    <!-- Hero Section -->
    <div class="hero-section text-center py-5 mb-5">
      <h1 class="display-4 mb-3">Welcome to Recipe App</h1>
      <p class="lead mb-4">Discover, cook, and share your favorite recipes</p>
      <router-link to="/search" class="btn btn-primary btn-lg">
        Start Exploring
      </router-link>
    </div>

    <!-- Featured Recipes -->
    <section class="mb-5">
      <h2 class="section-title mb-4">Featured Recipes</h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="recipe in featuredRecipes" :key="recipe.id" class="col">
          <RecipeCard :recipe="recipe" />
        </div>
      </div>
    </section>

    <!-- Last Viewed Recipes -->
    <section v-if="isLoggedIn && lastViewedRecipes?.length > 0" class="mb-5">
      <h2 class="section-title mb-4">Recently Viewed</h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="recipe in lastViewedRecipes" :key="recipe.id" class="col">
          <RecipeCard :recipe="recipe" />
        </div>
      </div>
    </section>

    <!-- Family Recipes -->
    <section v-if="isLoggedIn && familyRecipes?.length > 0" class="mb-5">
      <h2 class="section-title mb-4">Family Recipes</h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="recipe in familyRecipes" :key="recipe.id" class="col">
          <RecipeCard :recipe="recipe" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import RecipeCard from '@/components/common/RecipeCard.vue';

export default {
  name: 'MainPage',
  components: {
    RecipeCard
  },
  setup() {
    const store = useStore();
    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
    const featuredRecipes = computed(() => store.getters['recipes/allRecipes']);
    const lastViewedRecipes = computed(() => store.getters['recipes/lastViewedRecipes']);
    const familyRecipes = computed(() => store.getters['recipes/familyRecipes']);

    onMounted(async () => {
      try {
        // Load featured recipes
        await store.dispatch('recipes/getRandomRecipes', { number: 6 });
        
        // Load last viewed recipes if user is logged in
        if (isLoggedIn.value) {
          const userId = store.getters['auth/currentUser']?.id;
          if (userId) {
            await store.dispatch('recipes/getLastViewed', userId);
          }
        }
      } catch (error) {
        store.dispatch('setError', 'Failed to load recipes');
      }
    });

    return {
      isLoggedIn,
      featuredRecipes,
      lastViewedRecipes,
      familyRecipes
    };
  }
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('@/assets/logo.png');
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

.section-title {
  position: relative;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: #0d6efd;
}

.btn-lg {
  padding: 0.75rem 2rem;
  font-weight: 500;
}
</style>
