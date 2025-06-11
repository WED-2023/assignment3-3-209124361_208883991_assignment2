import axios from 'axios';

const state = {
  recipes: [],
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  lastViewed: [],
  currentRecipe: null,
  filters: {
    query: '',
    cuisines: [],
    diets: [],
    intolerances: []
  }
};

const getters = {
  allRecipes: state => state.recipes,
  favoriteRecipes: state => state.favorites,
  lastViewedRecipes: state => state.lastViewed,
  currentRecipe: state => state.currentRecipe,
  filters: state => state.filters,
  isFavorite: state => recipeId => state.favorites.some(recipe => recipe.id === recipeId)
};

const mutations = {
  SET_RECIPES(state, recipes) {
    state.recipes = recipes;
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
    state.lastViewed = recipes;
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters };
  }
};

const actions = {
  async searchRecipes({ commit, state }, { query, cuisines, diets, intolerances, limit = 5, sort }) {
    try {
      const response = await axios.get('/recipes/search', {
        params: {
          query,
          cuisines: cuisines.join(','),
          diets: diets.join(','),
          intolerances: intolerances.join(','),
          limit,
          sort
        }
      });
      commit('SET_RECIPES', response.data);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getRandomRecipes({ commit }, { number = 5, tags = '' }) {
    try {
      const response = await axios.get('/recipes/random', {
        params: { number, tags }
      });
      commit('SET_RECIPES', response.data);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getRecipeDetails({ commit }, recipeId) {
    try {
      const response = await axios.get(`/recipes/${recipeId}`);
      commit('SET_CURRENT_RECIPE', response.data);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getLastViewed({ commit }, userId) {
    try {
      const response = await axios.get(`/recipes/${userId}/search/last`);
      commit('SET_LAST_VIEWED', response.data);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async recordRecipeView({ commit }, recipeId) {
    try {
      await axios.post(`/recipes/${recipeId}/view`);
    } catch (error) {
      console.error('Error recording recipe view:', error);
    }
  },

  addToFavorites({ commit }, recipe) {
    commit('ADD_TO_FAVORITES', recipe);
  },

  removeFromFavorites({ commit }, recipeId) {
    commit('REMOVE_FROM_FAVORITES', recipeId);
  },

  updateFilters({ commit }, filters) {
    commit('SET_FILTERS', filters);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 