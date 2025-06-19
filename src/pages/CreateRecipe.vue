<template>
  <div class="create-recipe">
    <h1>Create New Recipe</h1>
    <div class="recipe-form">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="recipeName" class="form-label">Recipe Name</label>
          <input
            type="text"
            class="form-control"
            id="recipeName"
            v-model="recipe.name"
            required
          >
        </div>

        <div class="mb-3">
          <label for="recipeDescription" class="form-label">Description</label>
          <textarea
            class="form-control"
            id="recipeDescription"
            v-model="recipe.description"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="recipeImage" class="form-label">Image (optional)</label>
          <input
            type="file"
            class="form-control"
            id="recipeImage"
            accept="image/*"
            @change="onImageChange"
          >
        </div>

        <div class="mb-3">
          <label for="recipeTime" class="form-label">Preparation Time (minutes)</label>
          <input
            type="number"
            class="form-control"
            id="recipeTime"
            v-model="recipe.time"
            min="1"
            required
          >
        </div>

        <div class="mb-3">
          <label for="recipeServings" class="form-label">Number of Servings</label>
          <input
            type="number"
            class="form-control"
            id="recipeServings"
            v-model="recipe.servings"
            min="1"
            required
          >
        </div>

        <div class="mb-3">
          <label for="recipeIngredients" class="form-label">Ingredients</label>
          <textarea
            class="form-control"
            id="recipeIngredients"
            v-model="recipe.ingredients"
            rows="5"
            placeholder="Enter ingredients, one per line"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="recipeInstructions" class="form-label">Instructions</label>
          <textarea
            class="form-control"
            id="recipeInstructions"
            v-model="recipe.instructions"
            rows="5"
            placeholder="Enter cooking instructions"
            required
          ></textarea>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">
            <i class="bi bi-save"></i> Save Recipe
          </button>
          <button type="button" class="btn btn-secondary" @click="goBack">
            <i class="bi bi-x-circle"></i> Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserRecipe } from '../services/userRecipes';

export default {
  name: 'CreateRecipe',
  setup() {
    const router = useRouter();
    const recipe = ref({
      name: '',
      description: '',
      time: '',
      servings: '',
      ingredients: '',
      instructions: ''
    });
    const imageFile = ref(null);

    const onImageChange = (e) => {
      const file = e.target.files[0];
      imageFile.value = file || null;
    };

    const handleSubmit = async () => {
      try {
        let photos = [];
        if (imageFile.value) {
          photos = [await toBase64(imageFile.value)];
        }
        const payload = {
          title: recipe.value.name,
          description: recipe.value.description,
          ingredients: recipe.value.ingredients.split('\n').filter(Boolean),
          instructions: recipe.value.instructions.split('\n').filter(Boolean),
          photos
        };
        await createUserRecipe(payload);
        router.push('/my-recipes');
      } catch (error) {
        console.error('Failed to create recipe:', error);
      }
    };

    function toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    const goBack = () => {
      router.back();
    };

    return {
      recipe,
      handleSubmit,
      goBack,
      onImageChange
    };
  }
};
</script>

<style scoped>
.create-recipe {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.recipe-form {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: 500;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style> 