import { 
    deleteRecipe, 
    getRecipes, 
    saveRecipes, 
    sortRecipes, 
    filterStatus, 
    filterSearch, 
    filterRecipes, 
    updateRecipe,
    updateStep, 
    updateIngredient 
} from './recipes'
import { getFilters } from './filters'

const recipeId = location.hash.substring('1')


// ---- Generate recipes at /index.html

const generateRecipeDOM = (recipe) => {
    const recipeElement = document.createElement('div')
          recipeElement.classList.add('recipe-item')

    const recipeE1 = document.createElement('a')
          recipeE1.setAttribute('href', `/edit.html#${recipe.id}`)    // Setup the link
          recipeE1.classList.add('recipe-item__link')
    const recipeTitle = document.createElement('h3')
          recipeTitle.classList.add('recipe-item__title')
    const recipeDescription = document.createElement('p')
          recipeDescription.classList.add('recipe-item__description')
    const recipeStatus = document.createElement('p')
          recipeStatus.classList.add('recipe-item__status')

    const deleteRecipeButton = document.createElement('button')     
          deleteRecipeButton.textContent = 'x'
          deleteRecipeButton.classList.add('button--delete-small', 'button--delete-small--home')

    // Setup reciple title text
    if (recipe.title.length > 0) {
        recipeTitle.textContent = recipe.title
    } else {
        recipeTitle.textContent = '-- untitled recipe --'
    }
    recipeE1.appendChild(recipeTitle)

    // Setup recipe description
    let ingredientIndex = -1

    ingredientIndex = recipe.ingredients.length === 0 
        ? -2 
        : recipe.ingredients.findIndex((ingredient) => ingredient.availability === false)

    if (ingredientIndex === -1) {
        recipeDescription.textContent = `You have all ingredients. Cool!`
    } else if (ingredientIndex === -2) {
        recipeDescription.textContent = `Add some ingredients!`
    } else {
        recipeDescription.textContent = `You need some ingredients.`
    }
    recipeE1.appendChild(recipeDescription)

    // Setup recipe status
    recipe.fav === true 
        ? recipeStatus.textContent = 'Favorite Recipe'
        : recipeStatus.textContent = ''

    recipeE1.appendChild(recipeStatus)

    // Setup delete button
    deleteRecipeButton.addEventListener('click', () => {
        deleteRecipe(recipe.id)
        renderRecipes()
    })

    recipeElement.appendChild(recipeE1)
    recipeElement.appendChild(deleteRecipeButton)

    return recipeElement
}

const generateFilterDOM = () => {
    const filterStatusAll = document.querySelector('#filter-status-all')
    const filterStatusFav = document.querySelector('#filter-status-fav')
    const filterStatusArchived = document.querySelector('#filter-status-archived')

    const recipes = getRecipes()
    const recipesFav = recipes.filter((recipe) => recipe.fav).length
    const recipesArchived = recipes.filter((recipe) => recipe.archived).length

    filterStatusAll.textContent = `Show all recipes [${recipes.length}]`
    filterStatusFav.textContent = `Show favorite recipes [${recipesFav}]`
    filterStatusArchived.textContent = `Show archived recipes [${recipesArchived}]`
}

const renderRecipes = () => {
    generateFilterDOM()

    const recipesContainer = document.querySelector('#recipes-container')

    const filters = getFilters()
    const recipes = sortRecipes(filters.sortBy)
    const recipesByStatus = filterStatus(filters.filterStatus, recipes)
    const filteredRecipes = filterSearch(filters.filterSearch, recipesByStatus)

    const archived = recipes.filter((recipe) => recipe.archived).length

    recipesContainer.innerHTML = ''

    if (filteredRecipes.length > 0) {
        filteredRecipes.forEach((recipe) => {
            recipesContainer.appendChild(generateRecipeDOM(recipe))
        })
    } else if (archived > 0) {
        const emptyMessage = document.createElement('p')
              emptyMessage.classList.add('empty-message')
        emptyMessage.textContent = `There are no recipes. Currently ${archived} archived recipes.`
        recipesContainer.appendChild(emptyMessage)
    } else {
        const emptyMessage = document.createElement('p')
              emptyMessage.classList.add('empty-message')
        emptyMessage.textContent = 'There are no recipes :('
        recipesContainer.appendChild(emptyMessage)
    }
}


// ---- Initialize Edit page

