import { addRight, fetchUsers, deleteRight, deleteUser, searchUsers, tagUser, toggleUserActivation, untagUser } from '@/api/users'

const users = {
  state: {
    fetchedUsers: [],
    loading: true,
    searchQuery: '',
    totalUsersCount: 0,
    currentPage: 1,
    filters: {
      localUsersOnly: false,
      externalUsersOnly: false,
      activeUsersOnly: false,
      deactivatedUsersOnly: false
    }
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.fetchedUsers = users
    },
    SET_LOADING: (state, status) => {
      state.loading = status
    },
    SWAP_USER: (state, user) => {
      const usersWithoutSwapped = state.fetchedUsers.filter(u => {
        return u.id !== user.id
      })

      state.fetchedUsers = [...usersWithoutSwapped, user].sort((a, b) =>
        a.nickname.localeCompare(b.nickname)
      )
    },
    SET_COUNT: (state, count) => {
      state.totalUsersCount = count
    },
    SET_PAGE: (state, page) => {
      state.currentPage = page
    },
    SET_PAGE_SIZE: (state, pageSize) => {
      state.pageSize = pageSize
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    },
    SET_USERS_FILTERS: (state, filters) => {
      state.filters = filters
    }
  },
  actions: {
    async FetchUsers({ commit, state, getters }, { page }) {
      const response = await fetchUsers(state.filters, getters.authHost, getters.token, page)

      commit('SET_LOADING', true)

      loadUsers(commit, page, response.data)
    },
    async ToggleUserActivation({ commit, getters }, nickname) {
      const response = await toggleUserActivation(nickname, getters.authHost, getters.token)

      commit('SWAP_USER', response.data)
    },
    async SearchUsers({ commit, dispatch, state, getters }, { query, page }) {
      if (query.length === 0) {
        commit('SET_SEARCH_QUERY', query)
        dispatch('FetchUsers', page)
      } else {
        commit('SET_LOADING', true)
        commit('SET_SEARCH_QUERY', query)

        const response = await searchUsers(query, state.filters, getters.authHost, getters.token, page)

        loadUsers(commit, page, response.data)
      }
    },
    async ToggleUsersFilter({ commit, dispatch, state }, filters) {
      const defaultFilters = {
        localUsersOnly: false,
        externalUsersOnly: false,
        activeUsersOnly: false,
        deactivatedUsersOnly: false
      }
      const currentFilters = { ...defaultFilters, ...filters }
      commit('SET_USERS_FILTERS', currentFilters)
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
    },
    async ClearFilters({ commit, dispatch, state }) {
      commit('CLEAR_USERS_FILTERS')
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
    },
    async ToggleRight({ commit, getters }, { user, right }) {
      user.roles[right]
        ? await deleteRight(user.nickname, right, getters.authHost, getters.token)
        : await addRight(user.nickname, right, getters.authHost, getters.token)

      const updatedUser = { ...user, roles: { ...user.roles, [right]: !user.roles[right] }}
      commit('SWAP_USER', updatedUser)
    },
    async DeleteUser({ commit, getters }, user) {
      await deleteUser(user.nickname, getters.authHost, getters.token)
      const updatedUser = { ...user, deactivated: true }
      commit('SWAP_USER', updatedUser)
    },
    async ToggleTag({ commit, getters }, { user, tag }) {
      if (user.tags.includes(tag)) {
        await untagUser(user.nickname, tag, getters.authHost, getters.token)
        const updatedUser = { ...user, tags: user.tags.filter(userTag => userTag !== tag) }
        commit('SWAP_USER', updatedUser)
      } else {
        await tagUser(user.nickname, tag, getters.authHost, getters.token)
        const updatedUser = { ...user, tags: [...user.tags, tag] }
        commit('SWAP_USER', updatedUser)
      }
    }
  }
}

const loadUsers = (commit, page, { users, count, page_size }) => {
  commit('SET_USERS', users)
  commit('SET_COUNT', count)
  commit('SET_PAGE', page)
  commit('SET_PAGE_SIZE', page_size)
  commit('SET_LOADING', false)
}

export default users
