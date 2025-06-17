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
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/create-recipe">
              <i class="bi bi-plus-circle"></i> New Recipe
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <span class="nav-link text-light">Hello Guest</span>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="personalAreaDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i> {{ username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="personalAreaDropdown">
                <li>
                  <router-link class="dropdown-item" to="/my-recipes">
                    <i class="bi bi-journal-text"></i> My Recipes
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/favorites">
                    <i class="bi bi-heart"></i> Favorites
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/family-recipes">
                    <i class="bi bi-people"></i> Family Recipes
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">
                    <i class="bi bi-box-arrow-right"></i> Logout
                  </a>
                </li>
              </ul>
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
        if (!store.getters['auth/isInitialized']) {
          await store.dispatch('auth/fetchUser');
        }
        isInitialized.value = true;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        isInitialized.value = true;
      }
    });

    const isLoggedIn = computed(() => {
      if (!isInitialized.value) return false;
      return store.getters['auth/isLoggedIn'];
    });

    const username = computed(() => {
      return store.getters['auth/username'] || 'User';
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
      username,
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

.dropdown-menu {
  min-width: 200px;
}

.dropdown-item {
  padding: 0.5rem 1rem;
}

.dropdown-item i {
  margin-right: 0.5rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item:active {
  background-color: #0d6efd;
}
</style> 