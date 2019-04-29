const filters = {
    filterSearch: '',
    sortBy: 'byEdited',
    filterState: 'byAll',
}

const getFilters = () => filters

const setFilters = (updates) => {
    if (typeof updates.sortBy === 'string') {
        filters.sortBy = updates.sortBy
    }

    if (typeof updates.filterState === 'string') {
        filters.filterState = updates.filterState
    }

    if (typeof updates.filterSearch === 'string') {
        filters.filterSearch = updates.filterSearch
    }
}

export { getFilters, setFilters }