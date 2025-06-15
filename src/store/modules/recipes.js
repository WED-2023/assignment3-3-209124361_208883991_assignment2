import axios from 'axios';

const state = {
  recipes: [],
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
  }
};

const getters = {
  allRecipes: state => state.recipes || [],
  favoriteRecipes: state => state.favorites || [],
  lastViewedRecipes: state => state.lastViewed || [],
  familyRecipes: state => state.familyRecipes || [],
  currentRecipe: state => state.currentRecipe,
  filters: state => state.filters,
  totalRecipes: state => state.totalResults,
  isFavorite: state => recipeId => (state.favorites || []).some(recipe => recipe.id === recipeId)
};

const mutations = {
  SET_RECIPES(state, recipes) {
    state.recipes = recipes || [];
  },
  SET_TOTAL_RESULTS(state, total) {
    state.totalResults = total;
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
      commit('SET_RECIPES', response.data);
      return response;
    } catch (error) {
      console.error('Error getting random recipes:', error);
      commit('SET_RECIPES', []);
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
      commit('SET_LAST_VIEWED', response.data);
      return response;
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
      commit('SET_FAVORITES', response.data);
    } catch (error) {
      console.error('Error getting favorites:', error);
      throw error;
    }
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