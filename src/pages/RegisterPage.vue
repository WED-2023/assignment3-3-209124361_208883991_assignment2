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

              <div class="mb-3">
                <label for="country" class="form-label">Country</label>
                <select
                  v-model="form.country"
                  class="form-select"
                  id="country"
                  :class="{ 'is-invalid': errors.country }"
                  required
                  @blur="validateField('country')"
                  :disabled="isCountriesLoading"
                >
                  <option value="">
                    {{ isCountriesLoading ? 'Loading countries...' : 'Select a country' }}
                  </option>
                  <option
                    v-for="country in countries"
                    :key="country.cca3"
                    :value="country.name.common"
                  >
                    {{ country.name.common }}
                  </option>
                </select>
                <div v-if="errors.country" class="invalid-feedback">
                  {{ errors.country }}
                </div>
                <div v-if="isCountriesLoading" class="form-text">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Loading countries...
                </div>
              </div>

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
                  :disabled="isLoading || isCountriesLoading"
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import FormInput from '@/components/common/FormInput.vue';
import axios from 'axios';

export default {
  name: 'RegisterPage',
  components: {
    FormInput
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoading = computed(() => store.getters.isLoading);
    const isCountriesLoading = ref(true);
    const countries = ref([]);

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

const fetchCountries = async () => {
  try {
    isCountriesLoading.value = true;
    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca3');
    countries.value = response.data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );
  } catch (error) {
    console.error('Error fetching countries:', error);
    store.dispatch('setError', 'Failed to load countries. Please try again later.');
    countries.value = [];
  } finally {
    isCountriesLoading.value = false;
  }
};


    onMounted(async () => {
      await fetchCountries();
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
        const redirectPath = router.currentRoute.value.query.redirect || '/';
        await store.dispatch('auth/register', {
          userData,
          redirectPath
        });
      } catch (error) {
        store.dispatch('setError', error.message || 'Registration failed');
      }
    };

    return {
      form,
      errors,
      isLoading,
      isCountriesLoading,
      countries,
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

.form-select {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ced4da;
}

.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-select.is-invalid {
  border-color: #dc3545;
}

.form-select.is-invalid:focus {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
</style>
