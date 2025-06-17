async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    console.log('API Response:', recipe_info.data);
    let { 
        id, 
        title, 
        readyInMinutes, 
        image, 
        aggregateLikes, 
        vegan, 
        vegetarian, 
        glutenFree,
        servings,
        instructions,
        analyzedInstructions,
        extendedIngredients
    } = recipe_info.data;

    const recipe = {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        aggregateLikes: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings: servings,
        instructions: instructions,
        analyzedInstructions: analyzedInstructions,
        ingredients: extendedIngredients
    };
    console.log('Processed Recipe:', recipe);
    return recipe;
}

async function getRecipesPreview(recipes_id_array) {
    let recipes_info = [];
    for (let recipe_id of recipes_id_array) {
        try {
            const recipe_info = await getRecipeDetails(recipe_id);
            recipes_info.push(recipe_info);
        } catch (error) {
            console.log("Error getting recipe details:", error);
        }
    }
    console.log('Final Recipes Array:', recipes_info);
    return recipes_info;
} 