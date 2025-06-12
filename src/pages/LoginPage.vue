<template>
  <div class="login-page">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-10 col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Login</h2>
            <form @submit.prevent="handleSubmit">
              <FormInput
                v-model="form.username"
                label="Username"
                id="username"
                :error="errors.username"
                required
                @blur="validateField('username')"
              />
              <FormInput
                v-model="form.password"
                type="password"
                label="Password"
                id="password"
                :error="errors.password"
                required
                @blur="validateField('password')"
              />
              <div class="d-grid gap-2 mt-4">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  Login
                </button>
              </div>
            </form>
            <div class="text-center mt-3">
              <p class="mb-0">
                Don't have an account? 
                <router-link to="/register">Register here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import FormInput from '@/components/common/FormInput.vue';

export default {
  name: 'LoginPage',
  components: {
    FormInput
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoading = computed(() => store.getters.isLoading);

    const form = ref({
      username: '',
      password: ''
    });

    const errors = ref({
      username: '',
      password: ''
    });

    const validateField = (field) => {
      errors.value[field] = '';
      
      switch (field) {
        case 'username':
          if (!form.value.username) {
            errors.value.username = 'Username is required';
          }
          break;
        case 'password':
          if (!form.value.password) {
            errors.value.password = 'Password is required';
          }
          break;
      }
    };

    const validateForm = () => {
      validateField('username');
      validateField('password');
      return !Object.values(errors.value).some(error => error);
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        const redirectPath = router.currentRoute.value.query.redirect || '/';
        await store.dispatch('auth/login', {
          credentials: form.value,
          redirectPath
        });
      } catch (error) {
        store.dispatch('setError', error.message || 'Login failed');
      }
    };

    return {
      form,
      errors,
      isLoading,
      validateField,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  margin-top: -5rem;
}

.card {
  border: none;
  border-radius: 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.card-body {
  padding: 2rem;
}

h2 {
  color: #333;
  font-weight: 600;
}

.btn-primary {
  padding: 0.75rem;
  font-weight: 500;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
}
</style>
