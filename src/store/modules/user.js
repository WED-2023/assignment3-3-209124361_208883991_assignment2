import axios from 'axios';

const state = {
  profile: null,
  preferences: null,
  settings: null
};

const getters = {
  userProfile: state => state.profile,
  userPreferences: state => state.preferences,
  userSettings: state => state.settings
};

const mutations = {
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
  SET_PREFERENCES(state, preferences) {
    state.preferences = preferences;
  },
  SET_SETTINGS(state, settings) {
    state.settings = settings;
  }
};

const actions = {
  async fetchProfile({ commit }) {
    try {
      const response = await axios.get('/api/user/profile');
      commit('SET_PROFILE', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user profile';
    }
  },

  async updateProfile({ commit }, profileData) {
    try {
      const response = await axios.put('/api/user/profile', profileData);
      commit('SET_PROFILE', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  async fetchPreferences({ commit }) {
    try {
      const response = await axios.get('/api/user/preferences');
      commit('SET_PREFERENCES', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch preferences';
    }
  },

  async updatePreferences({ commit }, preferences) {
    try {
      const response = await axios.put('/api/user/preferences', preferences);
      commit('SET_PREFERENCES', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update preferences';
    }
  },

  async fetchSettings({ commit }) {
    try {
      const response = await axios.get('/api/user/settings');
      commit('SET_SETTINGS', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch settings';
    }
  },

  async updateSettings({ commit }, settings) {
    try {
      const response = await axios.put('/api/user/settings', settings);
      commit('SET_SETTINGS', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update settings';
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