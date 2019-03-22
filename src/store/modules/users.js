import { fetchUsers, toggleUserActivation, searchUsers } from '@/api/users'

const users = {
  state: {
    fetchedUsers: [],
    loading: true,
    searchQuery: '',
    totalUsersCount: 0,
    currentPage: 1,
    showLocalUsersOnly: false
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
        a.id.localeCompare(b.id)
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
    SET_LOCAL_USERS_FILTER: (state, value) => {
      state.showLocalUsersOnly = value
    }
  },
  actions: {
    async FetchUsers({ commit, state, getters }, { page }) {
      const response = await fetchUsers(state.showLocalUsersOnly, getters.token, page)

      commit('SET_LOADING', true)

      loadUsers(commit, page, response.data)
    },
    async ToggleUserActivation({ commit, getters }, nickname) {
      const response = await toggleUserActivation(nickname, getters.token)

      commit('SWAP_USER', response.data)
    },
    async SearchUsers({ commit, dispatch, state, getters }, { query, page }) {
      if (query.length === 0) {
        commit('SET_SEARCH_QUERY', query)
        dispatch('FetchUsers', page)
      } else {
        commit('SET_LOADING', true)
        commit('SET_SEARCH_QUERY', query)

        const response = await searchUsers(query, state.showLocalUsersOnly, getters.token, page)

        loadUsers(commit, page, response.data)
      }
    },
    async ToggleLocalUsersFilter({ commit, dispatch, state }, value) {
      commit('SET_LOCAL_USERS_FILTER', value)
      dispatch('SearchUsers', { query: state.searchQuery, page: 1 })
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
