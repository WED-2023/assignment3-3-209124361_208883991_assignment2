<template>
  <div class="not-found">
    <div class="container text-center py-5">
      <h1 class="display-1 text-muted mb-4">404</h1>
      <h2 class="mb-4">Page Not Found</h2>
      <p class="lead text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <router-link to="/" class="btn btn-primary btn-lg">
        <i class="bi bi-house"></i> Go Home
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style scoped>
.not-found {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.display-1 {
  font-size: 8rem;
  font-weight: 700;
  color: #e9ecef;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-lg {
  padding: 0.75rem 2rem;
  font-weight: 500;
}
</style> 