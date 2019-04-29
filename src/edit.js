import './styles/sass/main.scss'

import { updateRecipe, getRecipes, deleteRecipe, saveRecipes } from './recipes'
import { initEditPage, renderSteps, renderIngredients } from './views'
import uuidv4 from 'uuid/v4'
import moment from 'moment'

const homeButton = document.querySelector('#home-button')
const deleteButton = document.querySelector('#recipe-delete')
const favButton = document.querySelector('#recipe-fav')
favButton.setAttribute('type', 'checkbox')
const archiveButton = document.querySelector('#recipe-archive')
archiveButton.setAttribute('type', 'checkbox')


// - Change recipe name
const titleElement = document.querySelector('#recipe-title')

// - Change recipe steps
const newStepElement = document.querySelector('#recipe-new-step')

// - Change recipe ingredients
const newIngredientElement = document.querySelector('#recipe-new-ingredient')

const recipeId = location.hash.substring('1')


initEditPage(recipeId)

homeButton.addEventListener('click', (e) => {
    location.assign('/index.html')
})

deleteButton.addEventListener('click', (e) => {
    deleteRecipe(recipeId)
    location.assign('/index.html')
})

favButton.addEventListener('change', (e) => {
    updateRecipe(recipeId, {
        fav: e.target.checked
    })
    initEditPage(recipeId)
})

archiveButton.addEventListener('change', (e) => {
    updateRecipe(recipeId, {
        archived: e.target.checked
    })
    initEditPage(recipeId)
})

titleElement.addEventListener('input', (e) => {
    updateRecipe(recipeId, {
        title: e.target.value.trim()
    })
})

newStepElement.addEventListener('submit', (e) => {
    const text = e.target.newStepInput.value.trim()

    e.preventDefault()

    if (text.length > 0) {
        updateRecipe(recipeId, {
            step: {
                stepId: `step-${uuidv4().slice(0,8)}`,
                process: text
            }
        })
        renderSteps()
        e.target.newStepInput.value = ''
    }
})

newIngredientElement.addEventListener('submit', (e) => {
    const text = e.target.newIngredientInput.value.trim()

    e.preventDefault()

    if (text.length > 0) {
        updateRecipe(recipeId, {
            ingredients: {
                ingredientId: `ingredient-${uuidv4().slice(0,8)}`,
                ingredient: text,
                availability: false
            }
        })
        renderIngredients()
        e.target.newIngredientInput.value = ''
    }
})

window.addEventListener('storage', (e) => {
    if (e.key === 'recipes') {
        initEditPage(recipeId)
    }
})




