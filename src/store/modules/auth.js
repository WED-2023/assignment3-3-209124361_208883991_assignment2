import axios from 'axios';

const state = {
  user: null,
  token: localStorage.getItem('token') || null
};

const getters = {
  isLoggedIn: state => !!state.token,
  currentUser: state => state.user
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
};

const actions = {
  async login({ commit }, credentials) {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { token, user } = response.data;
      commit('SET_USER', user);
      commit('SET_TOKEN', token);
      return user;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  async register({ commit }, userData) {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  async logout({ commit }) {
    try {
      await axios.post('/auth/logout');
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async fetchUser({ commit }) {
    try {
      const response = await axios.get('/auth/user');
      commit('SET_USER', response.data);
      return response.data;
    } catch (error) {
      commit('SET_USER', null);
      throw error.response?.data?.message || 'Failed to fetch user data';
    }
  },

  async updateProfile({ commit }, profileData) {
    try {
      const response = await axios.put('/auth/profile', profileData);
      commit('SET_USER', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  async updateSettings({ commit }, settings) {
    try {
      const response = await axios.put('/auth/settings', settings);
      commit('SET_USER', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update settings';
    }
  },

  async updatePreferences({ commit }, preferences) {
    try {
      const response = await axios.put('/auth/preferences', preferences);
      commit('SET_USER', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update preferences';
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}; 