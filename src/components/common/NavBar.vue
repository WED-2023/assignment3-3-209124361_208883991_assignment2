<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">Recipe App</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/search">Search Recipes</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/my-recipes">My Recipes</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/family-recipes">Family Recipes</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'NavBar',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isInitialized = ref(false);

    // Initialize auth state if needed
    onMounted(async () => {
      try {
        // Only try to fetch user if we have a token
        const token = localStorage.getItem('token');
        if (token) {
          await store.dispatch('auth/fetchUser');
        }
        isInitialized.value = true;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        isInitialized.value = true; // Still mark as initialized even if there's an error
      }
    });

    const isLoggedIn = computed(() => {
      if (!isInitialized.value) return false;
      try {
        return store.state.auth?.token != null;
      } catch (error) {
        return false;
      }
    });

    const logout = async () => {
      try {
        await store.dispatch('auth/logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    return {
      isLoggedIn,
      logout
    };
  }
};
</script>

<style scoped>
.navbar {
  margin-bottom: 2rem;
}

.nav-link {
  cursor: pointer;
}

.nav-link.router-link-active {
  font-weight: bold;
}
</style> 