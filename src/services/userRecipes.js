import axios from 'axios';

export async function createUserRecipe(recipe) {
  return axios.post('/userRecipes', recipe, { withCredentials: true });
}

export async function getUserRecipes() {
  return axios.get('/userRecipes', { withCredentials: true });
} 