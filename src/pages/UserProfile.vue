<template>
  <div class="user-profile">
    <div class="container">
      <div class="row">
        <!-- Profile Sidebar -->
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <div class="profile-image mb-3">
                <img
                  :src="user.avatar || '/images/default-avatar.png'"
                  :alt="user.firstname"
                  class="rounded-circle"
                  style="width: 150px; height: 150px; object-fit: cover;"
                />
              </div>
              <h3 class="mb-1">{{ user.firstname }} {{ user.lastname }}</h3>
              <p class="text-muted mb-3">@{{ user.username }}</p>
              <div class="d-grid">
                <button
                  class="btn btn-outline-primary"
                  @click="showEditProfile = true"
                >
                  <i class="bi bi-pencil"></i> Edit Profile
                </button>
              </div>
            </div>
          </div>

          <!-- Stats Card -->
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Your Stats</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Saved Recipes
                  <span class="badge bg-primary rounded-pill">
                    {{ favoriteRecipes.length }}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Family Recipes
                  <span class="badge bg-primary rounded-pill">
                    {{ familyRecipes.length }}
                  </span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Recently Viewed
                  <span class="badge bg-primary rounded-pill">
                    {{ lastViewedRecipes.length }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col-md-8">
          <!-- Account Settings -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Account Settings</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateSettings">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="settings.email"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Country</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="settings.country"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="settings.password"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="settings.confirmPassword"
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Preferences -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Preferences</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="updatePreferences">
                <div class="mb-3">
                  <label class="form-label">Default Diet</label>
                  <select class="form-select" v-model="preferences.defaultDiet">
                    <option value="">No Preference</option>
                    <option v-for="diet in diets" :key="diet" :value="diet">
                      {{ diet }}
                    </option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Intolerances</label>
                  <div class="row">
                    <div
                      v-for="intolerance in intolerances"
                      :key="intolerance"
                      class="col-md-4 mb-2"
                    >
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :value="intolerance"
                          v-model="preferences.intolerances"
                          :id="'intolerance-' + intolerance"
                        />
                        <label class="form-check-label" :for="'intolerance-' + intolerance">
                          {{ intolerance }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Max Ready Time (minutes)</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="preferences.maxReadyTime"
                    min="0"
                    step="5"
                  />
                </div>

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div
        class="modal fade"
        :class="{ show: showEditProfile }"
        tabindex="-1"
        :style="{ display: showEditProfile ? 'block' : 'none' }"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Profile</h5>
              <button
                type="button"
                class="btn-close"
                @click="showEditProfile = false"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateProfile">
                <div class="mb-3">
                  <label class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="profile.firstname"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="profile.lastname"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="profile.username"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Avatar URL</label>
                  <input
                    type="url"
                    class="form-control"
                    v-model="profile.avatar"
                    placeholder="Enter image URL"
                  />
                </div>

                <div class="d-grid">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Backdrop -->
      <div
        v-if="showEditProfile"
        class="modal-backdrop fade show"
        @click="showEditProfile = false"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'UserProfile',
  setup() {
    const store = useStore();
    const loading = ref(false);
    const showEditProfile = ref(false);

    const user = computed(() => store.getters['auth/currentUser']);
    const favoriteRecipes = computed(() => store.getters['recipes/favoriteRecipes']);
    const familyRecipes = computed(() => store.getters['recipes/familyRecipes']);
    const lastViewedRecipes = computed(() => store.getters['recipes/lastViewedRecipes']);

    const settings = ref({
      email: user.value?.email || '',
      country: user.value?.country || '',
      password: '',
      confirmPassword: ''
    });

    const preferences = ref({
      defaultDiet: '',
      intolerances: [],
      maxReadyTime: 60
    });

    const profile = ref({
      firstname: user.value?.firstname || '',
      lastname: user.value?.lastname || '',
      username: user.value?.username || '',
      avatar: user.value?.avatar || ''
    });

    const diets = [
      'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
      'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30'
    ];

    const intolerances = [
      'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame',
      'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
    ];

    const updateSettings = async () => {
      if (settings.value.password && settings.value.password !== settings.value.confirmPassword) {
        store.dispatch('setError', 'Passwords do not match');
        return;
      }

      loading.value = true;
      try {
        await store.dispatch('auth/updateSettings', settings.value);
        store.dispatch('setSuccess', 'Settings updated successfully');
      } catch (error) {
        store.dispatch('setError', error.message || 'Failed to update settings');
      } finally {
        loading.value = false;
      }
    };

    const updatePreferences = async () => {
      loading.value = true;
      try {
        await store.dispatch('auth/updatePreferences', preferences.value);
        store.dispatch('setSuccess', 'Preferences updated successfully');
      } catch (error) {
        store.dispatch('setError', error.message || 'Failed to update preferences');
      } finally {
        loading.value = false;
      }
    };

    const updateProfile = async () => {
      loading.value = true;
      try {
        await store.dispatch('auth/updateProfile', profile.value);
        store.dispatch('setSuccess', 'Profile updated successfully');
        showEditProfile.value = false;
      } catch (error) {
        store.dispatch('setError', error.message || 'Failed to update profile');
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      try {
        await Promise.all([
          store.dispatch('recipes/getFavorites'),
          store.dispatch('recipes/getFamilyRecipes'),
          store.dispatch('recipes/getLastViewed')
        ]);
      } catch (error) {
        store.dispatch('setError', 'Failed to load user data');
      }
    });

    return {
      loading,
      showEditProfile,
      user,
      settings,
      preferences,
      profile,
      favoriteRecipes,
      familyRecipes,
      lastViewedRecipes,
      diets,
      intolerances,
      updateSettings,
      updatePreferences,
      updateProfile
    };
  }
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.profile-image img {
  border: 3px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.list-group-item {
  border-left: none;
  border-right: none;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:last-child {
  border-bottom: none;
}
</style> 