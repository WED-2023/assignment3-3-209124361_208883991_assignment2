import axios from 'axios';

const state = {
  recipes: [],
  randomRecipes: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  lastViewed: [],
  familyRecipes: [],
  currentRecipe: null,
  totalResults: 0,
  filters: {
    query: '',
    cuisines: [],
    diets: [],
    intolerances: []
  },
  recipeProgress: JSON.parse(localStorage.getItem('recipeProgress') || '{}'),
  viewedRecipes: new Set(),
  lastSearch: JSON.parse(localStorage.getItem('lastSearch') || 'null')
};

const getters = {
  allRecipes: state => state.recipes || [],
  randomRecipes: state => state.randomRecipes || [],
  favoriteRecipes: state => state.favorites || [],
  lastViewedRecipes: state => state.lastViewed || [],
  familyRecipes: state => state.familyRecipes || [],
  currentRecipe: state => state.currentRecipe,
  filters: state => state.filters,
  totalRecipes: state => state.totalResults,
  isFavorite: state => recipeId => (state.favorites || []).some(recipe => recipe.id === recipeId),
  getRecipeProgress: state => recipeId => state.recipeProgress[recipeId] || { completedSteps: [] },
  isViewed: state => recipeId => state.viewedRecipes.has(recipeId),
  lastSearch: state => state.lastSearch
};

const mutations = {
  SET_RECIPES(state, recipes) {
    state.recipes = recipes;
  },
  SET_RANDOM_RECIPES(state, recipes) {
    state.randomRecipes = recipes;
  },
  SET_TOTAL_RESULTS(state, total) {
    state.totalResults = total;
  },
  SET_LAST_SEARCH(state, searchParams) {
    state.lastSearch = searchParams;
    localStorage.setItem('lastSearch', JSON.stringify(searchParams));
  },
  SET_CURRENT_RECIPE(state, recipe) {
    state.currentRecipe = recipe;
  },
  ADD_TO_FAVORITES(state, recipe) {
    if (!state.favorites.some(fav => fav.id === recipe.id)) {
      state.favorites.push(recipe);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    }
  },
  REMOVE_FROM_FAVORITES(state, recipeId) {
    state.favorites = state.favorites.filter(recipe => recipe.id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
  },
  SET_LAST_VIEWED(state, recipes) {
    state.lastViewed = recipes || [];
  },
  SET_FAMILY_RECIPES(state, recipes) {
    state.familyRecipes = recipes || [];
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters };
  },
  SET_FAVORITES(state, favorites) {
    state.favorites = favorites;
    localStorage.setItem('favorites', JSON.stringify(favorites));
  },
  SET_RECIPE_PROGRESS(state, { recipeId, completedSteps }) {
    state.recipeProgress = {
      ...state.recipeProgress,
      [recipeId]: { completedSteps }
    };
    localStorage.setItem('recipeProgress', JSON.stringify(state.recipeProgress));
  },
  TOGGLE_RECIPE_STEP(state, { recipeId, stepNumber }) {
    const progress = state.recipeProgress[recipeId] || { completedSteps: [] };
    const completedSteps = [...progress.completedSteps];
    const stepIndex = completedSteps.indexOf(stepNumber);
    
    if (stepIndex === -1) {
      completedSteps.push(stepNumber);
    } else {
      completedSteps.splice(stepIndex, 1);
    }
    
    state.recipeProgress = {
      ...state.recipeProgress,
      [recipeId]: { completedSteps }
    };
    localStorage.setItem('recipeProgress', JSON.stringify(state.recipeProgress));
  },
  SET_VIEWED_RECIPE(state, recipeId) {
    state.viewedRecipes.add(recipeId);
  },
  SET_VIEWED_RECIPES(state, recipeIds) {
    state.viewedRecipes = new Set(recipeIds);
  }
};

