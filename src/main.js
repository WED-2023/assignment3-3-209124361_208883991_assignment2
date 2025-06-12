import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import axios from 'axios';
import { createToaster } from '@meforma/vue-toaster';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

// Configure axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.withCredentials = true; // Enable sending cookies with requests
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create Vue app
const app = createApp(App);

// Initialize store first
app.use(store);

// Initialize router after store
app.use(router);

// Configure toaster
const toaster = createToaster({
  position: 'top-right',
  duration: 3000
});
app.use(toaster);

// Add global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err);
  console.error('Error info:', info);
  if (store && store.dispatch) {
    store.dispatch('setError', err.message || 'An error occurred');
  }
};

// Add global properties
app.config.globalProperties.toast = function (title, content, variant = null, append = false) {
  const toastContainerId = "toast-container";
  let toastContainer = document.getElementById(toastContainerId);
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = toastContainerId;
    toastContainer.style.position = "fixed";
    toastContainer.style.top = "1rem";
    toastContainer.style.right = "1rem";
    toastContainer.style.zIndex = "1055";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${variant || 'info'} border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${title}</strong><br>${content}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  if (!append) {
    toastContainer.innerHTML = "";
  }
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// Mount app
app.mount('#app');

