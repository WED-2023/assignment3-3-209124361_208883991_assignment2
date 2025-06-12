import axios from 'axios';
import router from '@/router';

const state = {
  user: null,
  redirectPath: null,
  isInitialized: false
};

const getters = {
  isLoggedIn: state => !!state.user,
  currentUser: state => state.user,
  redirectPath: state => state.redirectPath,
  isInitialized: state => state.isInitialized
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_REDIRECT_PATH(state, path) {
    state.redirectPath = path;
  },
  SET_INITIALIZED(state, value) {
    state.isInitialized = value;
  }
};

const actions = {
  async login({ commit }, { credentials, redirectPath }) {
    try {
      const response = await axios.post('/login', credentials);
      if (response.data.success) {
        const { user } = response.data;
        commit('SET_USER', user);
        commit('SET_REDIRECT_PATH', redirectPath);
        
        // Navigate to the redirect path or home
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push('/');
        }
        return user;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  async register(_, { userData, redirectPath }) {
    try {
      const response = await axios.post('/register', userData);
      if (response.data.success) {
        // After successful registration, automatically log in the user
        await this.dispatch('auth/login', { 
          credentials: {
            username: userData.username,
            password: userData.password
          },
          redirectPath
        });
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  async logout({ commit }) {
    try {
      await axios.post('/logout');
      commit('SET_USER', null);
      commit('SET_REDIRECT_PATH', null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the user state even if the server request fails
      commit('SET_USER', null);
      commit('SET_REDIRECT_PATH', null);
      router.push('/');
    }
  },

  async fetchUser({ commit }) {
    try {
      const response = await axios.get('/user');
      commit('SET_USER', response.data);
      commit('SET_INITIALIZED', true);
      return response.data;
    } catch (error) {
      // If we get a 404, it means there's no active session
      if (error.response?.status === 404) {
        commit('SET_USER', null);
      } else {
        console.error('Error fetching user:', error);
      }
      commit('SET_INITIALIZED', true);
      return null;
    }
  },

  async updateProfile({ commit }, profileData) {
    const response = await axios.put('/api/auth/profile', profileData);
    commit('SET_USER', response.data);
    return response.data;
  },

  async updateSettings({ commit }, settings) {
    const response = await axios.put('/api/auth/settings', settings);
    commit('SET_USER', response.data);
    return response.data;
  },

  async updatePreferences({ commit }, preferences) {
    const response = await axios.put('/api/auth/preferences', preferences);
    commit('SET_USER', response.data);
    return response.data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
