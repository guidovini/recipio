const filters = {
    filterSearch: '',
    sortBy: 'byEdited',
    filterStatus: 'byAll',
}

const getFilters = () => filters

const setFilters = (updates) => {
    if (typeof updates.sortBy === 'string') {
        filters.sortBy = updates.sortBy
    }

    if (typeof updates.filterStatus === 'string') {
        filters.filterStatus = updates.filterStatus
    }

    if (typeof updates.filterSearch === 'string') {
        filters.filterSearch = updates.filterSearch
    }
}

export { getFilters, setFilters }