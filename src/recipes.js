import uuidv4 from 'uuid/v4'
import moment from 'moment'

let recipes = []

const loadRecipes = () => {
    const recipesJSON = localStorage.getItem('recipes')

    try {
        return recipesJSON ? JSON.parse(recipesJSON) : []
    } catch (e) {
        return []
    }
}

const saveRecipes = () => {
    localStorage.setItem('recipes', JSON.stringify(recipes))
}

const getRecipes = () => recipes

const createRecipe = () => {
    const id = uuidv4()
    const timestamp = moment().valueOf()

    recipes.push({
        id,
        title: '',
        steps: [],
        ingredients: [],
        createdAt: timestamp,
        updatedAt: timestamp,
        fav: false,
        archived: false
    })
    saveRecipes()

    return id
}


const updateRecipe = (id, updates) => {
    const recipe = recipes.find((recipe) => recipe.id === id)

    if (!recipe) {
        return
    }

    console.log(updates)
    
    if (typeof updates.fav === 'boolean') {
        recipe.fav = updates.fav
        recipe.updatedAt = moment().valueOf()
    }
    
    if (typeof updates.archived === 'boolean') {
        recipe.archived = updates.archived
        recipe.updatedAt = moment().valueOf()
    }

    if (typeof updates.title === 'string') {
        recipe.title = updates.title
        recipe.updatedAt = moment().valueOf()
    }

    if (updates.step !== undefined) {
        recipe.steps.push({
            stepId: updates.step.stepId,
            number: updates.step.number,
            process: updates.step.process
            
        })
        recipe.updatedAt = moment().valueOf()
    }

    if (updates.ingredients !== undefined ) {
        recipe.ingredients.push({
            ingredientId: updates.ingredients.ingredientId,
            ingredient: updates.ingredients.ingredient,
            availability: updates.ingredients.availability
        })
        recipe.updatedAt = moment().valueOf()
    }

    saveRecipes()
    return recipe
}

const updateStep = (id, stepId, updates) => {
    const recipe = recipes.find((recipe) => recipe.id === id) 
    const step = recipe.steps.find((step) => step.stepId === stepId)
    
    if (!step) {
        return
    }

    if (typeof updates.process === 'string') {
        step.process = updates.process
        recipe.updatedAt = moment().valueOf()
    }

    saveRecipes()
}

const updateIngredient = (id, ingredientId, updates) => {
    const recipe = recipes.find((recipe) => recipe.id === id) 
    const ingredient = recipe.ingredients.find((ingredient) => ingredient.ingredientId === ingredientId)
    
    if (!ingredient) {
        return
    }

    if (typeof updates.availability === 'boolean') {
        ingredient.availability = updates.availability
        recipe.updatedAt = moment().valueOf()
    }

    if (typeof updates.ingredient === 'string') {
        ingredient.ingredient = updates.ingredient
        recipe.updatedAt = moment().valueOf()
    }

    saveRecipes()
}

const deleteRecipe = (id) => {
    const recipeIndex = recipes.findIndex((recipe) => recipe.id === id)

    if (recipeIndex > -1) {
        recipes.splice(recipeIndex, 1)
        saveRecipes()
    }
}

const sortRecipes = (sortBy) => {
    if (sortBy === 'byCreated') {
        return recipes.sort((a,b) => a.createdAt < b.createdAt )
    } else if (sortBy === 'alphabetically') {
        return recipes.sort((a,b) => a.title > b.title) 
    } else if (sortBy === 'byEdited'){
        return recipes.sort((a,b) => a.updatedAt < b.updatedAt)
    } else {
        return recipes
    }
}

const filterStatus = (filter, recipes) => {
    if (filter === 'byFavorited') {
        return recipes.filter((recipe) => recipe.fav)
    } else if (filter === 'byArchived') {
        return recipes.filter((recipe) => recipe.archived)
    } else if (filter === 'byAll') {
        return recipes.filter((recipe) => !recipe.archived)
    } else {
        return recipes
    }
}

const filterSearch = (searchText, recipes) => {
    if (searchText.length > 0) {
        return recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchText.toLowerCase().trim()))
    } else {
        return recipes
    }
}

recipes = loadRecipes()

export { 
    updateRecipe, 
    createRecipe, 
    getRecipes, 
    saveRecipes, 
    deleteRecipe, 
    sortRecipes, 
    filterStatus, 
    filterSearch, 
    updateStep, 
    updateIngredient 
}