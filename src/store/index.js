import { createStore } from 'vuex';
import auth from './modules/auth';
import recipes from './modules/recipes';
import user from './modules/user';

const store = createStore({
  modules: {
    auth,
    recipes,
    user
  },
  state: {
    loading: false,
    error: null
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading);
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error);
    },
    clearError({ commit }) {
      commit('SET_ERROR', null);
    }
  },
  getters: {
    isLoading: state => state.loading,
    error: state => state.error
  }
});

export default store;
