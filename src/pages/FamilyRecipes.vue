<template>
  <div class="family-recipes">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Family Recipes</h1>
        <button
          class="btn btn-primary"
          @click="showAddModal = true"
          v-if="isLoggedIn"
        >
          <i class="bi bi-plus-lg"></i> Add Family Recipe
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="familyRecipes.length === 0" class="text-center py-5">
        <h3>No family recipes yet</h3>
        <p class="text-muted mb-4">
          Start adding your family's favorite recipes to share with others.
        </p>
      </div>

      <!-- Recipes Grid -->
      <div v-else class="recipes-grid">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="recipe in familyRecipes" :key="recipe.id" class="col">
            <div class="card h-100">
              <img
                :src="recipe.image"
                :alt="recipe.title"
                class="card-img-top"
                style="height: 200px; object-fit: cover;"
              />
              <div class="card-body">
                <h5 class="card-title">{{ recipe.title }}</h5>
                <p class="card-text text-muted">
                  <small>
                    <i class="bi bi-person"></i> {{ recipe.owner }}
                    <br>
                    <i class="bi bi-clock"></i> {{ recipe.readyInMinutes }} minutes
                  </small>
                </p>
                <p class="card-text">{{ recipe.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <button
                    class="btn btn-outline-primary btn-sm"
                    @click="viewRecipe(recipe)"
                  >
                    View Details
                  </button>
                  <div v-if="isOwner(recipe)" class="btn-group">
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="editRecipe(recipe)"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="deleteRecipe(recipe.id)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Recipe Modal -->
      <div
        class="modal fade"
        :class="{ show: showAddModal }"
        tabindex="-1"
        :style="{ display: showAddModal ? 'block' : 'none' }"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ editingRecipe ? 'Edit Family Recipe' : 'Add Family Recipe' }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label class="form-label">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="recipeForm.title"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea
                    class="form-control"
                    v-model="recipeForm.description"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">Ready In Minutes</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="recipeForm.readyInMinutes"
                      min="0"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Servings</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="recipeForm.servings"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Ingredients</label>
                  <div
                    v-for="(ingredient, index) in recipeForm.ingredients"
                    :key="index"
                    class="input-group mb-2"
                  >
                    <input
                      type="text"
                      class="form-control"
                      v-model="recipeForm.ingredients[index]"
                      placeholder="Enter ingredient"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="removeIngredient(index)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    @click="addIngredient"
                  >
                    <i class="bi bi-plus"></i> Add Ingredient
                  </button>
                </div>

                <div class="mb-3">
                  <label class="form-label">Instructions</label>
                  <div
                    v-for="(instruction, index) in recipeForm.instructions"
                    :key="index"
                    class="input-group mb-2"
                  >
                    <span class="input-group-text">{{ index + 1 }}</span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="recipeForm.instructions[index]"
                      placeholder="Enter instruction step"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="removeInstruction(index)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    @click="addInstruction"
                  >
                    <i class="bi bi-plus"></i> Add Step
                  </button>
                </div>

                <div class="mb-3">
                  <label class="form-label">Image URL</label>
                  <input
                    type="url"
                    class="form-control"
                    v-model="recipeForm.image"
                    placeholder="Enter image URL"
                    required
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="handleSubmit"
                :disabled="loading"
              >
                {{ editingRecipe ? 'Update Recipe' : 'Add Recipe' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Details Modal -->
      <div
        class="modal fade"
        :class="{ show: showDetailsModal }"
        tabindex="-1"
        :style="{ display: showDetailsModal ? 'block' : 'none' }"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ selectedRecipe?.title }}</h5>
              <button
                type="button"
                class="btn-close"
                @click="closeDetailsModal"
              ></button>
            </div>
            <div class="modal-body">
              <img
                :src="selectedRecipe?.image"
                :alt="selectedRecipe?.title"
                class="img-fluid rounded mb-3"
              />
              <p class="text-muted">
                <small>
                  <i class="bi bi-person"></i> {{ selectedRecipe?.owner }}
                  <br>
                  <i class="bi bi-clock"></i> {{ selectedRecipe?.readyInMinutes }} minutes
                  <br>
                  <i class="bi bi-people"></i> {{ selectedRecipe?.servings }} servings
                </small>
              </p>
              <p>{{ selectedRecipe?.description }}</p>

              <h6>Ingredients</h6>
              <ul class="list-group mb-3">
                <li
                  v-for="(ingredient, index) in selectedRecipe?.ingredients"
                  :key="index"
                  class="list-group-item"
                >
                  {{ ingredient }}
                </li>
              </ul>

              <h6>Instructions</h6>
              <ol class="list-group list-group-numbered">
                <li
                  v-for="(instruction, index) in selectedRecipe?.instructions"
                  :key="index"
                  class="list-group-item"
                >
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Backdrop -->
      <div
        v-if="showAddModal || showDetailsModal"
        class="modal-backdrop fade show"
        @click="closeModal"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'FamilyRecipes',
  setup() {
    const store = useStore();
    const loading = ref(true);
    const error = ref(null);
    const showAddModal = ref(false);
    const showDetailsModal = ref(false);
    const editingRecipe = ref(null);
    const selectedRecipe = ref(null);

    const recipeForm = ref({
      title: '',
      description: '',
      readyInMinutes: 30,
      servings: 4,
      ingredients: [''],
      instructions: [''],
      image: ''
    });

    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn']);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    const familyRecipes = computed(() => store.getters['recipes/familyRecipes']);

    const loadFamilyRecipes = async () => {
      loading.value = true;
      error.value = null;

      try {
        await store.dispatch('recipes/getFamilyRecipes');
      } catch (err) {
        error.value = 'Failed to load family recipes. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const isOwner = (recipe) => {
      return isLoggedIn.value && recipe.ownerId === currentUser.value.id;
    };

    const resetForm = () => {
      recipeForm.value = {
        title: '',
        description: '',
        readyInMinutes: 30,
        servings: 4,
        ingredients: [''],
        instructions: [''],
        image: ''
      };
      editingRecipe.value = null;
    };

    const closeModal = () => {
      showAddModal.value = false;
      resetForm();
    };

    const closeDetailsModal = () => {
      showDetailsModal.value = false;
      selectedRecipe.value = null;
    };

    const addIngredient = () => {
      recipeForm.value.ingredients.push('');
    };

    const removeIngredient = (index) => {
      recipeForm.value.ingredients.splice(index, 1);
    };

    const addInstruction = () => {
      recipeForm.value.instructions.push('');
    };

    const removeInstruction = (index) => {
      recipeForm.value.instructions.splice(index, 1);
    };

    const handleSubmit = async () => {
      try {
        if (editingRecipe.value) {
          await store.dispatch('recipes/updateFamilyRecipe', {
            id: editingRecipe.value.id,
            ...recipeForm.value
          });
        } else {
          await store.dispatch('recipes/addFamilyRecipe', recipeForm.value);
        }
        closeModal();
      } catch (err) {
        store.dispatch('setError', 'Failed to save recipe');
      }
    };

    const editRecipe = (recipe) => {
      editingRecipe.value = recipe;
      recipeForm.value = { ...recipe };
      showAddModal.value = true;
    };

    const deleteRecipe = async (recipeId) => {
      if (!confirm('Are you sure you want to delete this recipe?')) return;

      try {
        await store.dispatch('recipes/deleteFamilyRecipe', recipeId);
      } catch (err) {
        store.dispatch('setError', 'Failed to delete recipe');
      }
    };

    const viewRecipe = (recipe) => {
      selectedRecipe.value = recipe;
      showDetailsModal.value = true;
    };

    onMounted(loadFamilyRecipes);

    return {
      loading,
      error,
      showAddModal,
      showDetailsModal,
      editingRecipe,
      selectedRecipe,
      recipeForm,
      isLoggedIn,
      familyRecipes,
      isOwner,
      closeModal,
      closeDetailsModal,
      addIngredient,
      removeIngredient,
      addInstruction,
      removeInstruction,
      handleSubmit,
      editRecipe,
      deleteRecipe,
      viewRecipe
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

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.btn-group {
  opacity: 0;
  transition: opacity 0.2s;
}

.card:hover .btn-group {
  opacity: 1;
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