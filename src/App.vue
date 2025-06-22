<template>
  <div class="app">
    <NavBar />
    <main class="container py-4">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Global Error Toast -->
    <div v-if="error" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
      <div class="toast align-items-center text-bg-danger border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ error }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="clearError" aria-label="Close"></button>
        </div>
      </div>
    </div>
    
    <footer class="footer mt-auto py-3 bg-light">
      <div class="container text-center">
        <span class="text-muted">© 2024 Recipe App. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import NavBar from '@/components/common/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  },
  setup() {
    const store = useStore();
    const error = computed(() => store.getters.error);
    
    const clearError = () => {
      store.dispatch('clearError');
    };
    
    // Auto-hide error after 5 seconds
    watch(error, (newError) => {
      if (newError) {
        setTimeout(() => {
          clearError();
        }, 5000);
      }
    });
    
    return {
      error,
      clearError
    };
  }
};
</script>

<style>
/* Import Bootstrap CSS */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* Base styles */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1 0 auto;
  padding: 2rem 0;
  padding-top: 72px; /* Add space for sticky navbar (56px + margin) */
}

.footer {
  flex-shrink: 0;
  background-color: #f8f9fa;
  padding: 1rem 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  padding: 0 1rem;
}

.btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
  transform: translateY(-1px);
}

.card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-control:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Toast styles */
.toast-container {
  z-index: 1055;
}

.toast {
  animation: slideInRight 0.3s ease-out;
}

.toast.show {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast.fade {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