const actions = {
  async searchRecipes({ commit }, { query, cuisines, diets, intolerances, maxReadyTime, sort, offset, number }) {
    try {
      const params = {
        query: query || '',
        cuisines: cuisines?.join(','),
        diets: diets?.join(','),
        intolerances: intolerances?.join(','),
        maxReadyTime,
        sort,
        offset,
        number
      };

      // Remove undefined parameters
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await axios.get('/recipes/search', { params });
      
      // Save the search parameters
      commit('SET_LAST_SEARCH', {
        query,
        cuisines,
        diets,
        intolerances,
        maxReadyTime,
        sort,
        number
      });
      
      // The server returns the results array directly
      if (Array.isArray(response.data)) {
        commit('SET_RECIPES', response.data);
        commit('SET_TOTAL_RESULTS', response.data.length);
      } else {
        commit('SET_RECIPES', []);
        commit('SET_TOTAL_RESULTS', 0);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      commit('SET_RECIPES', []);
      commit('SET_TOTAL_RESULTS', 0);
      throw error;
    }
  },

  async getRandomRecipes({ commit }, { number = 5, tags = '' }) {
    try {
      const response = await axios.get('/recipes/random', {
        params: { number, tags }
      });
      commit('SET_RANDOM_RECIPES', response.data);
      return response;
    } catch (error) {
      console.error('Error getting random recipes:', error);
      commit('SET_RANDOM_RECIPES', []);
      throw error.response?.data || error;
    }
  },

  async getRecipeDetails({ commit }, recipeId) {
    try {
      const response = await axios.get(`/recipes/${recipeId}`);
      commit('SET_CURRENT_RECIPE', response.data);
      return response;
    } catch (error) {
      console.error('Error getting recipe details:', error);
      commit('SET_CURRENT_RECIPE', null);
      throw error.response?.data || error;
    }
  },

  async getLastViewed({ commit }, userId) {
    try {
      const response = await axios.get(`/recipes/${userId}/search/last`);
      // Get full details for each last viewed recipe
      const lastViewedWithDetails = await Promise.all(
        response.data.map(async (recipe) => {
          try {
            const detailsResponse = await axios.get(`/recipes/${recipe.id}`);
            return detailsResponse.data;
          } catch (error) {
            console.error(`Error getting details for recipe ${recipe.id}:`, error);
            return recipe;
          }
        })
      );
      commit('SET_LAST_VIEWED', lastViewedWithDetails);
      return { data: lastViewedWithDetails };
    } catch (error) {
      console.error('Error getting last viewed recipes:', error);
      commit('SET_LAST_VIEWED', []);
      return { data: [] };
    }
  },

  async recordRecipeView(_, recipeId) {
    try {
      await axios.post(`/recipes/${recipeId}/view`);
    } catch (error) {
      console.error('Error recording recipe view:', error);
    }
  },

  async addToFavorites({ commit }, recipe) {
    try {
      await axios.post('/users/favorites', { recipeId: recipe.id });
      commit('ADD_TO_FAVORITES', recipe);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFromFavorites({ commit }, recipeId) {
    try {
      await axios.delete(`/users/favorites/${recipeId}`);
      commit('REMOVE_FROM_FAVORITES', recipeId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  async getFavorites({ commit }) {
    try {
      const response = await axios.get('/users/favorites');
      // Get full details for each favorite recipe
      const favoritesWithDetails = await Promise.all(
        response.data.map(async (recipe) => {
          try {
            const detailsResponse = await axios.get(`/recipes/${recipe.id}`);
            return detailsResponse.data;
          } catch (error) {
            console.error(`Error getting details for recipe ${recipe.id}:`, error);
            return recipe;
          }
        })
      );
      commit('SET_FAVORITES', favoritesWithDetails);
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
  },

  updateFilters({ commit }, filters) {
    commit('SET_FILTERS', filters);
  },

  toggleRecipeStep({ commit }, { recipeId, stepNumber }) {
    commit('TOGGLE_RECIPE_STEP', { recipeId, stepNumber });
  },
  
  resetRecipeProgress({ commit }, recipeId) {
    commit('SET_RECIPE_PROGRESS', { recipeId, completedSteps: [] });
  },

  async checkRecipeViewed({ commit }, recipeId) {
    try {
      const response = await axios.get(`/recipes/${recipeId}/viewed`);
      if (response.data.viewed) {
        commit('SET_VIEWED_RECIPE', recipeId);
      }
      return response.data.viewed;
    } catch (error) {
      console.error('Error checking recipe viewed status:', error);
      return false;
    }
  },

  async checkRecipesViewed({ dispatch }, recipeIds) {
    const viewedPromises = recipeIds.map(id => dispatch('checkRecipeViewed', id));
    await Promise.all(viewedPromises);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 