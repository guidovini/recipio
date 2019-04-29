import './styles/sass/main.scss'

import { createRecipe } from './recipes'
import { renderRecipes } from './views'
import { setFilters } from './filters'

renderRecipes()

document.querySelector('#search-box').addEventListener('input', (e) => {
    setFilters({
        filterSearch: e.target.value
    }) 
    renderRecipes()
})

document.querySelector('#filter-by').addEventListener('change', (e) => {
    setFilters({
        sortBy: e.target.value
    }) 
    renderRecipes()
})

document.querySelector('#filter-status').addEventListener('change', (e) => {
    setFilters({
        filterState: e.target.value
    }) 
    renderRecipes()
})

document.querySelector('#add-recipe').addEventListener('click', (e) => {
    const id = createRecipe()
    location.assign(`/edit.html#${id}`)
})

window.addEventListener('storage', (e) => {
    // When local storage changes, render recipes.
    if (e.key === 'recipes') {
        renderRecipes()
    }
})