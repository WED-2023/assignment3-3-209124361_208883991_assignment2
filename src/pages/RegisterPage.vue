<template>
  <div class="register-page">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Create Account</h2>
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6">
                  <FormInput
                    v-model="form.firstname"
                    label="First Name"
                    id="firstname"
                    :error="errors.firstname"
                    required
                    @blur="validateField('firstname')"
                  />
                </div>
                <div class="col-md-6">
                  <FormInput
                    v-model="form.lastname"
                    label="Last Name"
                    id="lastname"
                    :error="errors.lastname"
                    required
                    @blur="validateField('lastname')"
                  />
                </div>
              </div>

              <FormInput
                v-model="form.username"
                label="Username"
                id="username"
                :error="errors.username"
                required
                @blur="validateField('username')"
              />

              <FormInput
                v-model="form.email"
                type="email"
                label="Email"
                id="email"
                :error="errors.email"
                required
                @blur="validateField('email')"
              />

              <FormInput
                v-model="form.country"
                label="Country"
                id="country"
                :error="errors.country"
                required
                @blur="validateField('country')"
              />

              <FormInput
                v-model="form.password"
                type="password"
                label="Password"
                id="password"
                :error="errors.password"
                required
                @blur="validateField('password')"
                helpText="Password must be at least 6 characters long"
              />

              <FormInput
                v-model="form.confirmPassword"
                type="password"
                label="Confirm Password"
                id="confirmPassword"
                :error="errors.confirmPassword"
                required
                @blur="validateField('confirmPassword')"
              />

              <div class="d-grid gap-2 mt-4">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  Register
                </button>
              </div>
            </form>
            <div class="text-center mt-3">
              <p class="mb-0">
                Already have an account? 
                <router-link to="/login">Login here</router-link>
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
  name: 'RegisterPage',
  components: {
    FormInput
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoading = computed(() => store.getters.isLoading);

    const form = ref({
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      country: '',
      password: '',
      confirmPassword: ''
    });

    const errors = ref({
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      country: '',
      password: '',
      confirmPassword: ''
    });

    const validateField = (field) => {
      errors.value[field] = '';
      
      switch (field) {
        case 'firstname':
          if (!form.value.firstname) {
            errors.value.firstname = 'First name is required';
          }
          break;
        case 'lastname':
          if (!form.value.lastname) {
            errors.value.lastname = 'Last name is required';
          }
          break;
        case 'username':
          if (!form.value.username) {
            errors.value.username = 'Username is required';
          } else if (form.value.username.length < 3) {
            errors.value.username = 'Username must be at least 3 characters';
          }
          break;
        case 'email':
          if (!form.value.email) {
            errors.value.email = 'Email is required';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
            errors.value.email = 'Please enter a valid email address';
          }
          break;
        case 'country':
          if (!form.value.country) {
            errors.value.country = 'Country is required';
          }
          break;
        case 'password':
          if (!form.value.password) {
            errors.value.password = 'Password is required';
          } else if (form.value.password.length < 6) {
            errors.value.password = 'Password must be at least 6 characters';
          }
          break;
        case 'confirmPassword':
          if (!form.value.confirmPassword) {
            errors.value.confirmPassword = 'Please confirm your password';
          }
          break;
      }
    };

    const validateForm = () => {
      Object.keys(form.value).forEach(field => validateField(field));
      return !Object.values(errors.value).some(error => error);
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      // Validate password match
      if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match';
        return;
      }

      try {
        // Create user data without confirmPassword
        // eslint-disable-next-line no-unused-vars
        const { confirmPassword, ...userData } = form.value;
        await store.dispatch('auth/register', userData);
        router.push('/login');
      } catch (error) {
        store.dispatch('setError', error.message || 'Registration failed');
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
.register-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.card {
  border: none;
  border-radius: 1rem;
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
