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
      const response = await axios.post('/login', credentials);
      if (response.data.success) {
        const { token, user } = response.data;
        commit('SET_USER', user);
        commit('SET_TOKEN', token);
        return user;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  async register(_, userData) {
    const response = await axios.post('/register', userData);
    return response.data;
  },

  async logout({ commit }) {
    await axios.post('/logout');
    commit('SET_USER', null);
    commit('SET_TOKEN', null);
  },

  async fetchUser({ commit }) {
    try {
      if (!state.token) {
        commit('SET_USER', null);
        return null;
      }

      const response = await axios.get('/user');
      commit('SET_USER', response.data);
      return response.data;
    } catch (error) {
      commit('SET_USER', null);
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