const initEditPage = (recipeId) => {
    const titleElement = document.querySelector('#recipe-title')

    const favButton = document.querySelector('#recipe-fav')
          favButton.setAttribute('type', 'checkbox')
    const archiveButton = document.querySelector('#recipe-archive')
          archiveButton.setAttribute('type', 'checkbox')

    const recipe = getRecipes().find((recipe) => recipe.id === recipeId) 

    document.querySelector('#edit-title').textContent = `Recipe for: ${recipe.title}`

    if (!recipe) {
        location.assign('/index.html')
    }

    favButton.checked = recipe.fav
    archiveButton.checked = recipe.archived

    titleElement.value = recipe.title
    renderSteps()
    renderIngredients()

}

// ---- Generate steps

const generateStepLayout = (step, steps) => {
    const stepElement = document.createElement('div')
          stepElement.classList.add('step-item')
    const stepNumber = document.createElement('span')
    const stepText = document.createElement('input')
    const stepDeleteButton = document.createElement('button')
          stepDeleteButton.textContent = 'x'
          stepDeleteButton.classList.add('button--delete-small')

    const thisStepIndex = steps.indexOf(step)

    stepNumber.textContent = `Step #${thisStepIndex + 1}`
    stepElement.appendChild(stepNumber)

    stepText.value = step.process
    stepText.classList.add('step-field')
    stepElement.appendChild(stepText)

    stepElement.appendChild(stepDeleteButton)

    // Event Listeners
    stepText.addEventListener('input', (e) => {
        e.preventDefault()
        updateStep(recipeId, step.stepId, {
            process: e.target.value
        })
    })

    stepDeleteButton.addEventListener('click', () => {       
        if (thisStepIndex > -1) {
            steps.splice(thisStepIndex, 1)
            saveRecipes()
        }
        renderSteps()
    })

    return stepElement
}

const renderSteps = () => {
    const stepsContainer = document.querySelector('#recipe-steps')
          stepsContainer.innerHTML = ''

    const recipe = getRecipes().find((recipe) => recipe.id === recipeId)
    const steps = recipe.steps

    if (steps.length > 0) {
        steps.forEach((step) => {
            stepsContainer.appendChild(generateStepLayout(step, steps))
        })
    } else {
        const emptyMessage = document.createElement('p')
              emptyMessage.classList.add('empty-message')
        emptyMessage.textContent = 'No steps, yet.'
        stepsContainer.appendChild(emptyMessage)
    }
}


// ---- Generate ingredients

const generateIngredientLayout = (ingredient, ingredients) => {  
    const ingredientElement = document.createElement('label')
          ingredientElement.classList.add('ingredient-item')

    const ingredientCheckbox = document.createElement('input')
          ingredientCheckbox.setAttribute('type', 'checkbox')
          ingredientCheckbox.classList.add('checkbox')
    const ingredientText = document.createElement('input')
    const deleteIngredientButton = document.createElement('button')
          deleteIngredientButton.textContent = 'x'
          deleteIngredientButton.classList.add('button--delete-small')

    const thisIngredientIndex = ingredients.indexOf(ingredient)

    ingredientCheckbox.checked = ingredient.availability
    ingredientElement.appendChild(ingredientCheckbox)
       
    ingredientText.value = ingredient.ingredient
    ingredientText.classList.add('ingredient-field')
    ingredientElement.appendChild(ingredientText)

    ingredientElement.appendChild(deleteIngredientButton)

    // Ingredient Event Listeners
    ingredientCheckbox.addEventListener('change', () => {
        updateIngredient(recipeId, ingredient.ingredientId, {
            availability: !ingredient.availability
        })
    })

    ingredientText.addEventListener('input', (e) => {
        updateIngredient(recipeId, ingredient.ingredientId, {
            ingredient: e.target.value
        })
    })
       
    deleteIngredientButton.addEventListener('click', () => {
        if (thisIngredientIndex > -1) {
            ingredients.splice(thisIngredientIndex, 1)
            saveRecipes()
        }
        renderIngredients()
    })


    return ingredientElement
}

const renderIngredients = () => {
    const ingredientsContainer = document.querySelector('#recipe-ingredients')
    ingredientsContainer.innerHTML = ''

    const recipe = getRecipes().find((recipe) => recipe.id === recipeId)
    const ingredients = recipe.ingredients

    if (ingredients.length > 0) {
        ingredients.forEach((ingredient) => {
            ingredientsContainer.appendChild(generateIngredientLayout(ingredient, ingredients))
        })
    } else {
        const emptyMessage = document.createElement('p')
              emptyMessage.classList.add('empty-message')
        emptyMessage.textContent = 'No ingredients, yet'
        ingredientsContainer.appendChild(emptyMessage)
    }
}

export { renderRecipes, initEditPage, renderSteps, renderIngredients }